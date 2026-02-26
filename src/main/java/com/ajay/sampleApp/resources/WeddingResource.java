package com.ajay.sampleApp.resources;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.data.RsvpRequest;
import com.ajay.sampleApp.db.GuestDAO;
import com.ajay.sampleApp.db.WeddingEventDAO;
import com.ajay.sampleApp.db.entities.GuestEntity;
import com.ajay.sampleApp.db.entities.WeddingEventEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import io.dropwizard.hibernate.UnitOfWork;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import redis.clients.jedis.Jedis;

import java.util.List;

@Path("/api/wedding")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Loggable
public class WeddingResource {

    private final GuestDAO guestDAO;
    private final WeddingEventDAO weddingEventDAO;
    private final Jedis jedis;
    private final ObjectMapper objectMapper;

    @Inject
    public WeddingResource(GuestDAO guestDAO, WeddingEventDAO weddingEventDAO, Jedis jedis, ObjectMapper objectMapper) {
        this.guestDAO = guestDAO;
        this.weddingEventDAO = weddingEventDAO;
        this.jedis = jedis;
        this.objectMapper = objectMapper;
    }

    @POST
    @Path("/rsvp")
    @UnitOfWork
    public Response rsvp(RsvpRequest request) {
        GuestEntity guest = GuestEntity.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .rsvpStatus(request.isAttending() ? "ATTENDING" : "NOT_ATTENDING")
                .needsCab(request.isNeedsCab())
                .guestCount(request.getGuestCount())
                .build();

        GuestEntity savedGuest = guestDAO.create(guest);
        return Response.ok(savedGuest).build();
    }

    @GET
    @Path("/events")
    @UnitOfWork
    public Response getEvents() {
        String cacheKey = "wedding_events_cache";
        String cachedEvents = jedis.get(cacheKey);

        if (cachedEvents != null) {
            try {
                List<WeddingEventEntity> events = objectMapper.readValue(cachedEvents, new TypeReference<List<WeddingEventEntity>>() {});
                return Response.ok(events).build();
            } catch (JsonProcessingException e) {
                // Log error and fallback to DB
                e.printStackTrace();
            }
        }

        // This DAO method is already updated to sort by displayOrder ASC
        List<WeddingEventEntity> events = weddingEventDAO.findAll();
        try {
            String jsonEvents = objectMapper.writeValueAsString(events);
            jedis.setex(cacheKey, 24 * 60 * 60, jsonEvents); // 24 hours TTL
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return Response.ok(events).build();
    }
}
