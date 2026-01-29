/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Ny Anjara Mamisoa
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InfoUtilisateurDTO {
    private String prenom;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Pattern(regexp = "^(032|033|034|038|039)\\d{7}$", message = "Le contact doit être un numéro malgache valide")
    private String contact;
}
