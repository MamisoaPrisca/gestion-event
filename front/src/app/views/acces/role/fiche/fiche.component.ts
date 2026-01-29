import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, Tabs2Module} from '@coreui/angular';
import { finalize } from 'rxjs';
import { RoleService } from '../../../../services/role.service';
import { LoaderService } from '../../../../util/service/loader.service';
import Swal from 'sweetalert2';
import { PermissionComponent } from '../permission/permission.component';
import { UtilisateurComponent } from '../utilisateur/utilisateur.component';

@Component({
  selector: 'app-fiche',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    RouterLink,
    Tabs2Module,
    PermissionComponent,
    UtilisateurComponent
  ],
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss'
})
export class FicheComponent implements OnInit{
role:any;
  idrole:string="";
  passwordTemporaire="This is static toast message in a toaster";
  itemKey=0;
  constructor(
    private loaderService:LoaderService,
    private roleService:RoleService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ){
    this.idrole = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.roleService.get(this.idrole)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.role=response
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
      text: `Vous êtes sur le point de supprimer le rôle "${this.role.nom}". Cette action est irréversible !`,
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
        this.roleService.supprimer(this.role.idRole)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé',
              text: `Le rôle "${this.role.nom}" a été supprimé avec succès.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: true
            }).then(() =>{
              this.router.navigate(["acces/role"])
            });
          },
          error: (erreur) => {
            var message= erreur.error.text? erreur.error.text:'Impossible de supprimer le rôle.';
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

    
  // ----------------------- Onglet  ------------------------
  onTabChange(event: any) {
    this.itemKey = event;
    if(this.itemKey==1){
      this.permission=false;
    }
  }
  permission:boolean = false;

  modifierPermission(){
    this.permission=true;
    if(this.itemKey!=0){
      this.onTabChange(0);
    }
    
  }

  changerModifierPermission(event:any){
    this.permission=event;
  }

}
