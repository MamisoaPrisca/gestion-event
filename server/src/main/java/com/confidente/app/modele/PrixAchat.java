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
@Table(name = "prix_achat")
public class PrixAchat {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "PA", sequence = "seq_prix_achat_id",size = 10)
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
    private String idConditionnementProduit;
    @Column
    private int tva;
    
}
