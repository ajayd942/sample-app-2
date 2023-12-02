package com.ajay.sampleApp;

import com.ajay.sampleApp.db.UserDao;
import com.ajay.sampleApp.redis.UserRedisService;
import com.ajay.sampleApp.resources.UserResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
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
    }
}
