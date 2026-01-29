/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.PermissionRole;
import com.confidente.app.authentification.modele.Role;
import com.confidente.app.authentification.repository.PermissionRoleRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class PermissionRoleService {
    private final PermissionRoleRepository PermissionRoleRepository;
    private final HistoriqueService HistoriqueService;
    
    @Transactional
    public PermissionRole insert(PermissionRole permissionRole ,HttpServletRequest  request){
        PermissionRole roleInserted=this.PermissionRoleRepository.save(permissionRole);
        this.HistoriqueService.insertHistorique("Creation permission rôle", roleInserted.getIdPermissionRole(), "permission_role", request);
        return roleInserted;
    }
    
    
    @Transactional
    public void supprimer(String idRole,HttpServletRequest  request){
        this.PermissionRoleRepository.deleteById(idRole);
        this.HistoriqueService.insertHistorique("Supprimer permission rôle", idRole, "permission_role",request);
    }
    
}
