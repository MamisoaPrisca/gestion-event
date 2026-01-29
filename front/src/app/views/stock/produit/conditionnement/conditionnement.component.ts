import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonCloseDirective, ButtonDirective, FormControlDirective, ModalBodyComponent, ModalComponent, TableDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { finalize } from 'rxjs';
import { AutocompletGeneriqueComponent } from '../../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ConditionnementService } from '../../../../services/conditionnement.service';
import { ProduitService } from '../../../../services/produit.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { ConditionnementEditComponent } from '../conditionnement-edit/conditionnement-edit.component';

@Component({
  selector: 'app-conditionnement',
  imports: [
    ButtonDirective,
    TableDirective,
    IconDirective,
    FormControlDirective,
    AutocompletGeneriqueComponent,
    ReactiveFormsModule,
    ConditionnementEditComponent,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
  ],
  templateUrl: './conditionnement.component.html',
  styleUrl: './conditionnement.component.scss'
})
export class 
ConditionnementComponent implements OnChanges{
  @Input() itemKey:number|undefined
  idProduit:string='';
  conditionnement:any[]=[];
  conditionnementData:any[]=[];
  saisie:boolean=false
  modif:boolean=false
  formSaisie: FormGroup;

  constructor(
    private loaderService:LoaderService,
    private activatedRoute: ActivatedRoute,
    private produitService:ProduitService,
    private formBuilder:FormBuilder,
    private conditionnementService:ConditionnementService
  ){
    this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.formSaisie = this.formBuilder.group({
      idConditionnement: ['', Validators.required],
      quantite: ['', Validators.required],
      poids: [''],
      remarque: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey==1){
        this.getData();
        this.getDataConditionnement();
      }
    }
  }

  getDataConditionnement(){
    this.loaderService.show();
    this.conditionnementService.getAll()
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.conditionnementData=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }

  getData(){
    this.loaderService.show()
    this.produitService.getConditionnement(this.idProduit!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.conditionnement=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }


  //---------------------------- Ajouter conditionnement -----------------------------------
  
  check:boolean=false;

  activerSaisie(){
    this.annulerModification();
    this.saisie=true;
  }
  annulerSaisie(){
    this.saisie=false;
    this.check=false;
    this.formSaisie.reset();
  }
  
  enregistrer(){
    this.check=true;
    if(this.formSaisie.valid){
      var data= this.formSaisie.getRawValue();
      this.loaderService.show();
      this.produitService.addConditionnement(this.idProduit!,data)
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.conditionnement.push(response);
          this.formSaisie.reset();
          this.annulerSaisie();
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error|| 'Erreur lors de la connexion';
        }
      });
    }
    
  }
  
  isValide(nom:string){
    var champs=this.formSaisie.get(nom)!;
    return (champs.valid && (champs.dirty || champs.touched))!
  }

  getClass(nom:string){
    if(this.check){
      if(this.isValide(nom)){
      return "is-valid";
      }
      else{
        return "is-invalid";
      }
    }
    else{
      return "";
    }
  }

  
  retirer(idConditionnementProduit:string){
    this.loaderService.show();
    this.produitService.retirerConditionnement(this.idProduit, idConditionnementProduit).pipe(
      // on peut logger pour debug
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe({
      next: (response: any) => {
        const index = this.conditionnement.findIndex( x => x.idConditionnementProduit === idConditionnementProduit ); 
        if (index !== -1) { 
          this.conditionnement.splice(index, 1); 
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur affecterUtilisateur', error);
      }
    });
  }

  //---------------------------- Modifier ---------------------------------------
  modifierConditionnement:string='';

  modifier(conditionnement:any){
    this.modifierConditionnement=conditionnement.idConditionnementProduit;
    this.annulerSaisie()
    this.formSaisie.patchValue({
      idConditionnement: conditionnement.idConditionnement,
      quantite: conditionnement.quantite,
      poids: conditionnement.poids,
      remarque: conditionnement.remarque
    })
  }

  annulerModification(){
    this.modifierConditionnement='';
    this.annulerSaisie();
  }

  enregistrerModification(){
    this.check=true;
    if(this.formSaisie.valid){
      var data= this.formSaisie.getRawValue();
      this.loaderService.show();
      this.produitService.updateConditionnement(this.idProduit!,this.modifierConditionnement,data)
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          const index = this.conditionnement.findIndex(
            x => x.idConditionnementProduit === response.idConditionnementProduit
          );
          this.conditionnement[index]=response;
          this.formSaisie.reset();
          this.annulerModification();
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error|| 'Erreur lors de la connexion';
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
    this.conditionnementData.push(data);
    this.formSaisie.patchValue({
      idConditionnement:data.idConditionnement
    });
    this.toggleLiveDemo();
  }
}
