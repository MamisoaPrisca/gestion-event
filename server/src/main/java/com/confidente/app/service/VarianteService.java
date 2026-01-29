/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Variante;
import com.confidente.app.repository.VarianteRepository;
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
public class VarianteService {
    
    private final VarianteRepository varianteRepository;
    private final HistoriqueService historiqueService;
    
    @Transactional
    public Variante insert(Variante variante,HttpServletRequest  request){
        Specification<Variante> specification = GenericSpecification.like("nom", variante.getNom());
        List<Variante> liste = this.varianteRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La variante "+variante.getNom()+" existe déjà");
        }
        variante.setNom(variante.getNom().trim());
        variante=this.varianteRepository.save(variante);
        this.historiqueService.insertHistorique("Creation variante", variante.getIdVariante(), "variante",request);

        return variante;
    }
    
    
    public Page<Variante> find(int page, int size,String search){
        Page<Variante> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idVariante"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Variante> specification = GenericSpecification.like("idVariante",search)
                .or(GenericSpecification.like("nom",search))
                ;
                
        liste = this.varianteRepository.findAll(specification, pageable);
        return liste;
    }
    @Transactional
    public void delete(String idVariante,HttpServletRequest  request){
        this.varianteRepository.deleteById(idVariante);
        this.historiqueService.insertHistorique("Suppression variante", idVariante, "variante",request);
    }
    @Transactional
    public Variante update(String idVariante ,Variante variante,HttpServletRequest  request){
        Specification<Variante> specification = GenericSpecification.like("nom", variante.getNom());
        List<Variante> liste = this.varianteRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La catégorie "+variante.getNom()+" existe déjà");
        }
        variante.setIdVariante(idVariante);
        variante.setNom(variante.getNom().trim());
        variante=this.varianteRepository.save(variante);
        this.historiqueService.insertHistorique("Modification variante", variante.getIdVariante(), "variante",request);

        return variante;
    }
}
