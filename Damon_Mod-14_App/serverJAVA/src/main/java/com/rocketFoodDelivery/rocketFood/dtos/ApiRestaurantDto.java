
/**
 * Data Transfer Object representing a Restaurant entity for API communication.
 * Encapsulates restaurant details such as name, price range, rating, and active status.
 * Used for serialization/deserialization between backend and client applications.
 */
package com.rocketFoodDelivery.rocketFood.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiRestaurantDto {
    /** Unique identifier for the restaurant. */
    int id;

    /** Name of the restaurant. */
    String name;

    /** Price range category (e.g., 1=low, 2=medium, 3=high). */
    @JsonProperty("price_range")
    int priceRange;

    /** Average rating of the restaurant (e.g., 1-5 stars). */
    int rating;

    /** Indicates if the restaurant is currently active and available. */
    @JsonProperty("active")
    private boolean active;
}
