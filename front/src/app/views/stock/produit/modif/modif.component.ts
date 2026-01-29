import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ModalBodyComponent, ModalComponent, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MarqueService } from '../../../../services/marque.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';
import { IconDirective } from '@coreui/icons-angular';
import Swal from 'sweetalert2';
import { CategorieComponent } from '../categorie/categorie.component';
import { MarqueComponent } from '../marque/marque.component';
import { ConditionnementEditComponent } from '../conditionnement-edit/conditionnement-edit.component';
import { AutocompletGeneriqueComponent } from '../../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ConditionnementService } from '../../../../services/conditionnement.service';

@Component({
  selector: 'app-modif',
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
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent {
  form: FormGroup;
    check:boolean=false;
    marque:any[]=[];
    categorie:any[]=[];
    idProduit:string="";
    produit:any ;
  
    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private router: Router,
      private marqueService: MarqueService,
      private categorieService:CategorieService,
      private produitService:ProduitService,
      private activatedRoute: ActivatedRoute,
      private conditionnementService:ConditionnementService
    ){
      
      this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.getMarque();
      this.getCategorie();
      this.form = this.formBuilder.group({
        designation: ['', Validators.required],
        idMarque: [''],
        idCategorie: [''],
        conditionnementDefaut: ['']
      });
    }

  ngOnInit(): void {
    this.getData();
    this.getDataConditionnement();
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
    this.loaderService.show();
    this.produitService.get(this.idProduit)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.produit=response
        this.form.patchValue(
          {
            designation: this.produit.designation,
            idMarque: this.produit.idMarque,
            idCategorie: this.produit.idCategorie,
            conditionnementDefaut: this.produit.conditionnementDefaut
          }
        )
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }
  
    sauvegarder(){
      this.check=true;
      if(this.form.valid){
        this.produitService.update(this.form.getRawValue(),this.idProduit)
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
      this.loaderService.hide()
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
      this.loaderService.hide()
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
  //--------------------------------Modal -------------------------------------
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
  conditionnementData:any[]=[];
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
    this.toggleLiveDemoMarque();
  }
  
}
