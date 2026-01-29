import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { FournisseurService } from '../../../../services/fournisseur.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
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
  idFournisseur:string='';
  fournisseur:any;
  variante:any[]=[];
  itemKey=0;

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private fournisseurService:FournisseurService

  ){
    this.idFournisseur = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.fournisseurService.get(this.idFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.fournisseur=response
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
      text: `Vous êtes sur le point de supprimer le rôle "${this.fournisseur.designation}". Cette action est irréversible !`,
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
        this.fournisseurService.supprimer(this.fournisseur.idFournisseur)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `Le rôle "${this.fournisseur.designation}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: true
            }).then(() =>{
              this.router.navigate(["achat/fournisseur"])
            });
          },
          error: (erreur) => {
            var message= erreur.error.text? erreur.error.text:'Impossible de supprimer le fournisseur.';
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
