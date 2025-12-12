
/**
 * Data Transfer Object for Product entity used in API operations.
 * Contains product details such as name, cost, and description for client-server communication.
 */
package com.rocketFoodDelivery.rocketFood.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ApiProductDTO {
    /** Unique identifier for the product. */
    int id;
    /** Name of the product. */
    String name;
    /** Cost of the product in cents or smallest currency unit. */
    int cost;
    /** Description of the product. */
    String description;
}
