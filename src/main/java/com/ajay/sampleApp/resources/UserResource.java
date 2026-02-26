package com.ajay.sampleApp.resources;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.data.CreateUserRequest;
import com.ajay.sampleApp.data.UpdateUserRequest;
import com.ajay.sampleApp.db.UserDao;
import com.ajay.sampleApp.db.entities.UserEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import io.dropwizard.hibernate.UnitOfWork;
import org.eclipse.jetty.http.HttpStatus;

import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Path("/Users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Loggable
public class UserResource {
    private final UserDao userDao;

    private final ObjectMapper mapper;

    @Inject
    public UserResource(UserDao UserDao, ObjectMapper mapper) {
        this.userDao = UserDao;
        this.mapper = mapper;
    }

    @GET
    @UnitOfWork
    public Response getAllUsers() {
        List<UserEntity> users;
        try {
            users = userDao.listAll();
        } catch (Exception e){
            return Response.serverError().entity(e.getMessage()).build();
        }
        return Response.ok().entity(users).build();
    }

    @POST
    @UnitOfWork
    public Response createUser(@Valid CreateUserRequest createUserRequest) {
        // Validate if dob is in date format
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
        Date dob = null;
        try {
            dob = Objects.nonNull(createUserRequest.getDob()) ? formatter.parse(createUserRequest.getDob()) : dob;
        } catch (ParseException e) {
            Exception cause = new IllegalArgumentException("Dob is not a valid date");
            return Response.status(400).entity(cause).build();
        }
        UserEntity user;
        try {
            user = userDao.create(UserEntity.builder()
                    .fullName(createUserRequest.getFullName())
                    .dob(dob)
                    .email(createUserRequest.getEmail())
                    .phone(createUserRequest.getPhone())
                    .additionalInfo(createUserRequest.getAdditionalInfo())
                    .build());
        } catch (Exception e){
            return Response.serverError().entity(e.getMessage()).build();
        }
        return Response.ok().entity(user).build();
    }

    @GET
    @Path("/{UserId}")
    @UnitOfWork
    public Response getUserById(@PathParam("UserId") BigInteger UserId) {
        UserEntity user;
        try {
            user = userDao.findById(UserId);
        } catch (Exception e){
            return Response.serverError().entity(e.getMessage()).build();
        }
        if(Objects.isNull(user)){
            return Response.status(HttpStatus.NOT_FOUND_404).build();
        }
        return Response.ok().entity(user).build();
    }

    @PUT
    @Path("/{UserId}")
    @UnitOfWork
    public Response updateUser(@PathParam("UserId") BigInteger UserId, @Valid UpdateUserRequest updateUserRequest) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
        Date dob = null;
        if(Objects.nonNull(updateUserRequest.getDob())) {
            try {
                dob = Objects.nonNull(updateUserRequest.getDob()) ? formatter.parse(updateUserRequest.getDob()) : dob;
            } catch (ParseException e) {
                return Response.status(400).entity(String.format("Parsing date failed with error: %s", e.getMessage())).build();
            }
        }
        UserEntity existingUser;
        try {
            existingUser = userDao.findById(UserId);
        } catch(Exception e){
            return Response.serverError().entity(String.format("Failed to save the user with error: %s",e.getMessage())).build();
        }
        if(Objects.isNull(existingUser)){
            return Response.status(HttpStatus.NOT_FOUND_404).entity(String.format("User with ID: %s does not exist", UserId)).build();
        }
        existingUser.setFullName(updateUserRequest.getFullName());
        existingUser.setDob(dob);
        existingUser.setPhone(updateUserRequest.getPhone());
        existingUser.setAdditionalInfo(updateUserRequest.getAdditionalInfo());
        UserEntity updatedUser;
        try {
            updatedUser = userDao.update(existingUser);
        } catch(Exception e){
            return Response.serverError().entity(String.format("Failed to save the user with error: %s",e.getMessage())).build();
        }
        return Response.ok().entity(updatedUser).build();
    }

    @DELETE
    @Path("/{UserId}")
    @UnitOfWork
    public Response deleteUser(@PathParam("UserId") BigInteger UserId) {
        UserEntity existingUser;
        try {
            existingUser = userDao.findById(UserId);
        } catch(Exception e){
            return Response.serverError().entity(String.format("Failed to delete the user with error: %s",e.getMessage())).build();
        }
        if(Objects.isNull(existingUser)){
            return Response.status(HttpStatus.NOT_FOUND_404).entity(String.format("User with ID: %s does not exist", UserId)).build();
        }
        try {
            userDao.delete(existingUser);
        }  catch (Exception e){
            return Response.serverError().entity(e.getMessage()).build();
        }
        return Response.ok().entity(String.format("User with ID: %s deleted", UserId)).build();
    }
}
