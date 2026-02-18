/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.repository.ClientRepository;
import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Client;
import com.confidente.app.modele.Fournisseur;
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
public class ClientService {
    private final ClientRepository clientRepository;
    private final HistoriqueService historiqueService;
    
    public Page<Client> find(int page, int size,String search){
        Page<Client> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idClient"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Client> specification = GenericSpecification.like("idClient",search)
                .or(GenericSpecification.like("nom",search))
                ;
                
        liste = this.clientRepository.findAll(specification, pageable);
        return liste;
    }
    
    @Transactional
    public Client insert(Client client,HttpServletRequest  request){
        Specification<Client> specification = GenericSpecification.like("nom", client.getNom());
        List<Client> liste = this.clientRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La client "+client.getNom()+" existe déjà");
        }
        client.setNom(client.getNom().trim());
        client=this.clientRepository.save(client);
        this.historiqueService.insertHistorique("Creation client", client.getIdClient(), "client",request);

        return client;
    }
    
    @Transactional
    public void delete(String idClient,HttpServletRequest  request){
        this.clientRepository.deleteById(idClient);
        this.historiqueService.insertHistorique("Suppression client", idClient, "client",request);
    }
    
    public Client get(String idClient){
        return this.clientRepository.findById(idClient)
                .orElseThrow(()-> new ValidationException("Client introvable"));
    }
    
    @Transactional
    public Client update(String idClient ,Client client,HttpServletRequest  request){
        Specification<Client> specification = 
                GenericSpecification.like("nom", client.getNom())
                .and(GenericSpecification.notLike("idClient", idClient));
        List<Client> liste = this.clientRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La client "+client.getNom()+" existe déjà");
        }
        client.setIdClient(idClient);
        client.setNom(client.getNom().trim());
        client=this.clientRepository.save(client);
        this.historiqueService.insertHistorique("Modification client", client.getIdClient(), "client",request);

        return client;
    }
    
    public List<Client> getAll(){
        return clientRepository.findAll();
    }
}
