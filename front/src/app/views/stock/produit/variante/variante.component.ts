import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LoaderService } from '../../../../util/service/loader.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProduitService } from '../../../../services/produit.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonCloseDirective, ButtonDirective, ModalBodyComponent, ModalComponent, TableDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AutocompletGeneriqueComponent } from 'src/app/layout/generique/autocomplet-generique/autocomplet-generique.component';
import { VarianteEditComponent } from '../variante-edit/variante-edit.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-variante',
  imports: [
    ButtonDirective,
    TableDirective,
    IconDirective,
    AutocompletGeneriqueComponent,
    VarianteEditComponent,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
    FormsModule
  ],
  templateUrl: './variante.component.html',
  styleUrl: './variante.component.scss'
})
export class VarianteComponent implements OnChanges{
  @Input() itemKey:number|undefined
  idProduit:string='';
  variante:any[]=[];
  varianteData:any[]=[];
  varianteSelected:any

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
      if(this.itemKey==0){
        this.getDataVariante();
        this.getData();
      }
    }
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

  getData(){
    this.produitService.getVarianteData(this.idProduit!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.varianteData=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  retirer(idVariante:string){
    this.loaderService.show();
    this.produitService.retirerVariante(this.idProduit, idVariante).pipe(
      // on peut logger pour debug
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const index = this.variante.findIndex( x => x.idVariante === idVariante ); 
        if (index !== -1) { 
          this.varianteData.push(this.variante[index]);
          this.variante.splice(index, 1); 
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur affecterUtilisateur', error);
      }
    });
  }

  affecter() {
    const idVariante = this.varianteSelected?.idVariante!;
    if(idVariante){
      this.loaderService.show();

    this.produitService.affecterVariante(this.idProduit, idVariante).pipe(
      // on peut logger pour debug
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const index = this.varianteData.findIndex( x => x.idVariante === this.varianteSelected?.idVariante ); 
        if (index !== -1) { 
          var temp=Object.assign(this.varianteData[index], {idProduit:this.idProduit});
          Object.assign(temp, {variante:temp.nom});
          this.variante.push(temp);
          
          this.varianteData.splice(index, 1); 
        }

        this.varianteSelected = undefined;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur affecterUtilisateur', error);
      }
    });
    }
    
  }

  
  //--------------------------------Modal variante -------------------------------------
  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  addVariante(data:any){
    this.varianteData.push(data);
    this.varianteSelected=data;
    this.toggleLiveDemo();
  }
}
