/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.Utilisateur;
import com.confidente.app.authentification.modele.view.ToutPermissionUtilisateur;
import com.confidente.app.authentification.repository.UtilisateurRepository;
import com.confidente.app.authentification.repository.view.ToutPermissionUtilisateurRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
public class UtilisateurDetailsService implements UserDetailsService {

    private final UtilisateurRepository userRepository;
    private final ToutPermissionUtilisateurRepository toutPermissionUtilisateurRepository;

    public UtilisateurDetailsService(UtilisateurRepository repo, ToutPermissionUtilisateurRepository toutPermissionUtilisateurRepository)  {
        this.userRepository = repo;
        this.toutPermissionUtilisateurRepository=toutPermissionUtilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user = userRepository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        List<ToutPermissionUtilisateur> permission = this.toutPermissionUtilisateurRepository.findAllByIdUtilisateur(user.getIdUtilisateur());
        System.out.println(permission.toString());
        List<SimpleGrantedAuthority> authorities = permission.stream()
            .filter(p -> p != null && p.getNom() != null)
            .map(p -> new SimpleGrantedAuthority(p.getNom()))
            .collect(Collectors.toList());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getLogin())
                .authorities(authorities)
                .password(user.getPassword())
                .build();
    }
    
}
