/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.Utilisateur;
import com.confidente.app.authentification.repository.UtilisateurRepository;
import com.confidente.app.dto.InfoUtilisateurDTO;
import com.confidente.app.dto.UtilisateurDTO;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.util.GenericSpecification;
import com.confidente.app.util.fonction.DateUtils;
import com.confidente.app.util.fonction.RandomStringGenerator;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class UtilisateurService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final HistoriqueService historiqueService;
    
    
    @Transactional
    public Utilisateur insert(UtilisateurDTO utilisateurDTO,HttpServletRequest  request){
        this.controlleLogin(utilisateurDTO.getLogin());
        Utilisateur utilisateur =new Utilisateur(utilisateurDTO.getLogin(), utilisateurDTO.getPassword(),utilisateurDTO.getNom(),utilisateurDTO.getPrenom(),utilisateurDTO.getContact());
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        utilisateur.setDateCreation(DateUtils.getCurrentTimestamp());
        utilisateur.setActif(true);
        utilisateur=utilisateurRepository.save(utilisateur);
        this.historiqueService.insertHistorique("Creation utilisateur", utilisateur.getIdUtilisateur(), "Utilisateur",request);
        return utilisateur;
    }
    
    
    @Transactional
    public Utilisateur update(String idUtilisateur , InfoUtilisateurDTO utilisateurDTO,HttpServletRequest  request){
        Utilisateur utilisateur = this.get(idUtilisateur);
        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setPrenom(utilisateurDTO.getPrenom());
        utilisateur.setContact(utilisateurDTO.getContact());
        utilisateur=utilisateurRepository.save(utilisateur);
        this.historiqueService.insertHistorique("Modification utilisateur", utilisateur.getIdUtilisateur(), "Utilisateur",request);
        return utilisateur;
    }
    
    private boolean controlleLogin(String login){
        Utilisateur utilisateur = this.utilisateurRepository.findByLogin(login)
                .orElse(null);
        if(utilisateur!=null){
            throw new ValidationException("Ce login existe déjà. Veuillez en choisir un autre.");
        }
        return true;
    }
    
    public Page<Utilisateur> find(int page, int size,String search){
        Page<Utilisateur> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idUtilisateur"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Utilisateur> specification = GenericSpecification.containe("idUtilisateur",search)
                .or(GenericSpecification.containe("login",search))
                .or(GenericSpecification.containe("nom",search))
                .or(GenericSpecification.containe("prenom",search))
                .or(GenericSpecification.containe("contact",search));
                
        liste = this.utilisateurRepository.findAll(specification, pageable);
        return liste;
    }
    
    public Utilisateur get(String idUtilisateur){
        Utilisateur utilisateur = this.utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(()-> new ValidationException("Utilisateur introuvable : la référence spécifiée n’existe pas dans la base de données."));
        return utilisateur;
    }
    
    @Transactional
    public Utilisateur updatePassword(String newPassword,HttpServletRequest  request){
        String login =AuthUtils.getCurrentUsername();
        Utilisateur utilisateur= this.utilisateurRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        String encodedPassword = passwordEncoder.encode(newPassword);
        utilisateur.setPassword(encodedPassword);
        utilisateur= this.utilisateurRepository.save(utilisateur);
        this.historiqueService.insertHistorique("Modification password", utilisateur.getIdUtilisateur(), "Utilisateur",request);
        return utilisateur;
    }
    
    
    @Transactional
    public String resetPassword(String idUtilisateur,HttpServletRequest  request){
        Utilisateur utilisateur= this.utilisateurRepository.findById(idUtilisateur).get();
        String newPassword=RandomStringGenerator.randomAlphaNumeric(6);
        String encodedPassword = passwordEncoder.encode(newPassword);
        utilisateur.setPassword(encodedPassword);
        utilisateur= this.utilisateurRepository.save(utilisateur);
        this.historiqueService.insertHistorique("Reset password", utilisateur.getIdUtilisateur(), "Utilisateur",request);
        return newPassword;
    }
    
    @Transactional
    public Utilisateur activerUtilisateur(String idUtilisateur,HttpServletRequest  request){
        Utilisateur utilisateur= this.utilisateurRepository.findById(idUtilisateur).get();
        utilisateur.setActif(!utilisateur.isActif());
        utilisateur= this.utilisateurRepository.save(utilisateur);
        String title = utilisateur.isActif()?"Activer":"Desactiver";
        this.historiqueService.insertHistorique(title+ "utilisateur", utilisateur.getIdUtilisateur(), "Utilisateur",request);
        return utilisateur;
    }
    
    @Transactional
    public void supprimer(String idUtilisateur,HttpServletRequest  request){
        this.utilisateurRepository.deleteById(idUtilisateur);
        this.historiqueService.insertHistorique("Supprimer utilisateur", idUtilisateur, "Utilisateur",request);
        
    }
    
}
