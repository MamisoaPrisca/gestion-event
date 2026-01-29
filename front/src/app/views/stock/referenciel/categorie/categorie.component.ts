import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Page } from '../../../../util/generique/page';
import { Column, SelectColumn } from '../../../../util/generique/column';
import { LoaderService } from '../../../../util/service/loader.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { CategorieService } from '../../../../services/categorie.service';
import { Button } from '../../../../util/generique/button';
import Swal from 'sweetalert2';
import { ButtonCloseDirective, ModalBodyComponent, ModalComponent } from '@coreui/angular';
import { CategorieEditComponent } from '../categorie-edit/categorie-edit.component';

@Component({
  selector: 'app-categorie',
  imports: [
    ListeGeneriqueComponent,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
    CategorieEditComponent
  ],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss'
})
export class CategorieComponent implements OnChanges{
  @Input() itemKey :number|undefined
  itemKeyValue=1;
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  categorie:any[]=[];
  columns :Column[]=[
    {attribut:"idCategorie",label:"Ref",visible:true},
    {attribut:"nom",label:"Nom",visible:true},
  ]
  
  
  filtreValue:any[]=[];
  boutons:Button[]=[
    {
      icon:'cilPencil',
      method:(item: any) => this.modifier(item)
    },
    {
      icon:'cilTrash',
      method:(item: any) => this.supprimer(item)
    }
  ]

  constructor(
    private loaderService:LoaderService,
    private categorieService : CategorieService,
  ){

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey===this.itemKeyValue && changes['itemKey'].currentValue!= changes['itemKey'].previousValue){
        this.getData();
      }
    }
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
    this.categorieService.find(data)
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


  supprimer(item:any){
    Swal.fire({
          title: 'Êtes-vous sûr ?',
          text: `Vous êtes sur le point de supprimer "${item.nom}". Cette action est irréversible !`,
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
            this.categorieService.supprimer(item.idCategorie)
            .pipe(finalize(() => this.loaderService.hide()))
            .subscribe({
              next: () => {
                Swal.fire({
                  title: 'Supprimé',
                  text: `La catégorie "${item.nom}" a été supprimé avec succès.`,
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                }).then(() =>{
                  this.getData();
                });
              },
              error: (erreur) => {
                var message= erreur.error.message? erreur.error.message:'Impossible de supprimer la categorie.';
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


  //-------------------------------------  Modif modal  -------------------------------------
  public visible = false;
  categorieSelected: any;
  modifier(item:any){
    this.categorieSelected=item
    this.toggleLiveDemo();
  }
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  addCategorie(categorie:any){
    var index = this.page?.content.findIndex(x=> x.idCategorie===categorie.idCategorie);
    if(index!>-1){
      this.page?.content.splice(index!, 1, categorie);
    }
    
    this.toggleLiveDemo();
  }
}
