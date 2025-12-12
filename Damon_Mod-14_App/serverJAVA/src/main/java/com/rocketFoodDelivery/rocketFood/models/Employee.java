package com.rocketFoodDelivery.rocketFood.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Entity representing an Employee in the RocketFood system.
 * Associates a user account and address with employee-specific contact details.
 * Used for persistence and business logic related to employees.
 */
@Entity
@Table(name = "employees")
public class Employee {

    /** Unique identifier for the employee. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /** Associated user account for authentication and authorization. */
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private UserEntity userEntity;

    /** Employee's address information. */
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;
    /** Employee's email address. */
    @Column(nullable = false)
    private String email;
    /** Employee's phone number. */
    @Column(nullable = false)
    private String phone;
}
