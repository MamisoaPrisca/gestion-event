/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.repository;

import com.confidente.app.modele.Fournisseur;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface FournisseurRepository extends JpaRepository<Fournisseur, String>,JpaSpecificationExecutor<Fournisseur>{
    @Query(value ="select * from fournisseur where id_fournisseur not in (select id_fournisseur from prix_achat where id_produit = :idProduit)", nativeQuery = true)
    List<Fournisseur> findAllByIdProduit(String idProduit);
    
    
}
