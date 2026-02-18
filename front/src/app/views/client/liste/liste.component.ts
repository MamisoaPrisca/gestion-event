import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ListeGeneriqueComponent } from 'src/app/layout/generique/liste/liste.component';
import { ClientService } from 'src/app/services/client.service';
import { Column, SelectColumn } from 'src/app/util/generique/column';
import { Page } from 'src/app/util/generique/page';
import { LoaderService } from 'src/app/util/service/loader.service';

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
  categorie:any[]=[];
  columns :Column[]=[
    {attribut:"idClient",label:"Ref",visible:true,link:"/client/fiche"},
    {attribut:"nom",label:"Nom",visible:true},
    {attribut:"contact",label:"Contact",visible:true},
    {attribut:"adresse",label:"Adresse",visible:true},
  ]
  saisieButton={
    title:"Nouveau client",
    link: "/client/saisie"
    // method:(item: any) => this.toggleLiveDemo()
  }
  filtreValue:any[]=[];

  columnsFiltre:SelectColumn[]=[];

  constructor(
    private loaderService:LoaderService,
    private clientService : ClientService,
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
    this.clientService.find(data)
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
