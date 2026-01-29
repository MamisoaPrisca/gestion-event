/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.dto.EntrerStockDto;
import com.confidente.app.modele.CommandeFournisseur;
import com.confidente.app.modele.DetailCommandeFournisseur;
import com.confidente.app.modele.view.ViewCommandeFournisseur;
import com.confidente.app.modele.view.ViewDetailCommandeFournisseur;
import com.confidente.app.service.CommandeFournisseurService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
@RequestMapping("/api/commande-fournisseur")
public class CommandeFournisseurController {
    
    private final CommandeFournisseurService commandeFournisseurService;
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_saisie')")
    @PostMapping
    public ResponseEntity saisieCommandeFournisseur(@RequestBody CommandeFournisseur commandeFournisseur,HttpServletRequest  request){
        commandeFournisseur = this.commandeFournisseurService.insert(commandeFournisseur, request);
        return  new ResponseEntity<>(commandeFournisseur,HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0" ,required = false) int etat
            
    ){
        Page<ViewCommandeFournisseur> liste=this.commandeFournisseurService.find(page, size, search,etat);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_delete')")
    @DeleteMapping("{idCommandeFournisseur}")
    public ResponseEntity delete(@PathVariable String idCommandeFournisseur ,HttpServletRequest  request){
        this.commandeFournisseurService.delete(idCommandeFournisseur, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_update')")
    @PutMapping("{idFournisseur}")
    public ResponseEntity update(@PathVariable String idFournisseur,@RequestBody CommandeFournisseur commandeFournisseur,HttpServletRequest  request){
        return new ResponseEntity(this.commandeFournisseurService.update(idFournisseur,commandeFournisseur,request), HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_fiche')")
    @GetMapping("{idFournisseur}")
    public ResponseEntity get(@PathVariable String idFournisseur){
        return new ResponseEntity(this.commandeFournisseurService.get(idFournisseur), HttpStatus.CREATED);
    }
    
    
    @GetMapping("{idCommandeFournisseur}/produit-data")
    public ResponseEntity getProduitData(@PathVariable String idCommandeFournisseur){
        return new ResponseEntity(this.commandeFournisseurService.getProduitData(idCommandeFournisseur), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_update')")
    @PostMapping("{idCommandeFournisseur}/detail")
    public ResponseEntity addDetail(@PathVariable String idCommandeFournisseur, @RequestBody DetailCommandeFournisseur detailCommandeFournisseur,HttpServletRequest  request){
        DetailCommandeFournisseur temp=this.commandeFournisseurService.addDetail(idCommandeFournisseur,detailCommandeFournisseur,request);
        ViewDetailCommandeFournisseur detail = this.commandeFournisseurService.getDetail(temp.getIdDetailCommandeFournisseur());
        return new ResponseEntity(detail, HttpStatus.CREATED);
    }
    
    
    @GetMapping("{idCommandeFournisseur}/detail")
    public ResponseEntity getDetail(@PathVariable String idCommandeFournisseur){
        
        return new ResponseEntity(this.commandeFournisseurService.getAllDetails(idCommandeFournisseur), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_update')")
    @DeleteMapping("{idcommandeFournisseur}/detail/{idDetailCommandeFournisseur}")
    public ResponseEntity retirerDetail(@PathVariable String idcommandeFournisseur,@PathVariable String idDetailCommandeFournisseur,HttpServletRequest  request){
        this.commandeFournisseurService.retirerDetails(idcommandeFournisseur,idDetailCommandeFournisseur,request);
        return new ResponseEntity(null, HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_update')")
    @PutMapping("{idcommandeFournisseur}/detail/{idDetailCommandeFournisseur}")
    public ResponseEntity modifierDetail(@PathVariable String idcommandeFournisseur,@PathVariable String idDetailCommandeFournisseur ,@RequestBody DetailCommandeFournisseur detailCommandeFournisseur,HttpServletRequest  request){
        this.commandeFournisseurService.modifierDetails(idcommandeFournisseur,idDetailCommandeFournisseur,detailCommandeFournisseur,request);
        return new ResponseEntity(this.commandeFournisseurService.getDetail(idDetailCommandeFournisseur), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_valider')")
    @GetMapping("{idCommandeFournisseur}/valider")
    public ResponseEntity valider(@PathVariable String idCommandeFournisseur,HttpServletRequest  request){
        this.commandeFournisseurService.valider(idCommandeFournisseur,request);
        return new ResponseEntity(this.commandeFournisseurService.get(idCommandeFournisseur), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_entrer')")
    @PostMapping("{idCommandeFournisseur}/entrer")
    public ResponseEntity entrerEnStock(@PathVariable String idCommandeFournisseur, @RequestBody EntrerStock entrerStock,HttpServletRequest  request){
        this.commandeFournisseurService.entrerEnStock(idCommandeFournisseur, entrerStock.idEntrepot(), entrerStock.entrerStock(), request);
        return new ResponseEntity(null, HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'commande_fournisseur_fiche')")
    @GetMapping("{idCommandeFournisseur}/entrer/data")
    public ResponseEntity getResteLiver(@PathVariable String idCommandeFournisseur){
        return new ResponseEntity(this.commandeFournisseurService.getResteLiver(idCommandeFournisseur), HttpStatus.CREATED);
    }
    
}


record EntrerStock(
        @NotEmpty
        @NotBlank(message = "Choisir une entrepôt est obligatoire")String idEntrepot, 
        List<EntrerStockDto> entrerStock) {}
