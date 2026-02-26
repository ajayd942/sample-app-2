package com.ajay.sampleApp.data;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class CreateUserRequest {
    @NonNull
    private String fullName;

    @NonNull
    private String email;

    private String dob;

    private String phone;

    private String additionalInfo;
}
