/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Categorie;
import com.confidente.app.repository.CategorieRepository;
import com.confidente.app.util.GenericSpecification;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class CategorieService {
    private final CategorieRepository categorieRepository;
    private final HistoriqueService historiqueService;
    
    public List<Categorie> getAll(){
        return categorieRepository.findAll();
    }
    
    
    @Transactional
    public Categorie insert(Categorie categorie,HttpServletRequest  request){
        Specification<Categorie> specification = GenericSpecification.like("nom", categorie.getNom());
        List<Categorie> liste = this.categorieRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La catégorie "+categorie.getNom()+" existe déjà");
        }
        categorie.setNom(categorie.getNom().trim());
        categorie=this.categorieRepository.save(categorie);
        this.historiqueService.insertHistorique("Creation catégorie", categorie.getIdCategorie(), "categorie",request);

        return categorie;
    }
    
    public Page<Categorie> find(int page, int size,String search){
        Page<Categorie> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idCategorie"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Categorie> specification = GenericSpecification.like("idCategorie",search)
                .or(GenericSpecification.like("nom",search))
                ;
                
        liste = this.categorieRepository.findAll(specification, pageable);
        return liste;
    }
    
    public void delete(String idCategorie,HttpServletRequest  request){
        this.categorieRepository.deleteById(idCategorie);
        this.historiqueService.insertHistorique("Suppression catégorie", idCategorie, "categorie",request);
    }
    @Transactional
    public Categorie update(String idCategorie ,Categorie categorie,HttpServletRequest  request){
        Specification<Categorie> specification = GenericSpecification.like("nom", categorie.getNom());
        List<Categorie> liste = this.categorieRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La catégorie "+categorie.getNom()+" existe déjà");
        }
        categorie.setIdCategorie(idCategorie);
        categorie.setNom(categorie.getNom().trim());
        categorie=this.categorieRepository.save(categorie);
        this.historiqueService.insertHistorique("Modification catégorie", categorie.getIdCategorie(), "categorie",request);

        return categorie;
    }
}
