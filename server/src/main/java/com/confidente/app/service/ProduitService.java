/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Conditionnement;
import com.confidente.app.modele.ConditionnementProduit;
import com.confidente.app.modele.Fournisseur;
import com.confidente.app.modele.HistoriquePrixAchat;
import com.confidente.app.modele.PrixAchat;
import com.confidente.app.modele.Produit;
import com.confidente.app.modele.Variante;
import com.confidente.app.modele.VarianteProduit;
import com.confidente.app.modele.view.ViewConditionnementProduit;
import com.confidente.app.modele.view.ViewPrixAchat;
import com.confidente.app.modele.view.ViewProduit;
import com.confidente.app.modele.view.ViewVarianteProduit;
import com.confidente.app.repository.ConditionnementProduitRepository;
import com.confidente.app.repository.ConditionnementRepository;
import com.confidente.app.repository.FournisseurRepository;
import com.confidente.app.repository.HistoriquePrixAchatRepository;
import com.confidente.app.repository.PrixAchatRepository;
import com.confidente.app.repository.ProduitRepository;
import com.confidente.app.repository.VarianteProduitRepository;
import com.confidente.app.repository.VarianteRepository;
import com.confidente.app.repository.view.ViewConditionnementProduitRepository;
import com.confidente.app.repository.view.ViewPrixAchatRepository;
import com.confidente.app.repository.view.ViewProduitRepository;
import com.confidente.app.repository.view.ViewVarianteProduitRepository;
import com.confidente.app.util.GenericSpecification;
import com.confidente.app.util.fonction.DateUtils;
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
public class ProduitService {
    private final ProduitRepository produitRepository;
    private final HistoriqueService historiqueService;
    private final ViewProduitRepository ViewProduitRepository;
    private final ViewVarianteProduitRepository ViewVarianteProduitRepository;
    private final VarianteRepository VarianteRepository;
    private final VarianteProduitRepository VarianteProduitRepository;
    private final ViewConditionnementProduitRepository ViewConditionnementProduitRepository;
    private final ConditionnementRepository ConditionnementRepository;
    private final ConditionnementProduitRepository ConditionnementProduitRepository;
    private final ViewPrixAchatRepository viewPrixAchatRepository;
    private final FournisseurRepository FournisseurRepository;
    private final PrixAchatRepository PrixAchatRepository;
    private final HistoriquePrixAchatRepository HistoriquePrixAchatRepository;
    
    @Transactional
    public Produit insert(Produit produit , HttpServletRequest request){
        List<Produit> liste = this.produitRepository.findAll(GenericSpecification.like("designation",produit.getDesignation()));
        if(!liste.isEmpty()){
            throw new ValidationException("Ce produit existe déjà");
        }
        
        if (produit.getIdMarque().isEmpty()) {
            produit.setIdMarque(null);
        }
        if (produit.getIdCategorie().isEmpty()) {
            produit.setIdCategorie(null);
        }
        produit= this.produitRepository.save(produit);
        ConditionnementProduit conditionnementProduit= new ConditionnementProduit("Defaut", 1, produit.getIdProduit(), produit.getConditionnementDefaut());
        this.addConditionnement(produit.getIdProduit(), conditionnementProduit, request);
        this.historiqueService.insertHistorique("Creation produit", produit.getIdProduit(), "produit", request);
        return produit;
    }
    
    public Page<ViewProduit> find(int page, int size,String search,String idCategorie, String idMarque){
        Page<ViewProduit> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idProduit"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<ViewProduit> specification = 
                GenericSpecification.containe("idProduit",search)
                .or(GenericSpecification.containe("designation",search))
                .or(GenericSpecification.containe("categorie",search))
                .or(GenericSpecification.containe("marque",search))
                .and(
                    GenericSpecification.likeStrict("idMarque",idMarque)
                        .and(GenericSpecification.likeStrict("idCategorie",idCategorie))
                )
                ;
                
        liste = this.ViewProduitRepository.findAll(specification, pageable);
        return liste;
    }
    
