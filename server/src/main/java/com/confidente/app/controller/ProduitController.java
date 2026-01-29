/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.dto.fonctionnalite.ProduitDTO;
import com.confidente.app.modele.Conditionnement;
import com.confidente.app.modele.ConditionnementProduit;
import com.confidente.app.modele.Fournisseur;
import com.confidente.app.modele.PrixAchat;
import com.confidente.app.modele.Produit;
import com.confidente.app.modele.Variante;
import com.confidente.app.modele.view.ViewConditionnementProduit;
import com.confidente.app.modele.view.ViewPrixAchat;
import com.confidente.app.modele.view.ViewProduit;
import com.confidente.app.modele.view.ViewVarianteProduit;
import com.confidente.app.service.ProduitService;
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
@RequestMapping("/api/produit")
public class ProduitController {

    private final ProduitService produitService;

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_saisie')")
    @PostMapping
    public ResponseEntity saisieProduit(@RequestBody ProduitDTO produitDTO,HttpServletRequest  request){
        Produit produit = this.produitService.insert(produitDTO.genererProduit(), request);
        return  new ResponseEntity<>(produit,HttpStatus.CREATED);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String idCategorie,
            @RequestParam(required = false) String idMarque

    ){
        Page<ViewProduit> liste=this.produitService.find(page, size, search,idCategorie,idMarque);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_fiche')")
    @GetMapping("/{idProduit}")
    public ResponseEntity get(@PathVariable String idProduit){
        ViewProduit produit=this.produitService.get(idProduit);
        return new ResponseEntity<>(produit,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_delete')")
    @DeleteMapping("/{idProduit}")
    public ResponseEntity supprimer(@PathVariable String idProduit,
            HttpServletRequest  request){
        this.produitService.supprimer(idProduit, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès"));
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PutMapping("/{idProduit}")
    public ResponseEntity update(@PathVariable String idProduit , @Valid @RequestBody ProduitDTO produitDTO,HttpServletRequest  request){
        Produit produit = produitService.update(idProduit,produitDTO.genererProduit(),request);
        return new ResponseEntity<>(produit,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_fiche')")
    @GetMapping("/{idProduit}/variante")
    public ResponseEntity getVariante(@PathVariable String idProduit){
        List<ViewVarianteProduit> variante=this.produitService.getVariante(idProduit);
        return new ResponseEntity<>(variante,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @GetMapping("/{idProduit}/variante/data")
    public ResponseEntity getVarianteData(@PathVariable String idProduit){
        List<Variante> variante=this.produitService.getAllVariante(idProduit);
        return new ResponseEntity<>(variante,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PostMapping("/{idProduit}/variante")
    public ResponseEntity affecterUtilisatuer(@PathVariable String idProduit,
            @RequestParam String idVariante,
            HttpServletRequest  request){
        this.produitService.affecterVariante(idProduit, idVariante, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès"));
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @DeleteMapping("/{idProduit}/variante")
    public ResponseEntity retirerVariante (@PathVariable String idProduit,
            @RequestParam String idVariante,
            HttpServletRequest  request){
        this.produitService.supprimerVariante(idProduit, idVariante, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès"));
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_fiche')")
    @GetMapping("/{idProduit}/conditionnement")
    public ResponseEntity getConditionnement(@PathVariable String idProduit){
        List<ViewConditionnementProduit> variante=this.produitService.getConditionnement(idProduit);
        return new ResponseEntity<>(variante,HttpStatus.OK);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @GetMapping("/{idProduit}/conditionnement/data")
    public ResponseEntity getConditionnementData(@PathVariable String idProduit){
        List<Conditionnement> variante=this.produitService.getAllConditionnement(idProduit);
        return new ResponseEntity<>(variante,HttpStatus.OK);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PostMapping("/{idProduit}/conditionnement")
    public ResponseEntity addConditionnement(@PathVariable String idProduit,@RequestBody ConditionnementProduit conditionnementProduit,HttpServletRequest  request){
        conditionnementProduit= this.produitService.addConditionnement(idProduit,conditionnementProduit,request);
        ViewConditionnementProduit view=this.produitService.getConditionnementProduit(conditionnementProduit.getIdConditionnementProduit());
        return new ResponseEntity<>(view,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @DeleteMapping("/{idProduit}/conditionnement")
    public ResponseEntity retirerConditonnement(@PathVariable String idProduit,
            @RequestParam String idConditionnementProduit,
            HttpServletRequest  request){
        this.produitService.supprimerConditionnement(idProduit, idConditionnementProduit, request);
        return ResponseEntity.ok(Map.of("message","Modification avec succès"));
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PutMapping("/{idProduit}/conditionnement/{idConditionnementProduit}")
    public ResponseEntity updateConditionnement(@PathVariable String idProduit,@PathVariable String idConditionnementProduit,@RequestBody ConditionnementProduit conditionnementProduit,HttpServletRequest  request){
        conditionnementProduit= this.produitService.updateConditionnement(idProduit,idConditionnementProduit,conditionnementProduit,request);
        ViewConditionnementProduit view=this.produitService.getConditionnementProduit(conditionnementProduit.getIdConditionnementProduit());
        return new ResponseEntity<>(view,HttpStatus.OK);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_fiche')")
    @GetMapping("/{idProduit}/prix-achat")
    public ResponseEntity getPrixAchat(@PathVariable String idProduit){
        List<ViewPrixAchat> variante=this.produitService.getPrixAchat(idProduit);
        return new ResponseEntity<>(variante,HttpStatus.OK);
    }

    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_fiche')")
    @GetMapping("/{idProduit}/prix-achat/data")
    public ResponseEntity getFournisseurData(@PathVariable String idProduit){
        List<Fournisseur> fournisseur=this.produitService.getFournisseurData(idProduit);
        return new ResponseEntity<>(fournisseur,HttpStatus.OK);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PostMapping("/{idProduit}/prix-achat")
    public ResponseEntity addPrixAchat(@PathVariable String idProduit,@RequestBody PrixAchat prixAchat,HttpServletRequest  request){
        prixAchat= this.produitService.addPrixAchat(idProduit,prixAchat,request);
        return new ResponseEntity<>(prixAchat,HttpStatus.OK);
    }


    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'produit_modif')")
    @PutMapping("/{idProduit}/prix-achat/{idPrixAchat}")
    public ResponseEntity putPrixAchat(@PathVariable String idProduit,@RequestBody PrixAchat prixAchat,HttpServletRequest  request ,@PathVariable String idPrixAchat){
        prixAchat= this.produitService.updatePrixAchat(idProduit,idPrixAchat,prixAchat,request);
        return new ResponseEntity<>(prixAchat,HttpStatus.OK);
    }



}
