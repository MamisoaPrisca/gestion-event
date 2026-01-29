import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../util/generique/page';
import { Column, SelectColumn } from '../../../../util/generique/column';
import { LoaderService } from '../../../../util/service/loader.service';
import { ProduitService } from '../../../../services/produit.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { MarqueService } from '../../../../services/marque.service';
import { CategorieService } from '../../../../services/categorie.service';

@Component({
  selector: 'app-liste',
  imports: [
    ListeGeneriqueComponent,
  ],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent implements OnInit {
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  categorie:any[]=[];
  columns :Column[]=[
    {attribut:"idProduit",label:"Ref",visible:true,link:"/stock/produit/fiche"},
    {attribut:"designation",label:"Designantion",visible:true},
    {attribut:"marque",label:"Marque",visible:true},
    {attribut:"categorie",label:"Categorie",visible:true},
    {attribut:"conditionnement",label:"Conditionnement",visible:true},
  ]
  saisieButton={
    title:"Nouveau produit",
    link: "/stock/produit/saisie"
    // method:(item: any) => this.toggleLiveDemo()
  }
  filtreValue:any[]=[];

  columnsFiltre:SelectColumn[]=[
    {attribut:"idCategorie",label:"Categorie" , labelAfficher:'nom',value:"idCategorie"},
    {attribut:"idMarque",label:"Marque", labelAfficher:'nom',value:'idMarque'},
  ];

  constructor(
    private loaderService:LoaderService,
    private produitService : ProduitService,
        private marqueService: MarqueService,
        private categorieService:CategorieService,
  ){

  }
  ngOnInit(): void {
    this.getData();
    this.getMarque();
    this.getCategorie()
  }

  getMarque(){
    this.loaderService.hide()
    this.marqueService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.columnsFiltre[1].liste=response;
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  
  getCategorie(){
    this.loaderService.hide()
    this.categorieService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.columnsFiltre[0].liste=response;
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
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
    this.produitService.find(data)
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
