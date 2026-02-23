/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util;

import java.sql.Date;
import org.springframework.data.jpa.domain.Specification;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public class GenericSpecification {
    public static Specification like(String key,String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.isEmpty()) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.like(
                criteriaBuilder.upper(root.get(key)),
                value.trim().toUpperCase()
            );
        };
    }
    
    public static Specification containe(String key,String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.isEmpty()) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.like(
                criteriaBuilder.upper(root.get(key)),
                "%" + value.trim().toUpperCase() + "%"
            );
        };
    }
    
    public static Specification notLike(String key,String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.isEmpty()) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.notLike(
                criteriaBuilder.upper(root.get(key)),
                 value.trim().toUpperCase()
            );
        };
    }
    
    public static Specification likeStrict(String key,String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.isEmpty()) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.like(
                criteriaBuilder.upper(root.get(key)),value.trim().toUpperCase()
            );
        };
    }
    
    
    public static Specification equal(String key,Date value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.equal(root.get(key),value);
        };
    }
    
    public static Specification equal(String key,String value) {
        return (root, query, criteriaBuilder) -> {
            if (value == null || value.isEmpty()) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.equal(root.get(key),value);
        };
    }
    
    public static Specification equal(String key,int value) {
        return (root, query, criteriaBuilder) -> {
            if (value >=0) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.equal(root.get(key),value);
        };
    }
    
    public static Specification greaterThan(String key,int value) {
        return (root, query, criteriaBuilder) -> {
            if (value >=0) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.greaterThan(root.get(key),value);
        };
    }
    
    public static Specification lessThan(String key,int value){
        return (root, query, criteriaBuilder) -> {
            if (value >=0) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.lessThan(root.get(key),value);
        };
    }
    
    
    public static Specification greaterThan(String key,Date value) {
        return (root, query, criteriaBuilder) -> {
            if (value ==null) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.greaterThan(root.get(key),value);
        };
    }
    
    public static Specification lessThan(String key,Date value){
        return (root, query, criteriaBuilder) -> {
            if (value ==null) {
                return criteriaBuilder.conjunction(); // Si le paramètre est vide, aucune restriction.
            }
            // Concaténation des colonnes nom et prenom avec un espace
            return criteriaBuilder.lessThan(root.get(key),value);
        };
    }
    
    
}


