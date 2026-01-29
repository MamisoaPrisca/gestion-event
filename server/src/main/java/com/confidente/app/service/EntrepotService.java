/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.modele.Entrepot;
import com.confidente.app.repository.EntrepotRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class EntrepotService {
    private final EntrepotRepository entrepotRepository;
    
    public List<Entrepot> getAll(){
        return entrepotRepository.findAll();
    }
}
