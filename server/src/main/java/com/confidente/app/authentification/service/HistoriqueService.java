/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.Historique;
import com.confidente.app.authentification.repository.HistoriqueRepository;
import com.confidente.app.util.fonction.DateUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class HistoriqueService {
    private final HistoriqueRepository historiqueRepository;
    private final JwtService jwtService;
    
    public void insertHistorique(String action,String idSource,String source,HttpServletRequest  request){
        String token = request.getHeader("Authorization").substring(7);
        String idUtilisateur = jwtService.extractUserId(token);
        
        Historique historique= new Historique();
        historique.setDateEnregistrement(DateUtils.getCurrentTimestamp());
        historique.setIdUtilisateur(idUtilisateur);
        historique.setIdSource(idSource);
        historique.setSource(source);
        historique.setAction(action);
        this.historiqueRepository.save(historique);
    }
}
