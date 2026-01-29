/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.Utilisateur;
import com.confidente.app.authentification.modele.view.ToutPermissionUtilisateur;
import com.confidente.app.authentification.repository.UtilisateurRepository;
import com.confidente.app.authentification.repository.view.ToutPermissionUtilisateurRepository;
import com.confidente.app.util.fonction.DateUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
    import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Service
@RequiredArgsConstructor
public class JwtService {
    private static final String SECRET_KEY = "supersecretkey123456789supersecretkey123456789";
    private final UtilisateurRepository utilisateurRepository;
    private final ToutPermissionUtilisateurRepository toutPermissionUtilisateurRepository;
    
    public String generateToken(UserDetails userDetails) {
        Utilisateur utilisateur =utilisateurRepository.findByLogin(userDetails.getUsername()).get();
        List<ToutPermissionUtilisateur> permission = this.toutPermissionUtilisateurRepository.findAllByIdUtilisateur(utilisateur.getIdUtilisateur());
        System.out.println("---------------------------"+utilisateur.getIdUtilisateur());
        List<String> authorities = permission.stream()
            .filter(p -> p != null && p.getNom() != null)
            .map(p -> p.getNom())
            .collect(Collectors.toList());
        
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setId(utilisateur.getIdUtilisateur())
                .claim("permissions", authorities)
                .setIssuedAt(new Date())
                .setExpiration(new Date(DateUtils.getCurrentTimestamp().getTime()+ 1000 * 60 * 60 * 24))
                .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    // 🔹 Extraire le username (login) depuis le token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 🔹 Vérifier si le token est valide
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // 🔹 Vérifie la date d’expiration
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody(); 
    }

   
    
    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    
    public String extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getId(); // correspond à setId() dans generateToken()
    }
}
