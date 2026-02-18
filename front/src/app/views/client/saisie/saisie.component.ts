import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.scss'
})
export class SaisieComponent {
  
  form: FormGroup;
  check:boolean=false;

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private router: Router,
    private clientService:ClientService
  ){
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      contact: [''],
      mail: [''],
      adresse: ['']
    });
  }

  sauvegarder(){
    this.check=true;
    this.loaderService.show();
    if(this.form.valid){
      this.clientService.insert(this.form.getRawValue())
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/client/liste'])
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
}
