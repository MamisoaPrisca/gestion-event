/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.confidente.app.authentification.repository;

import com.confidente.app.authentification.modele.PermissionRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public interface PermissionRoleRepository extends JpaRepository<PermissionRole, String>,JpaSpecificationExecutor<PermissionRole>{
    List<PermissionRole> findAllByIdRole(String idRole);
    void deleteByIdRoleAndIdPermission(String idRole,String idPermission);
}
