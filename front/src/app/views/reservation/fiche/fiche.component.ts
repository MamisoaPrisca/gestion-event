import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import { DateUtils } from 'src/app/util/method/dateUtil';
import { LoaderService } from 'src/app/util/service/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fiche',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    RouterLink,
  ],
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss'
})
export class FicheComponent {
  idreservation:string='';
  reservation:any;
  variante:any[]=[];
  itemKey=0;

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private reservationService:ReservationService

  ){
    this.idreservation = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.reservationService.get(this.idreservation)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.reservation=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }

  // ----------------------- Supprimer  ------------------------
  supprimer(){
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le rôle "${this.reservation.designation}". Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      confirmButtonColor: '#d33',   // Rouge pour la suppression
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel au service pour supprimer
        this.loaderService.show();
        this.reservationService.supprimer(this.reservation.idReservation)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `Le rôle "${this.reservation.designation}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: true
            }).then(() =>{
              this.router.navigate(["client/reservation"])
            });
          },
          error: (erreur) => {
            var message= erreur.error.text? erreur.error.text:'Impossible de supprimer le reservation.';
            Swal.fire({
              title: 'Erreur',
              text: message,
              icon: 'error'
            });
          }
        });
      }
    });
  }

  public getDate(col:Date):string{
    const date = new Date(String(col).length==10?col+" 00:00:00":col);
    return DateUtils.formatDateDDMMYYYY(date);
    
  }
}
