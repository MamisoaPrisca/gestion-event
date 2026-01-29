import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FournisseurService } from '../../../../services/fournisseur.service';
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
    idFournisseur:string="";
    fournisseur:any ;
  
    constructor(
      private formBuilder:FormBuilder,
      private loaderService:LoaderService,
      private router: Router,
      private fournisseurService:FournisseurService,
      private activatedRoute: ActivatedRoute
    ){
      
      this.idFournisseur = this.activatedRoute.snapshot.paramMap.get('id')!;
      this.form = this.formBuilder.group({
        nom: ['', Validators.required],
        contact: [''],
        adresse: ['']
      });
    }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.loaderService.show();
    this.fournisseurService.get(this.idFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.fournisseur=response
        this.form.patchValue(
          {
            nom: this.fournisseur.nom,
            contact: this.fournisseur.contact,
            adresse: this.fournisseur.adresse,
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
        this.fournisseurService.update(this.form.getRawValue(),this.idFournisseur)
        .pipe(
          finalize(() => this.loaderService.hide()) // ✅ appelé toujours
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate(['/achat/fournisseur/fiche/'+this.idFournisseur])
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
