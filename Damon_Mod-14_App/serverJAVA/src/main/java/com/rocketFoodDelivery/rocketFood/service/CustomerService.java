// ...existing code...
package com.rocketFoodDelivery.rocketFood.service;

import com.rocketFoodDelivery.rocketFood.models.Customer;
import com.rocketFoodDelivery.rocketFood.repository.CustomerRepository;
import com.rocketFoodDelivery.rocketFood.dtos.ApiCustomerDTO;
import com.rocketFoodDelivery.rocketFood.dtos.AccountUpdateDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }

    public Optional<ApiCustomerDTO> getCustomerById(int id) {
        return customerRepository.findById(id).map(customer -> ApiCustomerDTO.builder()
                .id(customer.getId())
                .active(customer.isActive())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address_id(customer.getAddress().getId())
                .user_id(customer.getUserEntity().getId())
                .build());
    }

    public Optional<ApiCustomerDTO> updateCustomer(int id, AccountUpdateDTO updateDTO) {
        return customerRepository.findById(id).map(customer -> {
            if (updateDTO.getCustomerEmail() != null) {
                customer.setEmail(updateDTO.getCustomerEmail());
            }
            if (updateDTO.getCustomerPhone() != null) {
                customer.setPhone(updateDTO.getCustomerPhone());
            }
            customerRepository.save(customer);
            return ApiCustomerDTO.builder()
                    .id(customer.getId())
                    .active(customer.isActive())
                    .email(customer.getEmail())
                    .phone(customer.getPhone())
                    .address_id(customer.getAddress().getId())
                    .user_id(customer.getUserEntity().getId())
                    .build();
        });
    }
}