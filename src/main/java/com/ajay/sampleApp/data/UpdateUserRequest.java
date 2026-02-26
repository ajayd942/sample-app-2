package com.ajay.sampleApp.data;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class UpdateUserRequest {
    private String fullName;
    private String dob;
    private String phone;
    private String additionalInfo;
}
