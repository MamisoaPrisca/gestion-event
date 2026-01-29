/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.dto;

import lombok.Data;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Data
public class PermissionDTO {
    private String idPermission;
    private String idFonctionalite;
    private String fonctionalite;
    private String nom;
    private String description;
    private boolean autoriser;

    public PermissionDTO(String idPermission, String idFonctionalite, String fonctionalite, String nom, String description, boolean autoriser) {
        this.idPermission = idPermission;
        this.idFonctionalite = idFonctionalite;
        this.fonctionalite = fonctionalite;
        this.nom = nom;
        this.description = description;
        this.autoriser = autoriser;
    }
    
    
}
