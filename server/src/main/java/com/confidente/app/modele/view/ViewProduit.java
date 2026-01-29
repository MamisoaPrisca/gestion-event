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
@Table(name = "v_produit")
public class ViewProduit {
    @Id
    private String idProduit;
    @Column
    private String designation;
    @Column
    private boolean archiver;
    @Column
    private String idCategorie;
    @Column
    private String idMarque;
    @Column
    private String conditionnementDefaut;
    @Column
    private String marque;
    @Column 
    private String categorie;
    @Column
    private String conditionnement;
    @Column
    private String conditionnementAbreviation;
    
}
