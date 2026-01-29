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
@Table(name = "mouvement_stock")
public class MouvementStock {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "MS", sequence = "seq_mouvement_stock",size = 15)
    private String idMouvementStock;
    @Column
    private String idVariante;
    @Column
    private double quantite;
    @Column
    private int typeMouvement;
    @Column
    private Timestamp dateEnregistrement;
    @Column
    private String idSource;
    @Column
    private String tableSource;
    @Column
    private String idEntrepot;
    @Column
    private String idProduit;

    public MouvementStock(String idProduit,String idVariante, double quantite, int typeMouvement, Timestamp dateEnregistrement, String idSource, String tableSource, String idEntrepot) {
        this.idProduit=idProduit;
        this.idVariante = idVariante;
        this.quantite = quantite;
        this.typeMouvement = typeMouvement;
        this.dateEnregistrement = dateEnregistrement;
        this.idSource = idSource;
        this.tableSource = tableSource;
        this.idEntrepot = idEntrepot;
    }
    
    
}
