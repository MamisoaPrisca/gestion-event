/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.modele.view;

import com.confidente.app.util.fonction.NumberUtil;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "v_prix_achat")
public class ViewPrixAchat {
    @Id
    private String idPrixAchat;
    @Column
    private String idFournisseur ;
    @Column
    private String idProduit ;
    @Column
    private double montant;
    @Column
    private Timestamp dateSaisie;
    @Column 
    private String fournisseur;
    @Column
    private String idConditionnementProduit;
    @Column
    private String conditionnement;
    @Column
    private String produit;
    @Column
    private double quantiteConditionnement;
    @Column
    private String idCategorie;
    @Column 
    private String categorie;
    @Column
    private int tva;
    @Column
    private double montantTtc;
    
    public String getLibelle(){
        return produit+" - "+conditionnement +" - "+ NumberUtil.formaterNumbre(montant)+" Ar";
    }
}
