import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { LoaderService } from '../../../../util/service/loader.service';
import { CategorieService } from '../../../../services/categorie.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss'
})
export class CategorieComponent {
  form: FormGroup;
  check:boolean= false;
  @Output() emitData = new EventEmitter<any>();

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private categorieService:CategorieService,
  ){
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
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

  sauvegarder(){
    this.check=true;
    this.loaderService.show();
    if(this.form.valid){
      this.categorieService.insert(this.form.getRawValue())
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
