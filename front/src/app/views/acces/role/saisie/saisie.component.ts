import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, CardTitleDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { RoleService } from '../../../../services/role.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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
    FormFeedbackComponent
  ],
  templateUrl: './saisie.component.html',
  styleUrl: './saisie.component.scss'
})
export class SaisieComponent {
  form: FormGroup;
  check:boolean=false;

  constructor(
    private formBuilder:FormBuilder,
    private service:RoleService,
    private loaderService:LoaderService,
    private router: Router
  ){
    this.form = this.formBuilder.group({
      nom: ['', Validators.required]
    });
  }

  sauvegarder(){
    this.check=true;
    if(this.form.valid){
      this.service.insert(this.form.getRawValue())
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/acces/role/liste'])
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
