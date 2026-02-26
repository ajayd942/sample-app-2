package com.ajay.sampleApp.db;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.db.entities.GuestEntity;
import com.google.inject.Inject;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import java.util.List;
import java.util.UUID;

@Loggable
public class GuestDAO extends AbstractDAO<GuestEntity> {

    @Inject
    public GuestDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public GuestEntity create(GuestEntity guest) {
        return persist(guest);
    }

    public List<GuestEntity> findAll() {
        return list((Query<GuestEntity>) namedQuery("com.ajay.sampleApp.db.entities.GuestEntity.findAll"));
    }

    public GuestEntity findById(UUID id) {
        return get(id);
    }

    public GuestEntity updateRsvp(UUID id, boolean attending, boolean needsCab) {
        GuestEntity guest = get(id);
        if (guest != null) {
            guest.setRsvpStatus(attending ? "ATTENDING" : "NOT_ATTENDING");
            guest.setNeedsCab(needsCab);
            persist(guest);
        }
        return guest;
    }

    public GuestEntity update(GuestEntity guest) {
        return (GuestEntity) currentSession().merge(guest);
    }

    public void delete(UUID id) {
        GuestEntity guest = get(id);
        if (guest != null) {
            currentSession().delete(guest);
        }
    }
}
