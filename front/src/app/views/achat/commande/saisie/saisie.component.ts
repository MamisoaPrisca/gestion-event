import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonCloseDirective, ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IconDirective } from '@coreui/icons-angular';
import Swal from 'sweetalert2';
import { DateUtils } from '../../../../util/method/dateUtil';
import { FournisseurService } from '../../../../services/fournisseur.service';
import { AutocompletGeneriqueComponent } from '../../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { CommandeFournisseurService } from '../../../../services/commande-fournisseur.service';


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
    AutocompletGeneriqueComponent
  ],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.scss'
})
export class SaisieComponent {
  form: FormGroup;
  check:boolean=false;
  fournisseur:any[]=[];

    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private router: Router,
      private fournisseurService:FournisseurService,
      private commandeFournisseurService:CommandeFournisseurService
    ){
      var today = DateUtils.dateNow();
      var dateNow= DateUtils.formatDateYYYYMMJJ(today);
      var dateEcheance= DateUtils.formatDateYYYYMMJJ(DateUtils.addDays(today,7));
      console.log()
      this.form = this.formBuilder.group({
        idFournisseur: ['', Validators.required],
        dateSaisie: [dateNow],
        dateEcheance: [dateEcheance],
      });
      this.getFournisseur();
    }
  
    sauvegarder(){
      this.check=true;
      if(this.form.valid){
        this.loaderService.show();
        this.commandeFournisseurService.insert(this.form.getRawValue())
        .pipe(
          finalize(() => this.loaderService.hide()) // ✅ appelé toujours
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate([`/achat/commande/fiche/${response.idCommandeFournisseur}`])
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

    getFournisseur(){
    this.loaderService.show();    
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
}
