/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository;

import com.confidente.app.modele.Variante;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface VarianteRepository extends JpaRepository<Variante, String>,JpaSpecificationExecutor<Variante>{
    @Query(value ="select * from variante where id_variante not in (select id_variante from variante_produit where id_produit = :idProduit)", nativeQuery = true)
    List<Variante> findAllByIdProduit(String idProduit);
}
