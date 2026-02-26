package com.ajay.sampleApp.data;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

import java.util.Date;

@Builder
@Data
public class User {
    @NonNull
    private int id;

    @NonNull
    private String fullName;

    private String email;

    private Date dob;

    private String phone;

    private String additionalInfo;
}
