import { Component, Input, SimpleChanges } from '@angular/core';
import { RoleService } from '../../../../services/role.service';
import { finalize, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilisateur } from '../../../../modele/utilisateur';
import { LoaderService } from '../../../../util/service/loader.service';
import { ButtonDirective, TableDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { AutocompletGeneriqueComponent } from 'src/app/layout/generique/autocomplet-generique/autocomplet-generique.component';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-utilisateur',
  imports: [
    TableDirective,
    RouterLink,
    AutocompletGeneriqueComponent,
    ButtonDirective,
    IconDirective
  ],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.scss'
})
export class UtilisateurComponent {
  @Input() itemKey:number|undefined;
  @Input() idRole:string|undefined;
  
  utilisateurs:Utilisateur[]=[];
  utilisateursData:Utilisateur[]=[];
  utilisateurSelected:Utilisateur|undefined
  constructor(
      private roleService:RoleService,
      private loaderService:LoaderService
    ){
  
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey==1){
        this.getData();
        this.getDataUtilisateur();
      }
    }
  }

  getData(){
    this.loaderService.show()
    this.roleService.getUtilisateur(this.idRole!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.utilisateurs=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  getDataUtilisateur(){
    this.loaderService.show()
    this.roleService.getUtilisateurData(this.idRole!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.utilisateursData=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  affecter() {
    const idRole = this.idRole!;
    const idUtilisateur = this.utilisateurSelected?.idUtilisateur!;

    this.loaderService.show();

    this.roleService.affecterUtilisateur(idRole, idUtilisateur).pipe(
      // on peut logger pour debug
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const index = this.utilisateursData.findIndex( x => x.idUtilisateur === this.utilisateurSelected?.idUtilisateur ); 
        if (index !== -1) { 
          this.utilisateurs.push(this.utilisateursData[index]);
          this.utilisateursData.splice(index, 1); 
        }

        this.utilisateurSelected = undefined;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur affecterUtilisateur', error);
      }
    });
  }

  retirer(idUtilisateur:string) {
    const idRole = this.idRole;

    this.loaderService.show();

    this.roleService.retirerUtilisateur(idRole!, idUtilisateur).pipe(
      // on peut logger pour debug
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const index = this.utilisateurs.findIndex( x => x.idUtilisateur === idUtilisateur ); 
        if (index !== -1) { 
          this.utilisateursData.push(this.utilisateurs[index]);
          this.utilisateurs.splice(index, 1); 
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur affecterUtilisateur', error);
      }
    });
  }
}
