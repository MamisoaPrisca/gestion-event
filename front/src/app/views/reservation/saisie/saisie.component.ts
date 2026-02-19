import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ReservationService } from 'src/app/services/reservation.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import { ClientService } from 'src/app/services/client.service';
import { AutocompletGeneriqueComponent } from '../../../layout/generique/autocomplet-generique/autocomplet-generique.component';

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
  client:any[]=[];

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private router: Router,
    private reservationService:ReservationService,
    private clientService:ClientService
  ){
    this.form = this.formBuilder.group({
      idClient: ['', Validators.required],
      description: [''],
      dateDebut: [''],
      dateFin: ['']
    });
    this.getClient();
  }

  getClient(){
    this.loaderService.show();    
    this.clientService.getAll()
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.client=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  sauvegarder(){
    this.check=true;
    this.loaderService.show();
    if(this.form.valid){
      this.reservationService.insert(this.form.getRawValue())
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/client/reservation/liste'])
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
