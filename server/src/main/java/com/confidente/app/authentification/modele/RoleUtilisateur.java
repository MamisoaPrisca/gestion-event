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
@Table(name = "role_utilisateur")
public class RoleUtilisateur {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "RU", sequence = "seq_role_utilisateur",size = 8)
    private String idRoleUtilisateur;
    @Column
    private String idRole;
    @Column 
    private String idUtilisateur;

    public RoleUtilisateur(String idRole, String idUtilisateur) {
        this.idRole = idRole;
        this.idUtilisateur = idUtilisateur;
    }
    
    
}
