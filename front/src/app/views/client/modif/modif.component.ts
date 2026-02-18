import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../util/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent {
    form: FormGroup;
    check:boolean=false;
    marque:any[]=[];
    categorie:any[]=[];
    idClient:string="";
    client:any ;
  
    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private router: Router,
      private clientService:ClientService,
      private activatedRoute: ActivatedRoute
    ){
      
      this.idClient = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.form = this.formBuilder.group({
        nom: ['', Validators.required],
        contact: [''],
        mail: [''],
        adresse: ['']
      });
    }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.clientService.get(this.idClient)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.client=response
        this.form.patchValue(
          {
            nom: this.client.nom,
            contact: this.client.contact,
            adresse: this.client.adresse,
            mail: this.client.mail,
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
        this.clientService.update(this.form.getRawValue(),this.idClient)
        .pipe(
          finalize(() => this.loaderService.hide()) // ✅ appelé toujours
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate(['/client/fiche/'+this.idClient])
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
