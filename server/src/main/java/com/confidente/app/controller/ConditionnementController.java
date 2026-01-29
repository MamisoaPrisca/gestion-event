/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Conditionnement;
import com.confidente.app.service.ConditionnementService;
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
@RequestMapping("/api/conditionnement")
public class ConditionnementController {
    private final ConditionnementService conditionnementService;
    
    @GetMapping("/all")
    public ResponseEntity getAll(){
        return new ResponseEntity(conditionnementService.getAll(), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'conditionnement_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Conditionnement variante,HttpServletRequest  request){
        return new ResponseEntity(this.conditionnementService.insert(variante,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'conditionnement_update')")
    @PutMapping("/{idConditionnement}")
    public ResponseEntity update(@PathVariable String idConditionnement,@RequestBody Conditionnement variante,HttpServletRequest  request){
        return new ResponseEntity(this.conditionnementService.update(idConditionnement,variante,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'conditionnement_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Conditionnement> liste=this.conditionnementService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'conditionnement_delete')")
    @DeleteMapping("{idConditionnement}")
    public ResponseEntity delete(@PathVariable String idConditionnement ,HttpServletRequest  request){
        this.conditionnementService.delete(idConditionnement, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
}
