/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.confidente.app.util.StringPrefixedId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;
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
@Table(name = "utilisateur")
public class Utilisateur {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "U", sequence = "seq_utilisateur_id")
    String idUtilisateur;
    @Column 
    String login; 
    @JsonIgnore
    @Column 
    String password;
    @Column 
    String nom;
    @Column 
    String prenom;
    @Column 
    String contact;
    @Column
    Timestamp dateCreation;
    @Column
    boolean actif;
    

    public Utilisateur(String login, String password, String nom, String prenom, String contact) {
        this.login = login;
        this.password = password;
        this.nom = nom;
        this.prenom = prenom;
        this.contact = contact;
    }

    public Utilisateur(String nom, String prenom, String contact) {
        this.nom = nom;
        this.prenom = prenom;
        this.contact = contact;
    }
    
    public String getNomPrenom(){
        return this.nom+" "+this.prenom==null?"":this.prenom;
    }
}
