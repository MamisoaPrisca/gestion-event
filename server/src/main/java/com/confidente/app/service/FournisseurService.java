/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Fournisseur;
import com.confidente.app.repository.FournisseurRepository;
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
public class FournisseurService {
    private final FournisseurRepository fournisseurRepository;
    private final HistoriqueService historiqueService;
    
    public List<Fournisseur> getAll(){
        return fournisseurRepository.findAll();
    }
    
    @Transactional
    public Fournisseur insert(Fournisseur fournisseur,HttpServletRequest  request){
        Specification<Fournisseur> specification = GenericSpecification.like("nom", fournisseur.getNom());
        List<Fournisseur> liste = this.fournisseurRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La fournisseur "+fournisseur.getNom()+" existe déjà");
        }
        fournisseur.setNom(fournisseur.getNom().trim());
        fournisseur=this.fournisseurRepository.save(fournisseur);
        this.historiqueService.insertHistorique("Creation fournisseur", fournisseur.getIdFournisseur(), "fournisseur",request);

        return fournisseur;
    }
    
    
    public Page<Fournisseur> find(int page, int size,String search){
        Page<Fournisseur> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idFournisseur"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Fournisseur> specification = GenericSpecification.like("idFournisseur",search)
                .or(GenericSpecification.containe("nom",search))
                .or(GenericSpecification.containe("adresse",search))
                .or(GenericSpecification.containe("contact",search))
                ;
                
        liste = this.fournisseurRepository.findAll(specification, pageable);
        return liste;
    }
    @Transactional
    public void delete(String idFournisseur,HttpServletRequest  request){
        this.fournisseurRepository.deleteById(idFournisseur);
        this.historiqueService.insertHistorique("Suppression fournisseur", idFournisseur, "fournisseur",request);
    }
    
    public Fournisseur get(String idFournisseur){
        return this.fournisseurRepository.findById(idFournisseur)
                .orElseThrow(()-> new ValidationException("Fournisseur introvable"));
    }
    
    @Transactional
    public Fournisseur update(String idFournisseur ,Fournisseur fournisseur,HttpServletRequest  request){
        Specification<Fournisseur> specification = 
                GenericSpecification.like("nom", fournisseur.getNom())
                .and(GenericSpecification.notLike("idFournisseur", idFournisseur));
        List<Fournisseur> liste = this.fournisseurRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La fournisseur "+fournisseur.getNom()+" existe déjà");
        }
        fournisseur.setIdFournisseur(idFournisseur);
        fournisseur.setNom(fournisseur.getNom().trim());
        fournisseur=this.fournisseurRepository.save(fournisseur);
        this.historiqueService.insertHistorique("Modification fournisseur", fournisseur.getIdFournisseur(), "fournisseur",request);

        return fournisseur;
    }
}
