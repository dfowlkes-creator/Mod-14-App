package com.rocketFoodDelivery.rocketFood.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiCustomerDTO {
    private int id;
    private boolean active;
    private String email;
    private String phone;
    private int address_id;
    private int user_id;
}
