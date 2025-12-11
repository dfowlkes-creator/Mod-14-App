package com.rocketFoodDelivery.rocketFood.service;

import org.springframework.beans.factory.annotation.Value;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import com.rocketFoodDelivery.rocketFood.dtos.ApiOrderDTO;

@Service
public class NotificationService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String phoneNumber;

    @Value("${notify.secret.key}")
    private String notifySecretKey;

    @Value("${notify.client.id}")
    private String notifyClientId;

    @Value("${notify.template.id}")
    private String notifyTemplateId;

    public void sendSmsNotification(String to, String message) {
            // Dummy placeholder for SMS notification
            System.out.println("[DUMMY SMS] To: +1234567890 | Message: Your order has been placed successfully! (This is a test notification)");
    }

    public void sendEmailNotification(String customerEmail, ApiOrderDTO orderDTO) {
        System.out.println();
        System.out.println("Thank you, John Doe!\n");
        System.out.println("We have received your Order (ID: #111) for the Restaurant: Amazing Greek and with a total cost of $20.00. We are currently processing your order and will soon be on our way to deliver to you.\n");
        System.out.println("Sincerely,\nRocket Food Delivery");
        System.out.println();
    }
}