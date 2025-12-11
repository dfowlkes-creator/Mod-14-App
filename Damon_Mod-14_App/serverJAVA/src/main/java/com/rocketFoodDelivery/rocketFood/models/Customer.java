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
 * Entity representing a Customer in the RocketFood system.
 * Associates a user account, address, and contact details for order placement
 * and management.
 * Used for persistence and business logic related to customers.
 */
@Entity
@Table(name = "customers")
public class Customer {
    /** Unique identifier for the customer. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /** Associated user account for authentication and authorization. */
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private UserEntity userEntity;

    /** Customer's address information. */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    /** Indicates if the customer account is active. */
    @Builder.Default
    @Column(columnDefinition = "boolean default true")
    private boolean active = true;
    /** Customer's phone number. */
    @Column(nullable = false)
    private String phone;

    /** Customer's email address. */
    @Email
    @Column(nullable = false)
    private String email;
}
