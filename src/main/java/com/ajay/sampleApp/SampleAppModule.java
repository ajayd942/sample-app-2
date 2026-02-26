package com.ajay.sampleApp;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.core.logging.LoggingInterceptor;
import com.ajay.sampleApp.db.GuestDAO;
import com.ajay.sampleApp.db.UserDao;
import com.ajay.sampleApp.db.WeddingEventDAO;
import com.ajay.sampleApp.redis.UserRedisService;
import com.ajay.sampleApp.resources.AdminResource;
import com.ajay.sampleApp.resources.UserResource;
import com.ajay.sampleApp.resources.WeddingResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.matcher.Matchers;
import io.dropwizard.hibernate.HibernateBundle;
import org.hibernate.SessionFactory;
import redis.clients.jedis.Jedis;

public class SampleAppModule extends AbstractModule {

    private final SampleAppConfiguration config;
    private final HibernateBundle<SampleAppConfiguration> hibernateBundle;

    public SampleAppModule(SampleAppConfiguration config, HibernateBundle<SampleAppConfiguration> hibernateBundle){
        this.config = config;
        this.hibernateBundle = hibernateBundle;
    }

    @Provides
    @Singleton
    private SessionFactory getSessionFactory(){
        return this.hibernateBundle.getSessionFactory();
    }

    @Provides
    @Singleton
    private UserDao getUserDao(SessionFactory sessionFactory, UserRedisService userRedisService){
        return new UserDao(sessionFactory, userRedisService);
    }

    @Provides
    @Singleton
    private GuestDAO getGuestDAO(SessionFactory sessionFactory){
        return new GuestDAO(sessionFactory);
    }

    @Provides
    @Singleton
    private WeddingEventDAO getWeddingEventDAO(SessionFactory sessionFactory){
        return new WeddingEventDAO(sessionFactory);
    }

    @Provides
    @Singleton
    private ObjectMapper getObjectMapper(){
        return new ObjectMapper();
    }

    @Provides
    @Singleton
    private UserResource getUserResource(UserDao userDao, ObjectMapper mapper){
        return new UserResource(userDao, mapper);
    }

    @Provides
    @Singleton
    private WeddingResource getWeddingResource(GuestDAO guestDAO, WeddingEventDAO weddingEventDAO, Jedis jedis, ObjectMapper mapper){
        return new WeddingResource(guestDAO, weddingEventDAO, jedis, mapper);
    }

    @Provides
    @Singleton
    private AdminResource getAdminResource(GuestDAO guestDAO, WeddingEventDAO weddingEventDAO, SampleAppConfiguration configuration, Jedis jedis){
        return new AdminResource(guestDAO, weddingEventDAO, configuration, jedis);
    }

    @Provides
    @Singleton
    private Jedis getJedisClient(){
        return new Jedis(config.getRedisHost());
    }

    @Provides
    @Singleton
    private UserRedisService getRedisCacheService(Jedis jedisClient){
        return new UserRedisService(jedisClient);
    }

    @Override
    protected void configure() {
        bind(SampleAppConfiguration.class).toInstance(config);

        LoggingInterceptor loggingInterceptor = new LoggingInterceptor();
        requestInjection(loggingInterceptor);
        bindInterceptor(Matchers.any(), Matchers.annotatedWith(Loggable.class), loggingInterceptor);
        bindInterceptor(Matchers.annotatedWith(Loggable.class), Matchers.any(), loggingInterceptor);
    }
}
