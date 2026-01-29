import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { AutocompletGeneriqueComponent } from 'src/app/layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ProduitService } from 'src/app/services/produit.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prix-fournisseur-modif',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule
  ],
  templateUrl: './prix-fournisseur-modif.component.html',
  styleUrl: './prix-fournisseur-modif.component.scss'
})
export class PrixFournisseurModifComponent implements OnChanges{
    form: FormGroup;
    check:boolean= false;
    @Output() emitData = new EventEmitter<any>();
    @Input() produit :any;
    @Input() prixAchat:any;
    idProduit:string='';
    idPrixAchat:string='';
  
    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private produitService:ProduitService,
      private activatedRoute: ActivatedRoute
    ){
      this.idProduit = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.form = this.formBuilder.group({
        montant: ['', Validators.required],
        tva:['', Validators.required],
      });
    }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prixAchat']) {
      if(changes['prixAchat'].isFirstChange() || changes['prixAchat'].previousValue!==changes['prixAchat'].currentValue){
        this.form.patchValue({
          montant:this.prixAchat?.montant,
          tva:this.prixAchat?.tva
        })
      }
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
  
    sauvegarder(){
      this.check=true;
      if(this.form.valid){
        console.log(this.form.getRawValue());
        this.loaderService.show();
        this.produitService.updatePrixFournisseur(this.idProduit,this.prixAchat.idPrixAchat,this.form.getRawValue())
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
