import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ListeGeneriqueComponent } from 'src/app/layout/generique/liste/liste.component';
import { ReservationService } from 'src/app/services/reservation.service';
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
    {attribut:"idReservation",label:"Ref",visible:true,link:"/client/reservation/fiche"},
    {attribut:"dateDebut",label:"Date debut",visible:true},
    {attribut:"dateFin",label:"Date fin",visible:true},
    {attribut:"client",label:"Client",visible:true},
    {attribut:"contact",label:"Contact",visible:true},
    {attribut:"description",label:"Description",visible:true},
    {attribut:"etatLibelle",label:"Etat",visible:true},
  ]
  saisieButton={
    title:"Nouveau reservation",
    link: "/client/reservation/saisie"
    // method:(item: any) => this.toggleLiveDemo()
  }
  filtreValue:any[]=[];

  columnsFiltre:SelectColumn[]=[];

  constructor(
    private loaderService:LoaderService,
    private reservationService : ReservationService,
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
    this.reservationService.find(data)
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
