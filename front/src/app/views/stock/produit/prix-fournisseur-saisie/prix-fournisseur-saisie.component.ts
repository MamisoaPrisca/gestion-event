import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { AutocompletGeneriqueComponent } from 'src/app/layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ProduitService } from 'src/app/services/produit.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import Swal from 'sweetalert2';
import { FournisseurService } from '../../../../services/fournisseur.service';

@Component({
  selector: 'app-prix-fournisseur-saisie',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule,
    AutocompletGeneriqueComponent,
    FormSelectDirective
  ],
  templateUrl: './prix-fournisseur-saisie.component.html',
  styleUrl: './prix-fournisseur-saisie.component.scss'
})
export class PrixFournisseurSaisieComponent implements OnChanges {
  form: FormGroup;
  check:boolean= false;
  @Output() emitData = new EventEmitter<any>();
  @Input() produit :any;
  fournisseur:any[]=[];
  idProduit:string='';
  conditionnement : any[]=[]
  @Input() visible:boolean=false;

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private produitService:ProduitService,
    private activatedRoute: ActivatedRoute,
    private fournisseurService:FournisseurService
  ){
    this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.form = this.formBuilder.group({
      montant: ['', Validators.required],
      idFournisseur: ['', Validators.required],
      idConditionnementProduit : ['', Validators.required]
    });
   
  }
  ngOnChanges(changes: SimpleChanges): void {
   if (changes['visible'] && changes['visible'].currentValue) {
      this.getData();
      this.getDataConditionnement();
   }
  }

  getDataConditionnement(){
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

  
  getData(){
    this.fournisseurService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.fournisseur=response
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
      this.produitService.addPrixFournisseur(this.idProduit,this.form.getRawValue())
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.emitData.emit(response);
          this.form.reset();
          this.check=false;
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
}
