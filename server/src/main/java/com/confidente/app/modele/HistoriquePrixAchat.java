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
@Table(name = "historique_prix_achat")
public class HistoriquePrixAchat {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "HPA", sequence = "seq_historique_prix_achat_id",size = 10)
    private String idHistoriquePrixAchat;
    @Column
    private String idPrixAchat;
    @Column
    private double montant;
    @Column
    private Timestamp dateSaisie;

    public HistoriquePrixAchat(String idPrixAchat, double montant, Timestamp dateSaisie) {
        this.idPrixAchat = idPrixAchat;
        this.montant = montant;
        this.dateSaisie = dateSaisie;
    }
    
    
}
