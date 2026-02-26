package com.ajay.sampleApp.db;

import com.ajay.sampleApp.core.logging.Loggable;
import com.ajay.sampleApp.db.entities.UserEntity;
import com.ajay.sampleApp.redis.UserRedisService;
import com.google.inject.Inject;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.math.BigInteger;
import java.text.ParseException;
import java.util.List;
import java.util.Objects;

@Loggable
public class UserDao extends AbstractDAO<UserEntity> {

    private final UserRedisService userRedisService;

    @Inject
    public UserDao(SessionFactory sessionFactory, UserRedisService userRedisService) {
        super(sessionFactory);
        this.userRedisService = userRedisService;
    }

    public List<UserEntity> listAll() {
        CriteriaBuilder builder = currentSession().getCriteriaBuilder();
        CriteriaQuery<UserEntity> criteria = builder.createQuery(UserEntity.class);
        Root<UserEntity> root = criteria.from(UserEntity.class);
        criteria.select(root);
        return list(criteria);
    }

    public UserEntity findById(BigInteger id) {
        UserEntity user;
        try {
            user = userRedisService.getUserInRedis(String.valueOf(id));
            if(Objects.nonNull(user)){
                return user;
            }
        } catch (ParseException e) {
            // Log the error and fallback to DB
            e.printStackTrace();
        }
        user = get(id);
        if(Objects.nonNull(user)) {
            userRedisService.setUserInRedis(user);
        }
        return user;
    }

    public UserEntity create(UserEntity UserEntity) {
        UserEntity user= persist(UserEntity);
        userRedisService.setUserInRedis(user);
        return user;
    }

    public UserEntity update(UserEntity userEntity) {
        currentSession().merge(userEntity);
        UserEntity newUser = get(userEntity.getId());
        userRedisService.setUserInRedis(newUser);
        return newUser;
    }

    public void delete(UserEntity userEntity) {
        currentSession().delete(userEntity);
        userRedisService.deleteUserInRedis(String.valueOf(userEntity.getId()));
    }
}
