/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.authentification.modele.Role;
import com.confidente.app.authentification.service.RoleService;
import com.confidente.app.dto.PermissionDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ny Anjara Mamisoa
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/role")
public class RoleController {
    private final RoleService roleService;
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_saisie')")
    @PostMapping
    public ResponseEntity create(@Valid @RequestBody Role role,HttpServletRequest  request){
        Role roleInserted = this.roleService.insert(role,request);
        return new ResponseEntity<>(roleInserted,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_modif')")
    @PutMapping("/{idRole}")
    public ResponseEntity update(@PathVariable String idRole , @Valid @RequestBody Role roleDTO,HttpServletRequest  request){
        Role role = roleService.update(idRole,roleDTO,request);
        return new ResponseEntity<>(role,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
    ){
        Page<Role> liste=this.roleService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_fiche')")
    @GetMapping("/{idRole}")
    public ResponseEntity get(@PathVariable String idRole){
        return ResponseEntity.ok(this.roleService.get(idRole));
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_delete')")
    @DeleteMapping("/{idRole}")
    public ResponseEntity supprimer(@PathVariable String idRole,HttpServletRequest  request){
        this.roleService.supprimer(idRole, request);
        return ResponseEntity.ok(Map.of("message","Action effetuer")); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_fiche')")
    @GetMapping("/{idRole}/permission")
    public ResponseEntity getPermission(@PathVariable String idRole,HttpServletRequest  request){
        List liste= this.roleService.getPermissionRole(idRole);
        return ResponseEntity.ok(liste); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_fiche')")
    @GetMapping("/{idRole}/utilisateur")
    public ResponseEntity getUtilisateur(@PathVariable String idRole,HttpServletRequest  request){
        List liste= this.roleService.getUtilisateur(idRole);
        return ResponseEntity.ok(liste); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'permission_modification')")
    @PutMapping("/{idRole}/permission")
    public ResponseEntity updatePermission(@PathVariable String idRole,
            @RequestBody List<PermissionDTO> permissionDTO,
            HttpServletRequest  request){
        this.roleService.modifierPermission(idRole, permissionDTO, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès")); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_fiche')")
    @GetMapping("/{idRole}/utilisateur/data")
    public ResponseEntity getUtilisateurData(@PathVariable String idRole,HttpServletRequest  request){
        List liste= this.roleService.getUtilisateurPasAffecter(idRole);
        return ResponseEntity.ok(liste); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_utilisateur_saisie')")
    @PostMapping("/{idRole}/utilisateur")
    public ResponseEntity affecterUtilisatuer(@PathVariable String idRole,
            @RequestParam String idUtilisateur,
            HttpServletRequest  request){
        this.roleService.affecterUtilisateur(idRole, idUtilisateur, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès")); 
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'role_utilisateur_delete')")
    @DeleteMapping("/{idRole}/utilisateur")
    public ResponseEntity retirerUtilisatuer(@PathVariable String idRole,
            @RequestParam String idUtilisateur,
            HttpServletRequest  request){
        this.roleService.suprimerUtilisateur(idRole, idUtilisateur, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès")); 
    }
    
    
    
    
}
