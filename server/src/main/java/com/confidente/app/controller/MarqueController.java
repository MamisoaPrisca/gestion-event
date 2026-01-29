/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Marque;
import com.confidente.app.service.MarqueService;
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
@RequestMapping("/api/marque")
public class MarqueController {
    
    private final MarqueService marqueService;
    
    @GetMapping("/all")
    public ResponseEntity getAll(){
        return new ResponseEntity(marqueService.getAll(), HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'marque_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Marque marque,HttpServletRequest  request){
        return new ResponseEntity(this.marqueService.insert(marque,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'marque_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Marque> liste=this.marqueService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'marque_delete')")
    @DeleteMapping("{idMarque}")
    public ResponseEntity delete(@PathVariable String idMarque ,HttpServletRequest  request){
        this.marqueService.delete(idMarque, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'marque_update')")
    @PutMapping("{idMarque}")
    public ResponseEntity update(@PathVariable String idMarque,@RequestBody Marque marque,HttpServletRequest  request){
        return new ResponseEntity(this.marqueService.update(idMarque,marque,request), HttpStatus.CREATED);
    }
}
