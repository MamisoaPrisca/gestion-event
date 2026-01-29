/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.dto;

import com.confidente.app.util.validator.MalagasyPhone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class UtilisateurDTO {
    @NotBlank(message = "Le login est obligatoire")
    @Size(min = 3, message = "Le login doit comporter entre 3 et 20 caractères")
    private String login;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 4, message = "Le mot de passe doit avoir au moins 4 caractères")
    private String password;

    private String prenom;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @MalagasyPhone
    private String contact;
}
