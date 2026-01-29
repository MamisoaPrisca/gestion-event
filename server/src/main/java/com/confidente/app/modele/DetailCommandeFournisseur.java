/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
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
@Table(name = "detail_commande_fournisseur")
public class DetailCommandeFournisseur {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "DCF", sequence = "seq_detail_commande_fournisseur_id",size = 12)
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
    private String idVariante;
    @Column
    private int tva;
}
