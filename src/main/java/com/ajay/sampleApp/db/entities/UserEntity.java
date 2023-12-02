package com.ajay.sampleApp.db.entities;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Entity
@Table(name="user", schema="public")
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UserEntity {
    @Id
    @Column(name="id", updatable=false)
    @SequenceGenerator(name="user_id_seq", sequenceName="user_id_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="user_id_seq")
    private BigInteger id;

    @Column(name="full_name")
    @NonNull
    private String fullName;

    @Column(name="email")
    @NonNull
    private String email;
    @Column(name="dob")
    private Date dob;
    @Column(name="phone")
    private String phone;
    @Type(type = "json")
    @Column(name = "additional_info", columnDefinition = "json")
    private String additionalInfo;

}
