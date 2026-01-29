import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, TableDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { finalize } from 'rxjs';
import { ProduitService } from 'src/app/services/produit.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import { PrixFournisseurSaisieComponent } from '../prix-fournisseur-saisie/prix-fournisseur-saisie.component';
import { PrixFournisseurModifComponent } from '../prix-fournisseur-modif/prix-fournisseur-modif.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-prix-fournisseur',
  imports: [
    ButtonDirective,
    TableDirective,
    IconDirective,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
    FormsModule,
    PrixFournisseurSaisieComponent,
    PrixFournisseurModifComponent,
    DecimalPipe
  ],
  templateUrl: './prix-fournisseur.component.html',
  styleUrl: './prix-fournisseur.component.scss'
})
export class PrixFournisseurComponent {
  @Input() itemKey:number|undefined
  @Input() produit:any;
  idProduit:string='';
  prixAchat:any[]=[];
  itemSelected=2;

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private produitService:ProduitService

  ){
    this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey==this.itemSelected){
        this.getData();
      }
    }
  }

  getData(){
    this.produitService.getPrixAchat(this.idProduit!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.prixAchat=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }
  
  //--------------------------------Modal saisie -------------------------------------
  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }


  
  //--------------------------------Modal Modif -------------------------------------
  public visibleModif = false;
  prixAchatChoisie:any;

  setPrixAchat(prixAchat:any){
    this.toggleLiveDemoModif();
    if(this.visibleModif){
      this.prixAchatChoisie=prixAchat
    }
    else{
      this.prixAchatChoisie=undefined;
    }
  }

  toggleLiveDemoModif() {
    this.visibleModif = !this.visibleModif;
    
  }

  handleLiveDemoChangeModif(event: any) {
    this.visibleModif = event;
  }

}

