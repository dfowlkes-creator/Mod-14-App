package com.rocketFoodDelivery.rocketFood.controller.api;

import com.rocketFoodDelivery.rocketFood.dtos.AccountUpdateDTO;

import com.rocketFoodDelivery.rocketFood.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

// other imports
import com.rocketFoodDelivery.rocketFood.dtos.ApiCustomerDTO;

/**
 * CustomerApiController - REST API endpoints for customer operations
 * Handles customer information retrieval and updates
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerApiController {

    private final CustomerService customerService;

    public CustomerApiController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * Get customer information by customer ID
     * 
     * @param id - Customer ID
     * @return ResponseEntity with customer details or error message
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        Optional<ApiCustomerDTO> customer = customerService.getCustomerById(id);

        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Customer not found"));
        }

        return ResponseEntity.ok(customer.get());
    }

    /**
     * Update customer information by customer ID
     *
     * @param id        - Customer ID
     * @param updateDTO - DTO with fields to update
     * @return ResponseEntity with updated customer details or error message
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody AccountUpdateDTO updateDTO) {
        Optional<ApiCustomerDTO> updated = customerService.updateCustomer(id, updateDTO);
        if (updated.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Customer not found"));
        }
        return ResponseEntity.ok(updated.get());
    }

}
