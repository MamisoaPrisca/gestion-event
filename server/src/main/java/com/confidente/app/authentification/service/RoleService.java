/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.service;

import com.confidente.app.authentification.modele.PermissionRole;
import com.confidente.app.authentification.modele.Role;
import com.confidente.app.authentification.modele.RoleUtilisateur;
import com.confidente.app.authentification.modele.Utilisateur;
import com.confidente.app.authentification.modele.view.ViewPermission;
import com.confidente.app.authentification.repository.PermissionRoleRepository;
import com.confidente.app.authentification.repository.RoleRepository;
import com.confidente.app.authentification.repository.RoleUtilisateurRepository;
import com.confidente.app.authentification.repository.UtilisateurRepository;
import com.confidente.app.authentification.repository.view.ViewPermissionRepository;
import com.confidente.app.dto.PermissionDTO;
import com.confidente.app.dto.PermissionFonctionnaliteDTO;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.util.GenericSpecification;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository RoleRepository;
    private final HistoriqueService HistoriqueService;
    private final ViewPermissionRepository ViewPermissionRepository;
    private final UtilisateurRepository UtilisateurRepository;
    private final PermissionRoleRepository PermissionRoleRepository;
    private final PermissionRoleService PermissionRoleService;
    private final RoleUtilisateurRepository RoleUtilisateurRepository;
    
    @Transactional
    public Role insert(Role role ,HttpServletRequest  request){
        Role roleInserted=this.RoleRepository.save(role);
        this.HistoriqueService.insertHistorique("Creation rôle", roleInserted.getIdRole(), "role", request);
        return roleInserted;
    }
    
    @Transactional
    public Role update(String idRole , Role role ,HttpServletRequest  request){
        role.setIdRole(idRole);
        role=this.RoleRepository.save(role);
        this.HistoriqueService.insertHistorique("Modification rôle", idRole, "role", request);
        return role;
    }
    
    public Page<Role> find(int page, int size,String search){
        Page<Role> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idRole"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<Role> specification = GenericSpecification.containe("idRole",search)
                .or(GenericSpecification.containe("nom",search));
                
        liste = this.RoleRepository.findAll(specification, pageable);
        return liste;
    }
    
    public Role get(String idRole){
        Role role = this.RoleRepository.findById(idRole)
                .orElseThrow(()-> 
                        new ValidationException("Rôle introuvable : la référence spécifiée n’existe pas dans la base de données."));
        return role;
    }
    
    @Transactional
    public void supprimer(String idRole,HttpServletRequest  request){
        this.RoleRepository.deleteById(idRole);
        this.HistoriqueService.insertHistorique("Supprimer rôle", idRole, "Role",request);
    }
    
    public List<PermissionFonctionnaliteDTO> getPermissionRole(String idRole){
        List<Sort.Order> groupe = new ArrayList<>();
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idFonctionalite"));
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idPermission"));
        Sort sort = Sort.by(groupe);
        List<ViewPermission> viewPermissions= this.ViewPermissionRepository.findAll(sort);
        List<PermissionRole> permissionRole = this.PermissionRoleRepository.findAllByIdRole(idRole);

        // ⚙️ Créer un Set pour accélérer la recherche
        Set<String> permissionsAutorisees = permissionRole.stream()
                .map(PermissionRole::getIdPermission)
                .collect(Collectors.toSet());

        List<PermissionFonctionnaliteDTO> resultat = viewPermissions.stream()
            .filter(v -> v.getFonctionalite() != null) // ✅ Ignorer les fonctionnalités nulles
            .collect(Collectors.groupingBy(
                ViewPermission::getFonctionalite, // 🔑 clé du groupement
                Collectors.mapping(
                    v -> new PermissionDTO(
                        v.getIdPermission(),
                        v.getIdFonctionalite(),
                        v.getFonctionalite(),
                        v.getNom(),      // nom
                        v.getDescription(),
                        permissionsAutorisees.contains(v.getIdPermission()) // ✅ True si autorisé
                    ),
                    Collectors.toList()
                )
            ))
            .entrySet().stream()
            .map(e -> new PermissionFonctionnaliteDTO(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        return resultat;
    }
    
    public List<Utilisateur> getUtilisateur(String idRole){
        List<Utilisateur> liste=this.UtilisateurRepository.findAllByIdRole(idRole);
        return liste;
    }
    
    public void modifierPermission(String idRole, List<PermissionDTO> permission,HttpServletRequest  request){
        List<PermissionRole> permissionRoles= this.PermissionRoleRepository.findAllByIdRole(idRole);

        Set<String> permissionsExistantes = permissionRoles.stream()
                .map(PermissionRole::getIdPermission)
                .collect(Collectors.toSet());


        for (PermissionDTO permissionDTO : permission) {
            if(permissionDTO.isAutoriser()){
                if(!permissionsExistantes.contains(permissionDTO.getIdPermission())){
                    this.PermissionRoleService.insert(new PermissionRole(permissionDTO.getIdPermission(), idRole), request);
                }
            }
            else{
                if(permissionsExistantes.contains(permissionDTO.getIdPermission())){
                    PermissionRole permissionRole = permissionRoles.stream()
                    .filter(p -> p.getIdPermission().equals(permissionDTO.getIdPermission()))
                    .findFirst()
                    .orElse(null);
                    this.PermissionRoleService.supprimer(permissionRole.getIdPermissionRole(), request);
                }
            }
        }

    }
    
    public List<Utilisateur> getUtilisateurPasAffecter(String idRole){
        List<Utilisateur> liste= this.UtilisateurRepository.findAllNotInPermission(idRole);
        return liste;
    }
    
    @Transactional
    public Utilisateur affecterUtilisateur(String idRole, String idUtilisateur,HttpServletRequest  request){
        Utilisateur utilisateur = this.UtilisateurRepository.findById(idRole).orElse(null);
        List<RoleUtilisateur> listeRoleUtilisateurs=this.RoleUtilisateurRepository.findAllByIdRoleAndIdUtilisateur(idRole, idUtilisateur);
        if(listeRoleUtilisateurs.isEmpty()){
            RoleUtilisateur roleUtilisateur= this.RoleUtilisateurRepository.save(new RoleUtilisateur(idRole, idUtilisateur));
            this.HistoriqueService.insertHistorique("Affecter utilisateur à un rôle", roleUtilisateur.getIdRoleUtilisateur(), "role_utilisateur", request);
        }
        return utilisateur;
    }
    
    @Transactional
    public void suprimerUtilisateur(String idRole, String idUtilisateur,HttpServletRequest  request){
        List<RoleUtilisateur> listeRoleUtilisateurs=this.RoleUtilisateurRepository.findAllByIdRoleAndIdUtilisateur(idRole, idUtilisateur);
        if(!listeRoleUtilisateurs.isEmpty()){
            for(RoleUtilisateur roleUtilisateur:listeRoleUtilisateurs){
                this.RoleUtilisateurRepository.deleteById(roleUtilisateur.getIdRoleUtilisateur());
                this.HistoriqueService.insertHistorique("Supprimer un utilisateur à un rôle", roleUtilisateur.getIdRoleUtilisateur(), "role_utilisateur", request);
            }
        }
    }
}
