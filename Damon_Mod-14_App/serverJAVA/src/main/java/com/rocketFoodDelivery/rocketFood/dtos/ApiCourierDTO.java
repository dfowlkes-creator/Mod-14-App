package com.rocketFoodDelivery.rocketFood.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiCourierDTO {
    private int id;
    private String email;
    private String phone;
    private int address_id;
    private String street_address;
    private String city;
    private String postal_code;
    private int courier_status_id;
    private String courier_status_name;
    private boolean active;
    private int user_id;
}
