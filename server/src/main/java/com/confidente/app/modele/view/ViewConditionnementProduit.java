/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
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
@Table(name = "v_conditionnement_produit")
public class ViewConditionnementProduit {
    @Id
    private String idConditionnementProduit;
    @Column
    private String remarque;
    @Column 
    private double quantite;
    @Column
    private Double poids;
    @Column 
    private String idProduit;
    @Column 
    private String conditionnement;
    @Column 
    private String idConditionnement;
    @Column 
    private String abreviation;
}
