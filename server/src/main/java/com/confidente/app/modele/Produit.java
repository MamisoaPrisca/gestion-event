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
@Table(name = "produit")
public class Produit {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "P", sequence = "seq_produit_id",size = 10)
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

    public Produit(String designation, boolean archiver, String idCategorie, String idMarque, String conditionnementDefaut) {
        this.designation = designation;
        this.archiver = archiver;
        this.idCategorie = idCategorie;
        this.idMarque = idMarque;
        this.conditionnementDefaut = conditionnementDefaut;
    }
    
    
}
