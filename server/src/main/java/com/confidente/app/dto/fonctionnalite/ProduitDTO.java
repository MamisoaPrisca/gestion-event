/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.dto.fonctionnalite;

import com.confidente.app.modele.Produit;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Data
public class ProduitDTO {
    @NotBlank(message = "Le designation est obligatoire")
    private String designation;
    private String idMarque;
    private String idCategorie;
    private String conditionnementDefaut;
    
    public Produit genererProduit(){
        return new Produit(designation, false, idCategorie, idMarque, conditionnementDefaut);
    }
}
