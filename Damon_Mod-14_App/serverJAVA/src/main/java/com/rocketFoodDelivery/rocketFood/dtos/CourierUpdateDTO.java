package com.rocketFoodDelivery.rocketFood.dtos;

public class CourierUpdateDTO {
    private String courierEmail;
    private String courierPhone;

    public String getCourierEmail() {
        return courierEmail;
    }

    public void setCourierEmail(String courierEmail) {
        this.courierEmail = courierEmail;
    }

    public String getCourierPhone() {
        return courierPhone;
    }

    public void setCourierPhone(String courierPhone) {
        this.courierPhone = courierPhone;
    }
}
