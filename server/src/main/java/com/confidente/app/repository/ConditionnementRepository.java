/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository;

import com.confidente.app.modele.Conditionnement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface ConditionnementRepository extends JpaRepository<Conditionnement, String>,JpaSpecificationExecutor<Conditionnement>{
    @Query(value ="select * from conditionnement where id_conditionnement not in (select id_conditionnement from conditionnement_produit where id_produit = :idProduit)", nativeQuery = true)
    List<Conditionnement> findAllByIdProduit(String idProduit);
}
