/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Conditionnement;
import com.confidente.app.repository.ConditionnementRepository;
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
public class ConditionnementService {
    private final ConditionnementRepository conditionnementRepository;
    private final HistoriqueService historiqueService;
    
    public List<Conditionnement> getAll(){
        List<Conditionnement> liste=conditionnementRepository.findAll();
        return liste;
    }
    
    @Transactional
    public Conditionnement insert(Conditionnement conditionnement,HttpServletRequest  request){
        Specification<Conditionnement> specification = GenericSpecification.like("designation", conditionnement.getDesignation());
        List<Conditionnement> liste = this.conditionnementRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("Le conditionnement "+conditionnement.getDesignation()+" existe déjà");
        }
        conditionnement.setDesignation(conditionnement.getDesignation().trim());
        conditionnement.setAbreviation(conditionnement.getAbreviation().trim());
        conditionnement=this.conditionnementRepository.save(conditionnement);
        this.historiqueService.insertHistorique("Creation conditionnement", conditionnement.getIdConditionnement(), "conditionnement",request);

        return conditionnement;
    }
    
    @Transactional
    public Conditionnement update(String idConditionnement, Conditionnement conditionnement,HttpServletRequest  request){
        Specification<Conditionnement> specification = 
                GenericSpecification.like("designation", conditionnement.getDesignation())
                .and(GenericSpecification.notLike("idConditionnement", idConditionnement));
        List<Conditionnement> liste = this.conditionnementRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("Le conditionnement "+conditionnement.getDesignation()+" existe déjà");
        }
        conditionnement.setDesignation(conditionnement.getDesignation().trim());
        conditionnement.setAbreviation(conditionnement.getAbreviation().trim());
        conditionnement.setIdConditionnement(idConditionnement);
        conditionnement=this.conditionnementRepository.save(conditionnement);
        this.historiqueService.insertHistorique("Moditication conditionnement", conditionnement.getIdConditionnement(), "conditionnement",request);

        return conditionnement;
    }
    
    
    public Page<Conditionnement> find(int page, int size,String search){
        Page<Conditionnement> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idConditionnement"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Conditionnement> specification = GenericSpecification.like("idConditionnement",search)
                .or(GenericSpecification.like("nom",search))
                ;
                
        liste = this.conditionnementRepository.findAll(specification, pageable);
        return liste;
    }
    
    @Transactional
    public void delete(String idConditionnement,HttpServletRequest  request){
        this.conditionnementRepository.deleteById(idConditionnement);
        this.historiqueService.insertHistorique("Suppression conditionnement", idConditionnement, "conditionnement",request);
    }
    
}
