/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.authentification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.confidente.app.authentification.modele.Utilisateur;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface UtilisateurRepository extends JpaRepository<Utilisateur, String>,JpaSpecificationExecutor<Utilisateur>{
    Optional<Utilisateur> findByLogin(String login);
    
    @Query(value = "select * from Utilisateur  where id_utilisateur in (select id_utilisateur from role_utilisateur where id_role= :idRole)", nativeQuery = true)
    List<Utilisateur> findAllByIdRole(String idRole);
    
    @Query(value = "select * from Utilisateur  where id_utilisateur not in (select id_utilisateur from role_utilisateur where id_role= :idRole)", nativeQuery = true)
    List<Utilisateur> findAllNotInPermission(String idRole);
}
