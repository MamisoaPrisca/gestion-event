/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Marque;
import com.confidente.app.repository.MarqueRepository;
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
public class MarqueService {
    private final MarqueRepository marqueRepository;
    private final HistoriqueService historiqueService;
    
    public List<Marque> getAll(){
        return marqueRepository.findAll();
    }
    
    @Transactional
    public Marque insert(Marque marque,HttpServletRequest  request){
        Specification<Marque> specification = GenericSpecification.like("nom", marque.getNom());
        List<Marque> liste = this.marqueRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La marque "+marque.getNom()+" existe déjà");
        }
        marque.setNom(marque.getNom().trim());
        marque=this.marqueRepository.save(marque);
        this.historiqueService.insertHistorique("Creation marque", marque.getIdMarque(), "marque",request);

        return marque;
    }
    
    
    public Page<Marque> find(int page, int size,String search){
        Page<Marque> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idMarque"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Marque> specification = GenericSpecification.containe("idMarque",search)
                .or(GenericSpecification.containe("nom",search))
                ;
                
        liste = this.marqueRepository.findAll(specification, pageable);
        return liste;
    }
    @Transactional
    public void delete(String idMarque,HttpServletRequest  request){
        this.marqueRepository.deleteById(idMarque);
        this.historiqueService.insertHistorique("Suppression marque", idMarque, "marque",request);
    }
    @Transactional
    public Marque update(String idMarque ,Marque marque,HttpServletRequest  request){
        Specification<Marque> specification = GenericSpecification.like("nom", marque.getNom());
        List<Marque> liste = this.marqueRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La marque "+marque.getNom()+" existe déjà");
        }
        marque.setIdMarque(idMarque);
        marque.setNom(marque.getNom().trim());
        marque=this.marqueRepository.save(marque);
        this.historiqueService.insertHistorique("Modification marque", marque.getIdMarque(), "marque",request);

        return marque;
    }
}
