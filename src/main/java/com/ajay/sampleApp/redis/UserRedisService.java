package com.ajay.sampleApp.redis;

import com.ajay.sampleApp.db.entities.UserEntity;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
import redis.clients.jedis.Jedis;

import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.Objects;

public class UserRedisService {
    private final Jedis jedisClient;

    @Inject
    public UserRedisService(Jedis jedisClient){
        this.jedisClient = jedisClient;
    }

//    public void setKey(String key, String value){
//            jedisClient.set(key, value);
//    }
//
//    public String getKey(String key){
//        return jedisClient.get(key);
//    }
//
//    public void setList(String key, List<String> valueList){
//        for( String value: valueList){
//            jedisClient.lpush(key, value);
//        }
//    }
//
//    public List<String> getList(String key, List<String> valueList){
//        return jedisClient.lrange(key, 0, -1);
//    }

    public void setUserInRedis( UserEntity user){
        String userId = String.valueOf(user.getId());
        SimpleDateFormat formatter = new SimpleDateFormat("dd-mm-yyyy", Locale.ENGLISH);
        if(Objects.nonNull(user.getDob())) {
            jedisClient.hset("USER:EMAIL", ImmutableMap.of(userId, user.getEmail()));
        }
        if(Objects.nonNull(user.getDob())) {
            jedisClient.hset("USER:DOB", ImmutableMap.of(userId, formatter.format(user.getDob())));
        }
        jedisClient.hset("USER:FULL_NAME", ImmutableMap.of(userId, user.getFullName()));
        if(Objects.nonNull(user.getPhone())) {
            jedisClient.hset("USER:PHONE", ImmutableMap.of(userId, user.getPhone()));
        }
        if(Objects.nonNull(user.getAdditionalInfo())) {
            jedisClient.hset("USER:ADDITIONAL_INFO", ImmutableMap.of(userId, user.getAdditionalInfo()));
        }
    }

    public UserEntity getUserInRedis(String userId) throws ParseException {
        String email = jedisClient.hget("USER:EMAIL", userId);
        SimpleDateFormat formatter = new SimpleDateFormat("dd-mm-yyyy", Locale.ENGLISH);
        if(Objects.isNull(email)){
            return null;
        }
        String dob = jedisClient.hget("USER:DOB", userId);
        String fullName = jedisClient.hget("USER:FULL_NAME", userId);
        String phone = jedisClient.hget("USER:PHONE", userId);
        String additionalInfo = jedisClient.hget("USER:ADDITIONAL_INFO", userId);
        return UserEntity.builder()
                .id(new BigInteger(userId))
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .dob(formatter.parse(dob))
                .additionalInfo(additionalInfo)
                .build();
    }

    public void deleteUserInRedis(String userId){
        jedisClient.hdel("USER:EMAIL", userId);
        jedisClient.hdel("USER:DOB", userId);
        jedisClient.hdel("USER:FULL_NAME", userId);
        jedisClient.hdel("USER:PHONE", userId);
        jedisClient.hdel("USER:ADDITIONAL_INFO", userId);
    }

//    public List<UserEntity> listAllUsersInRedis()  {
//        List<UserEntity> list = new LinkedList<>();
//        String oldCursor = "0";
//        String newCursor = ;
//        do{
//            ScanResult result = jedisClient.hgetAll();
//            result.get
//        } while(oldCursor != newCursor)
//    }
}
