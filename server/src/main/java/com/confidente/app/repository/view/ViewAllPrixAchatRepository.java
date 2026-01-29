/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository.view;

import com.confidente.app.modele.view.ViewAllPrixAchat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface ViewAllPrixAchatRepository extends JpaRepository<ViewAllPrixAchat, String>,JpaSpecificationExecutor<ViewAllPrixAchat>{
    List<ViewAllPrixAchat> findAllByIdProduit(String idProduit);
    @Query(value ="select * from v_all_prix_achat where id_fournisseur in (select id_fournisseur from commande_fournisseur where id_commande_fournisseur = :idCommandeFournisseur)", nativeQuery = true)
    List<ViewAllPrixAchat> findAllByIdCommandeFournisseur(String idCommandeFournisseur);
}
