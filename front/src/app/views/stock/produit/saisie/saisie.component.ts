import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { Router } from '@angular/router';
import { MarqueService } from '../../../../services/marque.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';
import { IconDirective } from '@coreui/icons-angular';
import Swal from 'sweetalert2';
import { CategorieComponent } from '../categorie/categorie.component';
import { MarqueComponent } from '../marque/marque.component';
import { ConditionnementService } from '../../../../services/conditionnement.service';
import { AutocompletGeneriqueComponent } from '../../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ConditionnementEditComponent } from '../conditionnement-edit/conditionnement-edit.component';


@Component({
  selector: 'app-saisie',
  imports: [
    CardComponent,  
    CardBodyComponent, 
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormControlDirective,
    ReactiveFormsModule,
    FormFeedbackComponent,
    FormSelectDirective,
    IconDirective,
    ModalBodyComponent,
    ModalComponent,
    ButtonCloseDirective,
    CategorieComponent,
    MarqueComponent,
    AutocompletGeneriqueComponent,
    ConditionnementEditComponent
  ],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.scss'
})
export class SaisieComponent {
  form: FormGroup;
  check:boolean=false;
  marque:any[]=[];
  categorie:any[]=[];
  conditionnementData:any[]=[];

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private router: Router,
    private marqueService: MarqueService,
    private categorieService:CategorieService,
    private produitService:ProduitService,
    private conditionnementService:ConditionnementService
  ){
    this.getMarque();
    this.getCategorie();
    this.getDataConditionnement()
    this.form = this.formBuilder.group({
      designation: ['', Validators.required],
      idMarque: [''],
      idCategorie: [''],
      conditionnementDefaut: ['']
    });
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

  sauvegarder(){
    this.check=true;
    if(this.form.valid){
      this.loaderService.show();
      this.produitService.insert(this.form.getRawValue())
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/stock/produit/liste'])
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error.message|| 'Erreur lors de la connexion';
          Swal.fire({
            title: 'Erreur',
            text: message,
            icon: 'error'
          });
        }
      });
    }
  }

  isValide(nom:string){
    var champs=this.form.get(nom)!;
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

  getMarque(){
    this.loaderService.show();    
    this.marqueService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.marque=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  
  getCategorie(){
    this.loaderService.show();
    this.categorieService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.categorie=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  //--------------------------------Modal Categorie -------------------------------------
  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  addCategorie(data:any){
    this.categorie.push(data);
    this.form.patchValue({
      idCategorie:data.idCategorie
    })
    this.toggleLiveDemo();
  }

  
  //--------------------------------Modal marque -------------------------------------
  public visibleMarque = false;

  toggleLiveDemoMarque() {
    this.visibleMarque = !this.visibleMarque;
  }

  handleLiveDemoChangeMarque(event: any) {
    this.visibleMarque = event;
  }

  addMarque(data:any){
    this.marque.push(data);
    this.form.patchValue({
      idMarque:data.idMarque
    })
    this.toggleLiveDemoMarque();
  }

  
  //--------------------------------Modal conditionnement -------------------------------------
  public visibleConditionnement = false;

  toggleLiveDemoConditionnement() {
    this.visibleConditionnement = !this.visibleConditionnement;
  }

  handleLiveDemoChangeConditionnement(event: any) {
    this.visibleConditionnement = event;
  }

  addConditionnement(data:any){
    this.conditionnementData.push(data);
    this.form.patchValue({
      conditionnementDefaut:data.idConditionnement
    })
    this.toggleLiveDemoConditionnement();
  }

}