    public ViewProduit get(String idProduit){
        ViewProduit produit = this.ViewProduitRepository.findById(idProduit)
                .orElseThrow(()-> new ValidationException("Produit introvable"));
        return produit;
    }
    
    @Transactional
    public void supprimer(String idProduit,HttpServletRequest  request){
        this.produitRepository.deleteById(idProduit);
        this.historiqueService.insertHistorique("Supprimer produit", idProduit, "produit",request);
    }
    
    @Transactional
    public Produit update(String idProduit , Produit produit ,HttpServletRequest  request){
        produit.setIdProduit(idProduit);
        produit=this.produitRepository.save(produit);
        List<ConditionnementProduit> list = this.ConditionnementProduitRepository.findAll
        (GenericSpecification.like( "idConditionnement",produit.getConditionnementDefaut())
            .and(GenericSpecification.like( "idProduit",idProduit))
        );
        if(list.isEmpty()){
            ConditionnementProduit conditionnementProduit= new ConditionnementProduit("Defaut", 1, produit.getIdProduit(), produit.getConditionnementDefaut());
            this.addConditionnement(produit.getIdProduit(), conditionnementProduit, request);
        }
        this.historiqueService.insertHistorique("Modification rôle", idProduit, "role", request);
        return produit;
    }
    
    public List<ViewVarianteProduit> getVariante(String idProduit){
        List<ViewVarianteProduit> liste=this.ViewVarianteProduitRepository.findAllByIdProduit(idProduit);
        return liste;
    }
    
    public List<Variante> getAllVariante(String idProduit){
        List<Variante> liste=this.VarianteRepository.findAllByIdProduit(idProduit);
        return liste;
    }
    
    public Variante affecterVariante(String idProduit, String idVariante,HttpServletRequest  request){
        Variante variante= this.VarianteRepository.findById(idVariante).orElse(null);
        List<VarianteProduit> listeVarianteProduits=this.VarianteProduitRepository.findAllByIdVarianteAndIdProduit(idVariante, idProduit);
        if(listeVarianteProduits.isEmpty()){
            VarianteProduit varianteProduit= this.VarianteProduitRepository.save(new VarianteProduit(null,idVariante, idProduit));
            this.historiqueService.insertHistorique("Affecter une variante à un produit", varianteProduit.getIdVarianteProduit(), "variante_produit", request);
        }
        return variante;
    }
    
    @Transactional
    public void supprimerVariante(String idProduit, String idVariante,HttpServletRequest  request){
        List<VarianteProduit> listeVarianteProduit=this.VarianteProduitRepository.findAllByIdVarianteAndIdProduit(idVariante,idProduit);
        if(!listeVarianteProduit.isEmpty()){
            for(VarianteProduit varianteProduit:listeVarianteProduit){
                this.VarianteProduitRepository.deleteById(varianteProduit.getIdVarianteProduit());
                this.historiqueService.insertHistorique("Supprimer une variante à un produit", varianteProduit.getIdVarianteProduit(), "variante_produit", request);
            }
        }
    }
    
    public List<ViewConditionnementProduit> getConditionnement(String idProduit){
        List<ViewConditionnementProduit> liste=this.ViewConditionnementProduitRepository.findAllByIdProduit(idProduit);
        return liste;
    }
    
    public List<Conditionnement> getAllConditionnement(String idProduit){
        List<Conditionnement> liste=this.ConditionnementRepository.findAllByIdProduit(idProduit);
        return liste;
    }
    
    @Transactional
    public ConditionnementProduit addConditionnement(String idProduit, ConditionnementProduit conditionnementProduit,HttpServletRequest  request){
        conditionnementProduit.setIdProduit(idProduit);
        conditionnementProduit=this.ConditionnementProduitRepository.save(conditionnementProduit);
        this.historiqueService.insertHistorique("Ajouter conditionnement de produit", conditionnementProduit.getIdConditionnementProduit(), "conditionnement_produit", request);
        ConditionnementProduitRepository.flush(); 
        return conditionnementProduit;
    }
    
