/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Categorie;
import com.confidente.app.service.CategorieService;
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
@RequestMapping("/api/categorie")
public class CategorieController {
    
    private final CategorieService categorieService;
    
    @GetMapping("/all")
    public ResponseEntity getAll(){
        return new ResponseEntity(categorieService.getAll(), HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'categorie_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Categorie categorie,HttpServletRequest  request){
        return new ResponseEntity(this.categorieService.insert(categorie,request), HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'categorie_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Categorie> liste=this.categorieService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'categorie_delete')")
    @DeleteMapping("{idCategorie}")
    public ResponseEntity delete(@PathVariable String idCategorie ,HttpServletRequest  request){
        this.categorieService.delete(idCategorie, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'categorie_update')")
    @PutMapping("{idCategorie}")
    public ResponseEntity update(@PathVariable String idCategorie,@RequestBody Categorie categorie,HttpServletRequest  request){
        return new ResponseEntity(this.categorieService.update(idCategorie,categorie,request), HttpStatus.CREATED);
    }
}
