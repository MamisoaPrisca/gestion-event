/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository.view;

import com.confidente.app.modele.view.ViewConditionnementProduit;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface ViewConditionnementProduitRepository extends JpaRepository<ViewConditionnementProduit, String>,JpaSpecificationExecutor<ViewConditionnementProduit>{
    List<ViewConditionnementProduit> findAllByIdProduit(String idProduit);
}
