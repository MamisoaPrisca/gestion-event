/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.modele;

import com.confidente.app.util.StringPrefixedId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "permission_role")
public class PermissionRole {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "PR", sequence = "seq_permission_role_id",size = 8)
    private String idPermissionRole;
    @Column
    private String idPermission;
    @Column
    private String idRole;

    public PermissionRole(String idPermission, String idRole) {
        this.idPermission = idPermission;
        this.idRole = idRole;
    }
    
    
}
