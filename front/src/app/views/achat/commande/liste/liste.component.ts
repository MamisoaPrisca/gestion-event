import { Component, OnInit } from '@angular/core';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { Column, SelectColumn } from '../../../../util/generique/column';
import { LoaderService } from '../../../../util/service/loader.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../../../util/generique/page';
import { CommandeFournisseurService } from '../../../../services/commande-fournisseur.service';

@Component({
  selector: 'app-liste',
  imports: [
    ListeGeneriqueComponent
  ],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent implements OnInit {
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  dataListe:any[]=[];
  columns :Column[]=[
    {attribut:"idCommandeFournisseur",label:"Ref",visible:true,link:"/achat/commande/fiche"},
    {attribut:"fournisseur",label:"Fournisseur",visible:true},
    {attribut:"dateSaisie",label:"Date saisie",visible:true},
    {attribut:"dateEcheance",label:"Date échéance",visible:true},
    {attribut:"etatLibelle",label:"Etat",visible:true},
  ]
  saisieButton={
    title:"Nouveau commande fournisseur",
    link: "/achat/commande/saisie"
  }
  filtreValue:any[]=[];

  columnsFiltre:SelectColumn[]=[];

  constructor(
    private loaderService:LoaderService,
    private commandeFournisseurService : CommandeFournisseurService,
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
    this.commandeFournisseurService.find(data)
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