    public ViewConditionnementProduit getConditionnementProduit(String idConditionnementProduit){
        ViewConditionnementProduit viewConditionnementProduit=this.ViewConditionnementProduitRepository.findById(idConditionnementProduit).get();
        return viewConditionnementProduit;
    }
    
    @Transactional
    public void supprimerConditionnement(String idProduit, String idConditionnementProduit,HttpServletRequest  request){
        List<ConditionnementProduit> listeConditionnementProduits=this.ConditionnementProduitRepository.findAllByIdConditionnementProduitAndIdProduit(idConditionnementProduit,idProduit);
        if(!listeConditionnementProduits.isEmpty()){
            for(ConditionnementProduit conditionnementProduit:listeConditionnementProduits){
                this.ConditionnementProduitRepository.deleteById(conditionnementProduit.getIdConditionnementProduit());
                this.historiqueService.insertHistorique("Supprimer une conditionnement à un produit", conditionnementProduit.getIdConditionnementProduit(), "conditionnement_produit", request);
            }
        }
    }
    
    @Transactional
    public ConditionnementProduit updateConditionnement(String idProduit,String idConditionnement, ConditionnementProduit conditionnementProduit,HttpServletRequest  request){
        this.ConditionnementProduitRepository.findByIdConditionnementProduitAndIdProduit(idConditionnement,idProduit)
                .orElseThrow(()-> new ValidationException("Le conditionnement spécifié est invalide ou introuvable. Veuillez réessayer la modification."));
        conditionnementProduit.setIdProduit(idProduit);
        conditionnementProduit.setIdConditionnementProduit(idConditionnement);
        conditionnementProduit=this.ConditionnementProduitRepository.save(conditionnementProduit);
        this.historiqueService.insertHistorique("Ajouter conditionnement de produit", conditionnementProduit.getIdConditionnementProduit(), "conditionnement_produit", request);
        ConditionnementProduitRepository.flush(); 
        return conditionnementProduit;
    }
    
    
    public List<ViewPrixAchat> getPrixAchat(String idProduit){
        List<ViewPrixAchat> liste=this.viewPrixAchatRepository.findAllByIdProduit(idProduit);
        return liste;
    }
    
    public List<Fournisseur> getFournisseurData(String idProduit){
        List<Fournisseur> fournisseur= this.FournisseurRepository.findAllByIdProduit(idProduit);
        return fournisseur;
    }
    
    @Transactional
    public PrixAchat addPrixAchat(String idProduit, PrixAchat prixAchat,HttpServletRequest  request){
        prixAchat.setIdProduit(idProduit);
        prixAchat.setDateSaisie(DateUtils.getCurrentTimestamp());
        prixAchat=this.PrixAchatRepository.save(prixAchat);
        this.HistoriquePrixAchatRepository.save(new HistoriquePrixAchat(prixAchat.getIdPrixAchat(),prixAchat.getMontant(),prixAchat.getDateSaisie()));
        this.historiqueService.insertHistorique("Ajouter prix fournisseur de produit", prixAchat.getIdPrixAchat(), "prix_achat", request);
        return prixAchat;
    }
    
    @Transactional
    public PrixAchat updatePrixAchat(String idProduit,String idPrixAchat, PrixAchat prixAchat,HttpServletRequest  request){
        PrixAchat prixAchat1= this.PrixAchatRepository.findById(idPrixAchat)
                .orElseThrow(()->new ValidationException("Reference invalide"));
        prixAchat1.setDateSaisie(DateUtils.getCurrentTimestamp());
        prixAchat1.setMontant(prixAchat.getMontant());
        prixAchat1.setTva(prixAchat.getTva());
        prixAchat=this.PrixAchatRepository.save(prixAchat1);
        this.HistoriquePrixAchatRepository.save(new HistoriquePrixAchat(prixAchat.getIdPrixAchat(),prixAchat.getMontant(),prixAchat.getDateSaisie()));
        this.historiqueService.insertHistorique("Modifier prix fournisseur de produit", prixAchat.getIdPrixAchat(), "prix_achat", request);
        return prixAchat;
    }
    
}
