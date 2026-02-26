package com.ajay.sampleApp.redis;

import com.ajay.sampleApp.db.entities.UserEntity;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;

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
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
        Pipeline pipeline = jedisClient.pipelined();
        if(Objects.nonNull(user.getDob())) {
            pipeline.hset("USER:EMAIL", ImmutableMap.of(userId, user.getEmail()));
        }
        if(Objects.nonNull(user.getDob())) {
            pipeline.hset("USER:DOB", ImmutableMap.of(userId, formatter.format(user.getDob())));
        }
        pipeline.hset("USER:FULL_NAME", ImmutableMap.of(userId, user.getFullName()));
        if(Objects.nonNull(user.getPhone())) {
            pipeline.hset("USER:PHONE", ImmutableMap.of(userId, user.getPhone()));
        }
        if(Objects.nonNull(user.getAdditionalInfo())) {
            pipeline.hset("USER:ADDITIONAL_INFO", ImmutableMap.of(userId, user.getAdditionalInfo()));
        }
        pipeline.sync();
    }

    public UserEntity getUserInRedis(String userId) throws ParseException {
        String email = jedisClient.hget("USER:EMAIL", userId);
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
        if(Objects.isNull(email)){
            return null;
        }
        Pipeline pipeline = jedisClient.pipelined();
        Response<String> dobResponse = pipeline.hget("USER:DOB", userId);
        Response<String> fullNameResponse = pipeline.hget("USER:FULL_NAME", userId);
        Response<String> phoneResponse = pipeline.hget("USER:PHONE", userId);
        Response<String> additionalInfoResponse = pipeline.hget("USER:ADDITIONAL_INFO", userId);
        pipeline.sync();
        return UserEntity.builder()
                .id(new BigInteger(userId))
                .fullName(fullNameResponse.get())
                .email(email)
                .phone(phoneResponse.get())
                .dob(formatter.parse(dobResponse.get()))
                .additionalInfo(additionalInfoResponse.get())
                .build();
    }

    public void deleteUserInRedis(String userId){
        Pipeline pipeline = jedisClient.pipelined();
        pipeline.hdel("USER:EMAIL", userId);
        pipeline.hdel("USER:DOB", userId);
        pipeline.hdel("USER:FULL_NAME", userId);
        pipeline.hdel("USER:PHONE", userId);
        pipeline.hdel("USER:ADDITIONAL_INFO", userId);
        pipeline.sync();
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
