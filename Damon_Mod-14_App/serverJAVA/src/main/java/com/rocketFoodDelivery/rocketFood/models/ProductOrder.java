package com.rocketFoodDelivery.rocketFood.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Entity representing the association between a Product and an Order.
 * Captures quantity, unit cost, and enforces product-restaurant relationship
 * integrity.
 * Used for persistence and business logic related to ordered products.
 */
@Entity
@Table(name = "product_orders", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "product_id", "order_id" })
})
public class ProductOrder {
    /** Unique identifier for the product-order association. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    /** Product included in the order. */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id")
    private Product product;

    /** Order to which the product belongs. */
    @ManyToOne(cascade = CascadeType.REMOVE)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    /** Quantity of the product ordered. */
    @Min(1)
    private Integer product_quantity;
    /** Unit cost of the product at the time of order. */
    @Min(0)
    private Integer product_unit_cost;

    @PrePersist
    private void validateBeforePersist() {
        if (!productBelongsToRestaurant()) {
            throw new IllegalArgumentException("ProductOrder instance is not valid");
        }
    }

    private boolean productBelongsToRestaurant() {
        if (product == null || order == null ||
                product.getRestaurant() == null || order.getRestaurant() == null) {
            return false;
        }
        // THIS LINE FAILS - products belong to different restaurants than the order
        return product.getRestaurant().equals(order.getRestaurant());
    }

    // Getters for the fields
    public Integer getProductQuantity() {
        return product_quantity;
    }

    public Integer getProductUnitCost() {
        return product_unit_cost;
    }

}
