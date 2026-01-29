import { Component, OnInit } from '@angular/core';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { Column, SelectColumn } from '../../../../util/generique/column';
import { LoaderService } from '../../../../util/service/loader.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../../../util/generique/page';
import { FournisseurService } from '../../../../services/fournisseur.service';

@Component({
  selector: 'app-liste',
  imports: [
    ListeGeneriqueComponent
  ],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent  implements OnInit {
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  categorie:any[]=[];
  columns :Column[]=[
    {attribut:"idFournisseur",label:"Ref",visible:true,link:"/achat/fournisseur/fiche"},
    {attribut:"nom",label:"Nom",visible:true},
    {attribut:"contact",label:"Contact",visible:true},
    {attribut:"adresse",label:"Adresse",visible:true},
  ]
  saisieButton={
    title:"Nouveau fournisseur",
    link: "/achat/fournisseur/saisie"
    // method:(item: any) => this.toggleLiveDemo()
  }
  filtreValue:any[]=[];

  columnsFiltre:SelectColumn[]=[];

  constructor(
    private loaderService:LoaderService,
    private fournisseurService : FournisseurService,
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
    for(let item of this.filtreValue){
      Object.assign(data, item);
    }
    this.fournisseurService.find(data)
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

  filtre(data:any){
    this.filtreValue=data;
    this.pageSelected=1;
    this.getData();
  }

}