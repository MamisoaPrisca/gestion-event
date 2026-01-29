/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.authentification.component;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@Component("permissionEvaluator")
public class PermissionEvaluator {
    public boolean isAllowed(Authentication auth, String permission) {
        return auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ALL_PRIVILEGES") || a.getAuthority().equals(permission));
    }
}
