/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.contante.ConstanteEtat;
import com.confidente.app.contante.ConstanteValue;
import com.confidente.app.dto.EntrerStockDto;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.CommandeFournisseur;
import com.confidente.app.modele.DetailCommandeFournisseur;
import com.confidente.app.modele.MouvementStock;
import com.confidente.app.modele.view.ViewCommandeFournisseur;
import com.confidente.app.modele.view.ViewDetailCommandeFournisseur;
import com.confidente.app.modele.view.ViewAllPrixAchat;
import com.confidente.app.repository.CommandeFournisseurRepository;
import com.confidente.app.repository.DetailCommandeFournisseurRepository;
import com.confidente.app.repository.MouvementStockRepository;
import com.confidente.app.repository.view.ViewCommandeFournisseurRepository;
import com.confidente.app.repository.view.ViewDetailCommandeFournisseurRepository;
import com.confidente.app.repository.view.ViewAllPrixAchatRepository;
import com.confidente.app.util.GenericSpecification;
import com.confidente.app.util.fonction.DateUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
@RequiredArgsConstructor
@Service
public class CommandeFournisseurService {
    private final CommandeFournisseurRepository commandeFournisseurRepository;
    private final HistoriqueService historiqueService;
    private final ViewCommandeFournisseurRepository viewCommandeFournisseurRepository;
    private final ViewAllPrixAchatRepository ViewAllPrixAchatRepository;
    private final DetailCommandeFournisseurRepository DetailCommandeFournisseurRepository;
    private final ViewDetailCommandeFournisseurRepository ViewDetailCommandeFournisseurRepository;
    private final MouvementStockRepository MouvementStockRepository;
    
    @Transactional
    public CommandeFournisseur insert(CommandeFournisseur commandeFournisseur, HttpServletRequest request){
        commandeFournisseur.setEtat(ConstanteEtat.ETAT_CREER);
        commandeFournisseur= this.commandeFournisseurRepository.save(commandeFournisseur);
        this.historiqueService.insertHistorique("Creation commande fournisseur", commandeFournisseur.getIdCommandeFournisseur(), "commande_fournisseur", request);
        return commandeFournisseur;
    }
    
    public Page<ViewCommandeFournisseur> find(int page, int size,String search, int etat){
        Page<ViewCommandeFournisseur> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idCommandeFournisseur"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<ViewCommandeFournisseur> specification = (GenericSpecification.like("idCommandeFournisseur",search)
                .or(GenericSpecification.like("fournisseur",search)))
                .and(GenericSpecification.equal(search, search))
                ;
                
