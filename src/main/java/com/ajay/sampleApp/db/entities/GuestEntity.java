package com.ajay.sampleApp.db.entities;

import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name="guests", schema="public")
@NamedQuery(name = "com.ajay.sampleApp.db.entities.GuestEntity.findAll", query = "SELECT g FROM GuestEntity g")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class GuestEntity {
    @Id
    @Column(name="id", updatable=false)
    private UUID id;

    @Column(name="full_name")
    @NonNull
    private String fullName;

    @Column(name="phone_number")
    private String phoneNumber;

    @Column(name="email")
    private String email;

    @Column(name="rsvp_status")
    @Builder.Default
    private String rsvpStatus = "PENDING";

    @Column(name="needs_cab")
    @Builder.Default
    private boolean needsCab = false;

    @Column(name="arrival_time")
    private Date arrivalTime;

    @Column(name="departure_time")
    private Date departureTime;

    @Column(name="guest_count")
    @Builder.Default
    private int guestCount = 1;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    public void ensureId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
}
