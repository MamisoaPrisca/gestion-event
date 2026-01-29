/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Variante;
import com.confidente.app.service.VarianteService;
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
@RequestMapping("/api/variante")
public class VarianteController {
    private final VarianteService varianteService;
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'variante_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Variante variante,HttpServletRequest  request){
        return new ResponseEntity(this.varianteService.insert(variante,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'variante_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Variante> liste=this.varianteService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'variante_delete')")
    @DeleteMapping("{idVariante}")
    public ResponseEntity delete(@PathVariable String idVariante ,HttpServletRequest  request){
        this.varianteService.delete(idVariante, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'variante_update')")
    @PutMapping("{idVariante}")
    public ResponseEntity update(@PathVariable String idVariante,@RequestBody Variante variante,HttpServletRequest  request){
        return new ResponseEntity(this.varianteService.update(idVariante,variante,request), HttpStatus.CREATED);
    }
}
