/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public class MalagasyPhoneValidator implements ConstraintValidator<MalagasyPhone, String> {
    private static final String REGEX = "^(032|033|034|038|039)\\d{7}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // autoriser vide ou null
        }
        return value.matches(REGEX);
    }
    
}
