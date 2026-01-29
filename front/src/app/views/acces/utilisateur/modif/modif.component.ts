import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { LoaderService } from '../../../../util/service/loader.service';

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
    FormFeedbackComponent
  ],
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.scss'
})
export class ModifComponent {
  form: FormGroup;
  check:boolean=false;
  idUtilisateur :string="";
  utilisateur:any;

  constructor(
    private formBuilder:FormBuilder,
    private utilisateurService:UtilisateurService,
    private loaderService:LoaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){
    this.idUtilisateur = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: [''],
      contact: ['' ]
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.utilisateurService.get(this.idUtilisateur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.utilisateur=response;
        this.form.patchValue(
          {
            'nom':response.nom,
            'prenom':response.prenom,
            'contact':response.contact,
          }
        )
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    }); // ✅ appelé toujours)
  }

  sauvegarder(){
    this.check=true;
    if(this.form.valid){
      this.utilisateurService.update(this.form.getRawValue(),this.idUtilisateur)
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/acces/utilisateur/fiche/'+this.idUtilisateur])
        },
        error: (error: HttpErrorResponse) => {
          var message= error.error|| 'Erreur lors de la connexion';
        }
      });
    }
  }

  get contact() {
    return this.form.get('contact')!;
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
