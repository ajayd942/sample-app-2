package com.ajay.sampleApp.db.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import lombok.*;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Entity
@Table(name="users", schema="public")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UserEntity {
    @Id
    @Column(name="id", updatable=false)
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private BigInteger id;

    @Column(name="full_name")
    @NonNull
    private String fullName;

    @Column(name="email")
    @NonNull
    private String email;
    @Column(name="dob")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date dob;
    @Column(name="phone")
    private String phone;
    
    @Type(JsonType.class)
    @Column(name = "additional_info", columnDefinition = "jsonb")
    private String additionalInfo;

}
