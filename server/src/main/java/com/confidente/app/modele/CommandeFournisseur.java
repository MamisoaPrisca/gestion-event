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
import java.sql.Date;
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
@Table(name = "commande_fournisseur")
public class CommandeFournisseur {
    @Id
    @GeneratedValue
    @StringPrefixedId(prefix = "CF", sequence = "seq_commande_fournisseur_id",size = 10)
    private String idCommandeFournisseur;
    @Column
    private String idFournisseur;
    @Column
    private Date dateSaisie;
    @Column
    private Date dateEcheance;
    @Column
    private int etat;
}
