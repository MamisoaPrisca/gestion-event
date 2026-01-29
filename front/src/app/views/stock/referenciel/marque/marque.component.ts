import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Page } from '../../../../util/generique/page';
import { Column } from '../../../../util/generique/column';
import { Button } from '../../../../util/generique/button';
import { LoaderService } from '../../../../util/service/loader.service';
import { MarqueService } from '../../../../services/marque.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { ButtonCloseDirective, ModalBodyComponent, ModalComponent } from '@coreui/angular';
import { MarqueEditComponent } from './../marque-edit/marque-edit.component'
@Component({
  selector: 'app-marque',
  imports: [
    ListeGeneriqueComponent,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
    MarqueEditComponent
  ],
  templateUrl: './marque.component.html',
  styleUrl: './marque.component.scss'
})
export class MarqueComponent implements OnChanges{
  @Input() itemKey :number|undefined
  itemKeyValue=0;
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  marque:any[]=[];
  columns :Column[]=[
    {attribut:"idMarque",label:"Ref",visible:true},
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
    private marqueService : MarqueService,
  ){

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey===this.itemKeyValue 
        && (changes['itemKey'].currentValue!= changes['itemKey'].previousValue)){
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
    this.marqueService.find(data)
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
            this.marqueService.supprimer(item.idMarque)
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
                var message= erreur.error.message? erreur.error.message:'Impossible de supprimer la marque.';
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
  marqueSelected: any;
  modifier(item:any){
    this.marqueSelected=item
    this.toggleLiveDemo();
  }
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  addMarque(marque:any){
    var index = this.page?.content.findIndex(x=> x.idMarque===marque.idMarque);
    if(index!>-1){
      this.page?.content.splice(index!, 1, marque);
    }
    
    this.toggleLiveDemo();
  }
}
