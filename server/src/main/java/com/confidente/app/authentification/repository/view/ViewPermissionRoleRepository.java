/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.authentification.repository.view;

import com.confidente.app.authentification.modele.view.ViewPermissionRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface ViewPermissionRoleRepository extends JpaRepository<ViewPermissionRole, String>{
    List<ViewPermissionRole> findAllByIdRole(String idRole);
}
