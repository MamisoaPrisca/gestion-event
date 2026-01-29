/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public class Main {
     public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        // Vérifier un hash existant
        String raw = "1234";
        String hashFromDB = "$2a$10$7wAq0e5xZdV7H1w2sT7R4e0VxkJH6YwX6Gq5EJ0pKPL4e5QW1kLzq";

        // OU générer un nouveau hash (à stocker en base)
        String newHash = encoder.encode(raw);
    }
}
