package com.ajay.sampleApp.data;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class RsvpRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private boolean attending;
    private boolean needsCab;
    private int guestCount;
}
