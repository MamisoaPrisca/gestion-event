/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Fournisseur;
import com.confidente.app.service.FournisseurService;
import jakarta.servlet.http.HttpServletRequest;
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
@RequestMapping("/api/fournisseur")
public class FournisseurController {
    
    private final FournisseurService fournisseurService;
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'fournisseur_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Fournisseur fournisseur,HttpServletRequest  request){
        return new ResponseEntity(this.fournisseurService.insert(fournisseur,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'fournisseur_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Fournisseur> liste=this.fournisseurService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'fournisseur_delete')")
    @DeleteMapping("{idFournisseur}")
    public ResponseEntity delete(@PathVariable String idFournisseur ,HttpServletRequest  request){
        this.fournisseurService.delete(idFournisseur, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'fournisseur_update')")
    @PutMapping("{idFournisseur}")
    public ResponseEntity update(@PathVariable String idFournisseur,@RequestBody Fournisseur fournisseur,HttpServletRequest  request){
        return new ResponseEntity(this.fournisseurService.update(idFournisseur,fournisseur,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'fournisseur_fiche')")
    @GetMapping("{idFournisseur}")
    public ResponseEntity get(@PathVariable String idFournisseur){
        return new ResponseEntity(this.fournisseurService.get(idFournisseur), HttpStatus.CREATED);
    }
    
    
    @GetMapping("all")
    public ResponseEntity getAll(){
        return new ResponseEntity(this.fournisseurService.getAll(), HttpStatus.CREATED);
    }
    
    
}
