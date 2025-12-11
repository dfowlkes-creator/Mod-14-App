package com.rocketFoodDelivery.rocketFood.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Entity representing a Courier in the RocketFood system.
 * Associates a user account, address, courier status, and contact details for
 * delivery operations.
 * Used for persistence and business logic related to couriers.
 */
@Entity
public class Courier {
    /** Unique identifier for the courier. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /** Associated user account for authentication and authorization. */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private UserEntity userEntity;

    /** Courier's address information. */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    /** Current status of the courier (e.g., available, busy). */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "courierStatus_id")
    private CourierStatus courierStatus;
    /** Courier's phone number. */
    @Column(nullable = false)
    private String phone;
    /** Courier's email address. */
    @Column(nullable = false)
    @Email
    private String email;

    /** Indicates if the courier account is active. */
    @Builder.Default
    @Column(columnDefinition = "boolean default true") // default
    private boolean active = true;
}
