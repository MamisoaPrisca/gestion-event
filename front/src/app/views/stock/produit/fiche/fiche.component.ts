import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, Tabs2Module} from '@coreui/angular';
import { finalize } from 'rxjs';
import { LoaderService } from '../../../../util/service/loader.service';
import { ProduitService } from '../../../../services/produit.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { VarianteComponent } from '../variante/variante.component';
import { ConditionnementComponent } from '../conditionnement/conditionnement.component';
import { PrixFournisseurComponent } from '../prix-fournisseur/prix-fournisseur.component';

@Component({
  selector: 'app-fiche',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    RouterLink,
    Tabs2Module,
    VarianteComponent,
    ConditionnementComponent,
    PrixFournisseurComponent
  ],
  templateUrl: './fiche.component.html',
  styleUrl: './fiche.component.scss'
})
export class FicheComponent {
  idProduit:string='';
  produit:any;
  variante:any[]=[];
  itemKey=0;
  tabs:string[]=[
    "Variante" , "Conditionnement","Prix d'achat"
  ]

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private produitService:ProduitService

  ){
    this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
  }
  ngOnInit(): void {
    this.getData();
    this.getDataVariante()

    var item=this.activatedRoute.snapshot.queryParams!["itemKey"]
    if(item){
      var index= this.tabs.findIndex(x=> x===item);
      this.itemKey=index || 0;
    }
  }

  getData(){
    this.loaderService.show();
    this.produitService.get(this.idProduit)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.produit=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }
  getDataVariante(){
    this.loaderService.show();
    this.produitService.getVariante(this.idProduit)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.variante=response
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
        text: `Vous êtes sur le point de supprimer le rôle "${this.produit.designation}". Cette action est irréversible !`,
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
          this.produitService.supprimer(this.produit.idProduit)
          .pipe(finalize(() => this.loaderService.hide()))
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Supprimé',
                text: `Le rôle "${this.produit.designation}" a été supprimé avec succès.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: true
              }).then(() =>{
                this.router.navigate(["stock/produit"])
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
  }
}
