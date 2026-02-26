package com.ajay.sampleApp.db.entities;

import lombok.*;
import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name="wedding_events", schema="public")
@NamedQuery(name = "com.ajay.sampleApp.db.entities.WeddingEventEntity.findAll", query = "SELECT e FROM WeddingEventEntity e ORDER BY e.displayOrder ASC")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class WeddingEventEntity {
    @Id
    @Column(name="id", updatable=false)
    private UUID id;

    @Column(name="event_name")
    private String eventName;

    @Column(name="location")
    private String location;

    @Column(name="start_time")
    private Date startTime;

    @Column(name="description")
    private String description;

    @Column(name="map_url")
    private String mapUrl;

    @Column(name="display_order")
    private int displayOrder;

    @PrePersist
    public void ensureId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
}
