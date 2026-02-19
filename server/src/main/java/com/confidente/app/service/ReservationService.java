/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.service;

import com.confidente.app.authentification.repository.ReservationRepository;
import com.confidente.app.authentification.service.HistoriqueService;
import com.confidente.app.contante.ConstanteEtat;
import com.confidente.app.exeption.ValidationException;
import com.confidente.app.modele.Reservation;
import com.confidente.app.modele.view.ViewReservation;
import com.confidente.app.repository.view.ViewReservationRepository;
import com.confidente.app.util.GenericSpecification;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import java.sql.Date;
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
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final HistoriqueService historiqueService;
    private final ViewReservationRepository viewReservationRepository;
    
    public Page<ViewReservation> find(int page, int size,String search){
        Page<ViewReservation> liste;
        List<Sort.Order> groupe = new ArrayList<>();

        // Ajouter des critères de tri
        groupe.add(new Sort.Order(Sort.Direction.DESC, "idReservation"));
        
        // Créer un objet Sort en utilisant la liste d'ordres
        Sort sort = Sort.by(groupe);
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Specification<ViewReservation> specification = GenericSpecification.like("idReservation",search)
                .or(GenericSpecification.like("nom",search))
                ;
                
        liste = this.viewReservationRepository.findAll(specification, pageable);
        return liste;
    }
    
    @Transactional
    public Reservation insert(Reservation reservation,HttpServletRequest  request){
        Specification<Reservation> specification = 
            GenericSpecification.greaterThan("dateReservation", reservation.getDateDebut())
            .and(GenericSpecification.lessThan("dateReservation", reservation.getDateFin()));
        List<Reservation> liste = this.reservationRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La reservation du"+reservation.getDateDebut()+" existe déjà");
        }
        controlleDate(reservation.getDateDebut(),reservation.getDateFin());
        reservation.setEtat(ConstanteEtat.ETAT_CREER);
        reservation=this.reservationRepository.save(reservation);
        this.historiqueService.insertHistorique("Creation reservation", reservation.getIdReservation(), "reservation",request);

        return reservation;
    }
    
    @Transactional
    public void delete(String idReservation,HttpServletRequest  request){
        this.reservationRepository.deleteById(idReservation);
        this.historiqueService.insertHistorique("Suppression reservation", idReservation, "reservation",request);
    }
    
    public ViewReservation get(String idReservation){
        return this.viewReservationRepository.findById(idReservation)
                .orElseThrow(()-> new ValidationException("Reservation introvable"));
    }
    
    @Transactional
    public Reservation update(String idReservation ,Reservation reservation,HttpServletRequest  request){
        Reservation resa=this.reservationRepository.findById(idReservation).orElseThrow(()->new ValidationException("Réservation introuvable"));
        if(resa==null){
            throw new ValidationException("Réservation introuvable");
        }
        else{
           if(resa.getEtat()>=ConstanteEtat.ETAT_VALIDER){ 
               throw new ValidationException("Reservation déjà valider");
           }
           reservation.setEtat(resa.getEtat());
        }
        
        Specification<Reservation> specification = 
            GenericSpecification.greaterThan("dateReservation", reservation.getDateDebut())
                .and(GenericSpecification.lessThan("dateReservation", reservation.getDateFin()))   
                .and(GenericSpecification.notLike("idReservation", idReservation));
        List<Reservation> liste = this.reservationRepository.findAll(specification);
        if(!liste.isEmpty()){
            throw new ValidationException("La reservation du"+reservation.getDateDebut()+" existe déjà");
        }
        
        controlleDate(reservation.getDateDebut(),reservation.getDateFin());
        reservation.setIdReservation(idReservation);
        reservation=this.reservationRepository.save(reservation);
        this.historiqueService.insertHistorique("Modification reservation", reservation.getIdReservation(), "reservation",request);

        return reservation;
    }
    
    public List<ViewReservation> getAll(){
        return viewReservationRepository.findAll();
    }
    
    void controlleDate(Date date1 , Date date2){
        if(!date1.equals(date2) && !date1.before(date2)){
            throw new ValidationException("La date debut doit etre avant la date fin");
        }
    }
}
