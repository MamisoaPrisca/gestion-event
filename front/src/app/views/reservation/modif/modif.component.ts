import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../util/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AutocompletGeneriqueComponent } from '../../../layout/generique/autocomplet-generique/autocomplet-generique.component';
import { ClientService } from 'src/app/services/client.service';

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
    AutocompletGeneriqueComponent
  ],
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent {
    form: FormGroup;
    check:boolean=false;
    marque:any[]=[];
    categorie:any[]=[];
    idReservation:string="";
    reservation:any ;
    client:any[]=[];
  
    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private router: Router,
      private reservationService:ReservationService,
      private activatedRoute: ActivatedRoute,
      private clientService:ClientService
    ){
      
      this.idReservation = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.form = this.formBuilder.group({
        idClient: ['', Validators.required],
        description: [''],
        dateDebut: [''],
        dateFin: ['']
      });
    }

  ngOnInit(): void {
    this.getData();
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

  getData(){
    this.loaderService.show();
    this.reservationService.get(this.idReservation)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.reservation=response
        this.form.patchValue(
          {
            idClient: this.reservation.idClient,
            description: this.reservation.description,
            dateDebut: this.reservation.dateDebut,
            dateFin: this.reservation.dateFin
          }
        )
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); 
  }
  
    sauvegarder(){
      if(this.form.valid){
        this.reservationService.update(this.form.getRawValue(),this.idReservation)
        .pipe(
          finalize(() => this.loaderService.hide()) // ✅ appelé toujours
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate(['/client/reservation/fiche/'+this.idReservation])
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
      else{
        this.check=true;
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
