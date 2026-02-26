package com.ajay.sampleApp.db;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.db.entities.WeddingEventEntity;
import com.google.inject.Inject;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import java.util.List;
import java.util.UUID;

@Loggable
public class WeddingEventDAO extends AbstractDAO<WeddingEventEntity> {

    @Inject
    public WeddingEventDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public WeddingEventEntity create(WeddingEventEntity event) {
        return persist(event);
    }

    public List<WeddingEventEntity> findAll() {
        return list((Query<WeddingEventEntity>) namedQuery("com.ajay.sampleApp.db.entities.WeddingEventEntity.findAll"));
    }

    public WeddingEventEntity findById(UUID id) {
        return get(id);
    }

    public WeddingEventEntity update(WeddingEventEntity event) {
        return (WeddingEventEntity) currentSession().merge(event);
    }

    public void delete(UUID id) {
        WeddingEventEntity event = get(id);
        if (event != null) {
            currentSession().delete(event);
        }
    }
}
