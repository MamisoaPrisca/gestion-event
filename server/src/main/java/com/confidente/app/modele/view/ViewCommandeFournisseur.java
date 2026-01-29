/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.modele.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Date;
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
@Table(name = "v_commande_fournisseur")
public class ViewCommandeFournisseur {
    @Id
    private String idCommandeFournisseur;
    @Column
    private String idFournisseur;
    @Column
    private Date dateSaisie;
    @Column
    private Date dateEcheance;
    @Column
    private int etat;
    @Column
    private String etatLibelle;
    @Column
    private String color;
    @Column
    private String fournisseur;
}
