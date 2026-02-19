/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Client;
import com.confidente.app.service.ClientService;
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
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'client_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<Client> liste=this.clientService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'client_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Client client,HttpServletRequest  request){
        return new ResponseEntity(this.clientService.insert(client,request), HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'client_delete')")
    @DeleteMapping("{idClient}")
    public ResponseEntity delete(@PathVariable String idClient ,HttpServletRequest  request){
        this.clientService.delete(idClient, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'client_update')")
    @PutMapping("{idClient}")
    public ResponseEntity update(@PathVariable String idClient,@RequestBody Client client,HttpServletRequest  request){
        return new ResponseEntity(this.clientService.update(idClient,client,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'client_fiche')")
    @GetMapping("{idClient}")
    public ResponseEntity get(@PathVariable String idClient){
        return new ResponseEntity(this.clientService.get(idClient), HttpStatus.CREATED);
    }
    
    @GetMapping("all")
    public ResponseEntity getAll(){
        return new ResponseEntity(this.clientService.getAll(), HttpStatus.CREATED);
    }
}