        liste = this.viewCommandeFournisseurRepository.findAll(specification, pageable);
        return liste;
    }
    
    @Transactional
    public void delete(String idFournisseur,HttpServletRequest  request){
        CommandeFournisseur commandeFournisseur= this.commandeFournisseurRepository.findById(idFournisseur).
                orElseThrow(()-> new ValidationException("Commande introuvable"));
        if(commandeFournisseur.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Cette commande ne peut pas etre supprimer");
        }
        Specification<DetailCommandeFournisseur> specification = GenericSpecification.like("idCommandeFournisseur",idFournisseur);
        this.DetailCommandeFournisseurRepository.delete(specification);
        this.commandeFournisseurRepository.deleteById(idFournisseur);
        this.historiqueService.insertHistorique("Suppression commande fournisseur", idFournisseur, "fournisseur",request);
    }
    
    public ViewCommandeFournisseur get(String idFournisseur){
        return this.viewCommandeFournisseurRepository.findById(idFournisseur)
                .orElseThrow(()-> new ValidationException("Commande fournisseur introvable"));
    }
    
    public CommandeFournisseur valider(String idFournisseur,HttpServletRequest  request){
        CommandeFournisseur commandeFournisseur= this.commandeFournisseurRepository.findById(idFournisseur)
                .orElseThrow(()-> new ValidationException("Commande fournisseur introvable"));
        if(commandeFournisseur.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Commande fournisseur deja valider");
        }
        commandeFournisseur.setEtat(ConstanteEtat.ETAT_VALIDER);
        commandeFournisseur = this.commandeFournisseurRepository.save(commandeFournisseur);
        this.historiqueService.insertHistorique("Valider commande fournisseur", commandeFournisseur.getIdCommandeFournisseur(), "fournisseur",request);

        return commandeFournisseur;
    }
    
    @Transactional
    public CommandeFournisseur update(String idCommandeFournisseur,CommandeFournisseur commandeFournisseur,HttpServletRequest  request){
        CommandeFournisseur temp = this.commandeFournisseurRepository.findById(idCommandeFournisseur).orElseThrow(()-> new ValidationException("Commande introuvable"));
        if(temp.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Impossible de modifier , la commande est deja valider");
        }
        commandeFournisseur.setIdCommandeFournisseur(idCommandeFournisseur);
        commandeFournisseur=this.commandeFournisseurRepository.save(commandeFournisseur);
        this.historiqueService.insertHistorique("Modification commande fournisseur", commandeFournisseur.getIdCommandeFournisseur(), "fournisseur",request);

        return commandeFournisseur;
    }
    
    public List<ViewAllPrixAchat> getProduitData(String idCommandeFournisseur){
        List<ViewAllPrixAchat> liste=this.ViewAllPrixAchatRepository.findAllByIdCommandeFournisseur(idCommandeFournisseur);
        return liste;
    }
    
    public DetailCommandeFournisseur addDetail(String idCommandeFournisseur,DetailCommandeFournisseur detailCommandeFournisseur,HttpServletRequest  request){
        CommandeFournisseur temp = this.commandeFournisseurRepository.findById(idCommandeFournisseur).orElseThrow(()-> new ValidationException("Commande introuvable"));
        if(temp.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Impossible de modifier , la commande est deja valider");
        }
        detailCommandeFournisseur.setIdCommandeFournisseur(idCommandeFournisseur);
        detailCommandeFournisseur=this.DetailCommandeFournisseurRepository.save(detailCommandeFournisseur);
        this.historiqueService.insertHistorique("Ajouter detail commande fournisseur", detailCommandeFournisseur.getIdDetailCommandeFournisseur(), "detail_commande_fournisseur",request);
        return detailCommandeFournisseur;
    }
    
    public ViewDetailCommandeFournisseur getDetail(String idDetail){
       return this.ViewDetailCommandeFournisseurRepository.findById(idDetail).orElseThrow(
       ()-> new ValidationException("Detail commande fournisseur introuvable"));
    }
    
    public List<ViewDetailCommandeFournisseur> getAllDetails(String idCommandeFournisseur){
        List<Sort.Order> groupe = new ArrayList<>();
        groupe.add(new Sort.Order(Sort.Direction.ASC, "idDetailCommandeFournisseur"));
        Sort sort = Sort.by(groupe);
        List<ViewDetailCommandeFournisseur> liste=this.ViewDetailCommandeFournisseurRepository.findAllByIdCommandeFournisseur(idCommandeFournisseur,sort);
        return liste;
    }
    
    public void retirerDetails(String idCommandeFournisseur,String idDetailCommandeFournisseur,HttpServletRequest  request){
        CommandeFournisseur temp = this.commandeFournisseurRepository.findById(idCommandeFournisseur).orElseThrow(()-> new ValidationException("Commande introuvable"));
        if(temp.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Impossible de modifier , la commande est deja valider");
        }
        this.DetailCommandeFournisseurRepository.deleteById(idDetailCommandeFournisseur);
                this.historiqueService.insertHistorique("Supprimer detail commande fournisseur", idDetailCommandeFournisseur, "detail_commande_fournisseur",request);

    }
    
    public DetailCommandeFournisseur modifierDetails(String idCommandeFournisseur,String idDetailCommandeFournisseur,DetailCommandeFournisseur detailCommandeFournisseur,HttpServletRequest  request){
        CommandeFournisseur commandeTemp = this.commandeFournisseurRepository.findById(idCommandeFournisseur).orElseThrow(()-> new ValidationException("Commande introuvable"));
        if(commandeTemp.getEtat()>ConstanteEtat.ETAT_CREER){
            throw new ValidationException("Impossible de modifier , la commande est deja valider");
        }
        DetailCommandeFournisseur temp = this.DetailCommandeFournisseurRepository.findById(idDetailCommandeFournisseur).
                orElseThrow(()-> new ValidationException("Detail commande fournisseur introuvable"));
        temp.setQuantite(detailCommandeFournisseur.getQuantite());
        detailCommandeFournisseur=this.DetailCommandeFournisseurRepository.save(temp);
        this.historiqueService.insertHistorique("Modifier detail commande fournisseur", idDetailCommandeFournisseur, "detail_commande_fournisseur",request);
        return detailCommandeFournisseur;
    }
    
    public List<ViewDetailCommandeFournisseur> getResteLiver(String idCommandeFournisseur){
        Specification<ViewDetailCommandeFournisseur> specification = (GenericSpecification.like("idCommandeFournisseur",idCommandeFournisseur))
                .and(GenericSpecification.greaterThan("reste", 0))
                ;
        List<ViewDetailCommandeFournisseur> listeDetail = this.ViewDetailCommandeFournisseurRepository.findAllByIdCommandeFournisseur(idCommandeFournisseur, Sort.by(new ArrayList<>()));
        return listeDetail;
    }
    public void entrerEnStock(String idCommandeFournisseur,String idEntrepot ,List<EntrerStockDto> entreStock ,HttpServletRequest  request){
        List<ViewDetailCommandeFournisseur> listeDetail = this.ViewDetailCommandeFournisseurRepository.findAllByIdCommandeFournisseur(idCommandeFournisseur, Sort.by(new ArrayList<>()));
        
        Map<String, EntrerStockDto> commandeMap =
        entreStock.stream()
              .collect(Collectors.toMap(EntrerStockDto::getIdSource, c -> c));

        List<ViewDetailCommandeFournisseur> insuffisants = new ArrayList<>();
        List<MouvementStock> mouvementStock = new ArrayList<>();

        listeDetail.forEach(commande -> {
            EntrerStockDto entrer = commandeMap.get(commande.getIdDetailCommandeFournisseur());
            if (entrer != null) {

                // 🔹 Création d'un NOUVEL objet
                mouvementStock.add(new MouvementStock(
                        commande.getIdProduit(),
                        commande.getIdVariante(),
                        entrer.getQuantite()*commande.getQuantiteConditionnement(),
                        ConstanteValue.ENTRER,
                        DateUtils.getCurrentTimestamp(),
                        commande.getIdDetailCommandeFournisseur(),
                        "commande_fournisseur",
                        idEntrepot
                ));

                // 🔹 Condition insuffisant
                if (commande.getReste() < entrer.getQuantite()) {
                    insuffisants.add(commande); // objet liste1
                }
            }
        });
        
        if(!insuffisants.isEmpty()){
            throw new ValidationException("La quantite doit etre inferieur ou egale a la quantite restant");
        }
        
        List<MouvementStock> mouvementStockEffectuer=this.MouvementStockRepository.saveAll(mouvementStock);
        for(MouvementStock temp: mouvementStockEffectuer){
            this.historiqueService.insertHistorique("Enregistrer mouvement stock", temp.getIdMouvementStock(), "mouvement_stock",request);
        }
        
        this.historiqueService.insertHistorique("Enregistrer entrer en stock ", idCommandeFournisseur, "commande_fournisseur",request);

    }
}
