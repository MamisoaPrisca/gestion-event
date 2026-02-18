import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
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
  idclient:string='';
  client:any;
  variante:any[]=[];
  itemKey=0;

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private clientService:ClientService

  ){
    this.idclient = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.clientService.get(this.idclient)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.client=response
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
      text: `Vous êtes sur le point de supprimer le rôle "${this.client.designation}". Cette action est irréversible !`,
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
        this.clientService.supprimer(this.client.idClient)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `Le rôle "${this.client.designation}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: true
            }).then(() =>{
              this.router.navigate(["client"])
            });
          },
          error: (erreur) => {
            var message= erreur.error.text? erreur.error.text:'Impossible de supprimer le client.';
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
}
