import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { DateUtils } from '../../../../util/method/dateUtil';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-fiche',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    RouterLink,
    FormCheckComponent, 
    FormCheckInputDirective, 
    FormCheckLabelDirective,
    ToastComponent, 
    ToastHeaderComponent,  
    ToastBodyComponent,
    ToasterComponent
  ],
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss'
})
export class FicheComponent implements OnInit{
  utilisateur:any;
  idUtilisateur:string="";
  passwordTemporaire="This is static toast message in a toaster";
  constructor(
    private loaderService:LoaderService,
    private utilisateurService:UtilisateurService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ){
    this.idUtilisateur = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.utilisateurService.get(this.idUtilisateur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.utilisateur=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }

  afficherDate(value:any){
    const date = new Date(value);
    return value? DateUtils.formatDate(date!): '-';
  }


  // ----------------------- TOAST  ------------------------
  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  toggleToast() {
    this.visible.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }

  // ----------------------- Reset mot de passe  ------------------------

  resetPassword(){
    this.loaderService.show();
    this.utilisateurService.resetPassword(this.idUtilisateur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.passwordTemporaire=response.password;
        this.toggleToast();
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

   // ----------------------- Activer utilisateur  ------------------------

   activerUtilisateur(){
    const action = this.utilisateur.actif ? 'désactiver' : 'activer';
    const actionOppose = this.utilisateur.actif ? 'désactivé' : 'activé';

    Swal.fire({
      title: `Voulez-vous vraiment ${action} cet utilisateur ?`,
      text: `L'utilisateur sera ${actionOppose}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Oui, ${action}`,
      cancelButtonText: 'Annuler',
      reverseButtons: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel à ton service
        this.loaderService.show()
        this.utilisateurService.activerUtilisateur(this.utilisateur.idUtilisateur)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: (result) => {
            this.utilisateur = result;
            Swal.fire({
              title: 'Succès',
              text: `L'utilisateur a bien été ${actionOppose}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erreur',
              text: `Une erreur est survenue lors de la tentative de ${action}.`,
              icon: 'error'
            });
          }
        });
      }
    });
   }

   // ----------------------- Supprimer  ------------------------
   supprimer(){
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer l'utilisateur "${this.utilisateur.nom}". Cette action est irréversible !`,
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
        this.utilisateurService.supprimer(this.utilisateur.idUtilisateur)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `L'utilisateur "${this.utilisateur.nom}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() =>{
              this.router.navigate(["acces/utilisateur"])
            });
          },
          error: (erreur) => {
            var message= erreur.error? erreur.error:'Impossible de supprimer l’utilisateur.';
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
