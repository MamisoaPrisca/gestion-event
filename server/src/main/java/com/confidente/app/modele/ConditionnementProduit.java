/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.modele;

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
@Table(name = "conditionnement_produit")
public class ConditionnementProduit {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "CDP", sequence = "seq_conditionnement_produit_id",size = 10)
    private String idConditionnementProduit;
    @Column
    private String remarque;
    @Column 
    private double quantite;
    @Column
    private double poids;
    @Column 
    private String idProduit;
    @Column 
    private String idConditionnement;

    public ConditionnementProduit(String remarque, double quantite, String idProduit, String idConditionnement) {
        this.remarque = remarque;
        this.quantite = quantite;
        this.idProduit = idProduit;
        this.idConditionnement = idConditionnement;
    }
    
}
