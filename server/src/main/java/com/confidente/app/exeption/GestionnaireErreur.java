/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.exeption;

import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 *
 * @author Ny Anjara Mamisoa
 */

@RestControllerAdvice
public class GestionnaireErreur {
    @ExceptionHandler(AuthentificationExeption.class)
    public ResponseEntity handleAuthentificationExceptions(AuthentificationExeption ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity handleValidationExceptions(ValidationException ex) {
        return ResponseEntity.badRequest().body(Map.of("message",ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            // clé = nom du champ, valeur = message d'erreur
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }
    
    
    @ExceptionHandler(TokenExpirerExeption.class)
    public ResponseEntity handleTokenExpirerExeption(TokenExpirerExeption ex) {
        return new ResponseEntity(ex.getMessage(),HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "Impossible de supprimer cet élément car il est référencé dans d'autres enregistrements.";

        // Optionnel : essayer d’identifier le nom de la table à partir du message SQL
        if (ex.getMessage() != null && ex.getMessage().contains("DELETE")) {
            String msg = ex.getMessage().toLowerCase();
            if (msg.contains("utilisateur")) {
                message = "Impossible de supprimer cet utilisateur car il est déjà référencé.";
            }
            else if(msg.contains("prix_achat_id_fournisseur_id_produit_id_conditionnement_pro_key")){
                message="Doublon détecté : prix déjà enregistré pour ce fournisseur.";
            }
            else if(msg.contains("categorie") || msg.contains("marque") || msg.contains("variante") || msg.contains("conditionnement")) {
                String entite = 
                        msg.contains("categorie")? "categorie":
                        msg.contains("marque")?"marque":
                        msg.contains("variante") ? "variante" :
                        msg.contains("conditionnement") ? "conditionnement":"";
                message = "Suppression impossible : cette "+entite+" est utilisée par un ou plusieurs produits.";
            } 
            else{
                message=ex.getMessage();
            }
        }
        else{
            if(ex!=null)ex.printStackTrace();
            message="Erreur pour effectuer cette action";
        }

        return ResponseEntity.badRequest().body(Map.of("message",message));
    }
    
}
