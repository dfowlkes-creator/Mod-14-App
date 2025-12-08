package com.rocketFoodDelivery.rocketFood.controller.api;

import com.rocketFoodDelivery.rocketFood.dtos.ApiCourierDTO;
import com.rocketFoodDelivery.rocketFood.service.CourierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

/**
 * CourierApiController - REST API endpoints for courier operations
 * Handles courier information retrieval and updates
 */
@RestController
@RequestMapping("/api/couriers")
public class CourierApiController {

    @Autowired
    private CourierService courierService;

    /**
     * Get courier information by courier ID
     * 
     * @param id - Courier ID
     * @return ResponseEntity with courier details or error message
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourierById(@PathVariable int id) {
        Optional<ApiCourierDTO> courier = courierService.getCourierById(id);

        if (courier.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Courier not found"));
        }

        return ResponseEntity.ok(courier.get());
    }

    /**
     * Get all active couriers
     * 
     * @return ResponseEntity with list of active couriers
     */
    @GetMapping
    public ResponseEntity<?> getAllActiveCouriers() {
        return ResponseEntity.ok(courierService.getAllActiveCouriers());
    }

    /**
     * Update courier status
     * 
     * @param id       - Courier ID
     * @param statusId - New status ID
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCourierStatus(
            @PathVariable int id,
            @RequestParam int statusId) {

        boolean updated = courierService.updateCourierStatus(id, statusId);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Courier not found or invalid status"));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "Courier status updated successfully"));
    }

    /**
     * Update courier active status
     * 
     * @param id     - Courier ID
     * @param active - Active status (true/false)
     * @return ResponseEntity with success or error message
     */
    @PutMapping("/{id}/active")
    public ResponseEntity<?> updateCourierActiveStatus(
            @PathVariable int id,
            @RequestParam boolean active) {

        boolean updated = courierService.updateCourierActiveStatus(id, active);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Courier not found"));
        }

        return ResponseEntity.ok(Collections.singletonMap("message", "Courier active status updated successfully"));
    }
}
