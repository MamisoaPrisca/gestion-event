import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { Page } from '../../../../util/generique/page';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { Column } from '../../../../util/generique/column';

@Component({
  selector: 'app-liste',
  imports: [
    ListeGeneriqueComponent

],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent  implements OnInit{
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  columns :Column[]=[
    {attribut:"idUtilisateur",label:"Ref",visible:true,link:"/acces/utilisateur/fiche"},
    {attribut:"nom",label:"Nom",visible:true},
    {attribut:"prenom",label:"Prenom",visible:true},
    {attribut:"login",label:"Login",visible:true},
    {attribut:"contact",label:"Contact",visible:true},
    {attribut:"dateCreation",label:"Date creation",visible:true},
    {attribut:"actif",label:"Statut",visible:true , type:"switch"}
  ]
  
  saisieButton={
    title:"Nouvel utilisateur",
    link:"/acces/utilisateur/saisie"
  }
  constructor(
    private loaderService:LoaderService,
    private utilisateurService : UtilisateurService
  ){

  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    var data={
      page:this.pageSelected,
      size:this.sizeSelected,
      search:this.search
    }
    this.utilisateurService.find(data)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.page=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  recherche(data:any){
    this.pageSelected=data.pageSelected;
    this.sizeSelected=data.sizeSelected;
    this.search=data.search;
    this.getData();
  }
  
  
}
