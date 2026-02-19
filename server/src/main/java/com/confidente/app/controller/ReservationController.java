/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.controller;

import com.confidente.app.modele.Reservation;
import com.confidente.app.modele.view.ViewReservation;
import com.confidente.app.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ny Anjara Mamisoa
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    private final ReservationService reservationService;
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'reservation_liste')")
    @GetMapping
    public ResponseEntity find(
            @RequestParam(defaultValue = "1" ,required = false) int page,
            @RequestParam(defaultValue = "50" ,required = false) int size,
            @RequestParam(required = false) String search
            
    ){
        Page<ViewReservation> liste=this.reservationService.find(page, size, search);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'reservation_insert')")
    @PostMapping
    public ResponseEntity insert(@RequestBody Reservation reservation,HttpServletRequest  request){
        return new ResponseEntity(this.reservationService.insert(reservation,request), HttpStatus.CREATED);
    }
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'reservation_delete')")
    @DeleteMapping("{idReservation}")
    public ResponseEntity delete(@PathVariable String idReservation ,HttpServletRequest  request){
        this.reservationService.delete(idReservation, request);
        return new ResponseEntity(Map.of("message","Suppression effectuer"), HttpStatus.OK);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'reservation_update')")
    @PutMapping("{idReservation}")
    public ResponseEntity update(@PathVariable String idReservation,@RequestBody Reservation reservation,HttpServletRequest  request){
        return new ResponseEntity(this.reservationService.update(idReservation,reservation,request), HttpStatus.CREATED);
    }
    
    
    @PreAuthorize("@permissionEvaluator.isAllowed(authentication, 'reservation_fiche')")
    @GetMapping("{idReservation}")
    public ResponseEntity get(@PathVariable String idReservation){
        return new ResponseEntity(this.reservationService.get(idReservation), HttpStatus.CREATED);
    }
    
    @GetMapping("all")
    public ResponseEntity getAll(){
        return new ResponseEntity(this.reservationService.getAll(), HttpStatus.CREATED);
    }
}
