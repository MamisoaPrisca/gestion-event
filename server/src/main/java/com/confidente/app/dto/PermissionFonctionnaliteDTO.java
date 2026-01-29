/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.dto;

import java.util.List;
import lombok.Data;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Data
public class PermissionFonctionnaliteDTO {
    private String fonctionnalite;
    private List<PermissionDTO> permissions;

    public PermissionFonctionnaliteDTO(String fonctionnalites, List<PermissionDTO> permission) {
        this.permissions = permission;
        this.fonctionnalite = fonctionnalites;
    }
    
    
}
