/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository;

import com.confidente.app.modele.ConditionnementProduit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface ConditionnementProduitRepository extends JpaRepository<ConditionnementProduit, String>,JpaSpecificationExecutor<ConditionnementProduit>{
    public List<ConditionnementProduit> findAllByIdConditionnementProduitAndIdProduit(String idConditionnementProduit,String idProduit);
    public Optional<ConditionnementProduit> findByIdConditionnementProduitAndIdProduit(String idConditionnementProduit,String idProduit);
}
