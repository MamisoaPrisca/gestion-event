/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.modele.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "v_detail_commande_fournisseur")
public class ViewDetailCommandeFournisseur {
    @Id
    private String idDetailCommandeFournisseur;
    @Column
    private String idCommandeFournisseur;
    @Column
    private String idProduit;
    @Column
    private double prix;
    @Column
    private String idConditionnementProduit;
    @Column
    private double quantite;
    @Column
    private String produit;
    @Column
    private String conditionnement;
    @Column
    private String abreviation;
    @Column
    private double quantiteConditionnement;
    @Column
    private double poids;
    @Column
    private double poidsTotal;
    @Column
    private double montantTotal;
    @Column
    private String idVariante;
    @Column
    private String variante;
    @Column
    private double entrer;
    @Column
    private double reste;
    @Column 
    private String idCategorie;
    @Column 
    private String categorie;
    @Column
    private int tva;
    @Column
    private double prixTtc;
    @Column
    private double montantTtc;
    @Column
    private double montantTva;
}
