/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.authentification.service.JwtService;
import com.confidente.app.authentification.service.UtilisateurDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final UtilisateurDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager,
                          UtilisateurDetailsService userDetailsService,
                          JwtService jwtService) {
        this.authManager = authManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            // si l'authentification a réussi
            if (authentication.isAuthenticated()) {
                UserDetails user = userDetailsService.loadUserByUsername(request.username());
                String token = jwtService.generateToken(user);

                // retour JSON avec le token
                return ResponseEntity.ok().body(
                    Map.of(
                        "username", user.getUsername(),
                        "token", token
                    )
                );
            } else {
                return new ResponseEntity<>("Échec de l’authentification", HttpStatus.UNAUTHORIZED);
            }
        } catch (AuthenticationException e) {
            // identifiants invalides
            return new ResponseEntity<>("Identifiants incorrects", HttpStatus.UNAUTHORIZED);
        }
    }

}

record AuthRequest(
        @NotEmpty
        @NotBlank(message = "Le login est obligatoire")
        String username, 
        @NotBlank(message = "Le mot de passe est obligatoire")
        String password) {
}