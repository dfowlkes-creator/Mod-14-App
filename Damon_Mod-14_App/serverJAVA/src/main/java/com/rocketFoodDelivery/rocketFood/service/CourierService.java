package com.rocketFoodDelivery.rocketFood.service;

import com.rocketFoodDelivery.rocketFood.dtos.ApiCourierDTO;
import com.rocketFoodDelivery.rocketFood.models.Courier;
import com.rocketFoodDelivery.rocketFood.repository.CourierRepository;
import com.rocketFoodDelivery.rocketFood.repository.CourierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourierService {

    private final CourierRepository courierRepository;
    private final CourierStatusRepository courierStatusRepository;

    @Autowired
    public CourierService(CourierRepository courierRepository, CourierStatusRepository courierStatusRepository) {
        this.courierRepository = courierRepository;
        this.courierStatusRepository = courierStatusRepository;
    }

    /**
     * Get courier by ID and convert to DTO
     */
    public Optional<ApiCourierDTO> getCourierById(int id) {
        Optional<Courier> courier = courierRepository.findById(id);
        return courier.map(this::convertToDTO);
    }

    /**
     * Get all active couriers
     */
    public List<ApiCourierDTO> getAllActiveCouriers() {
        return courierRepository.findAll().stream()
                .filter(Courier::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update courier status
     */
    public boolean updateCourierStatus(int courierId, int statusId) {
        Optional<Courier> courierOpt = courierRepository.findById(courierId);

        if (courierOpt.isEmpty()) {
            return false;
        }

        // Validate that the status exists
        if (!courierStatusRepository.existsById(statusId)) {
            return false;
        }

        Courier courier = courierOpt.get();
        courier.setCourierStatus(courierStatusRepository.findById(statusId).orElse(null));
        courierRepository.save(courier);
        return true;
    }

    /**
     * Update courier active status
     */
    public boolean updateCourierActiveStatus(int courierId, boolean active) {
        Optional<Courier> courierOpt = courierRepository.findById(courierId);

        if (courierOpt.isEmpty()) {
            return false;
        }

        Courier courier = courierOpt.get();
        courier.setActive(active);
        courierRepository.save(courier);
        return true;
    }

    /**
     * Convert Courier entity to DTO
     */
    private ApiCourierDTO convertToDTO(Courier courier) {
        return ApiCourierDTO.builder()
                .id(courier.getId())
                .email(courier.getEmail())
                .phone(courier.getPhone())
                .address_id(courier.getAddress() != null ? courier.getAddress().getId() : 0)
                .street_address(courier.getAddress() != null ? courier.getAddress().getStreetAddress() : "")
                .city(courier.getAddress() != null ? courier.getAddress().getCity() : "")
                .postal_code(courier.getAddress() != null ? courier.getAddress().getPostalCode() : "")
                .courier_status_id(courier.getCourierStatus() != null ? courier.getCourierStatus().getId() : 0)
                .courier_status_name(courier.getCourierStatus() != null ? courier.getCourierStatus().getName() : "")
                .active(courier.isActive())
                .user_id(courier.getUserEntity() != null ? courier.getUserEntity().getId() : 0)
                .build();
    }
}
