/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.repository;

import com.confidente.app.modele.Entrepot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface EntrepotRepository extends JpaRepository<Entrepot, String>,JpaSpecificationExecutor<Entrepot>{
    
}
