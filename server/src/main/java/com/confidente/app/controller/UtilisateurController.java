/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.authentification.modele.Utilisateur;
import com.confidente.app.authentification.service.UtilisateurService;
import com.confidente.app.dto.InfoUtilisateurDTO;
import com.confidente.app.dto.UtilisateurDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.HashMap;
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
@RequestMapping("/api/utilisateur")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_saisie')")
    @PostMapping
    public ResponseEntity create(@Valid @RequestBody UtilisateurDTO utilisateurDTO,HttpServletRequest  request){
        Utilisateur utilisteur = utilisateurService.insert(utilisateurDTO,request);
        return new ResponseEntity<>(utilisteur,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_modif')")
    @PutMapping("/{idUtilisateur}")
    public ResponseEntity update(@PathVariable String idUtilisateur , @Valid @RequestBody InfoUtilisateurDTO utilisateurDTO,HttpServletRequest  request){
        Utilisateur utilisteur = utilisateurService.update(idUtilisateur,utilisateurDTO,request);
        return new ResponseEntity<>(utilisteur,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
    ){
        Page<Utilisateur> liste=this.utilisateurService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_fiche')")
    @GetMapping("/{idUtilisateur}")
    public ResponseEntity get(@PathVariable String idUtilisateur){
        return ResponseEntity.ok(this.utilisateurService.get(idUtilisateur));
    }
    
    @PutMapping("/password")
    public ResponseEntity modifierPassword(@RequestBody PasswordRequest passwordRequest,HttpServletRequest  request){
        Utilisateur utilisateur = this.utilisateurService.updatePassword(passwordRequest.password(),request);
        return ResponseEntity.ok(utilisateur);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utisateur_reset_password')")
    @GetMapping("/reset/password/{idUtilisateur}")
    public ResponseEntity resetPassword(@PathVariable String idUtilisateur,HttpServletRequest  request){
        String newPassword=this.utilisateurService.resetPassword(idUtilisateur, request);
        Map map= new HashMap();
        map.put("password", newPassword);
        return ResponseEntity.ok(map);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_activer')")
    @GetMapping("/activer/{idUtilisateur}")
    public ResponseEntity activerCompte (@PathVariable String idUtilisateur,HttpServletRequest  request){
        Utilisateur utilisateur = this.utilisateurService.activerUtilisateur(idUtilisateur, request);
        return ResponseEntity.ok(utilisateur);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'utilisateur_delete')")
    @DeleteMapping("/{idUtilisateur}")
    public ResponseEntity supprimer(@PathVariable String idUtilisateur,HttpServletRequest  request){
        this.utilisateurService.supprimer(idUtilisateur, request);
        return ResponseEntity.ok("Action effetuer"); 
    }
}

record PasswordRequest(String password) {}
