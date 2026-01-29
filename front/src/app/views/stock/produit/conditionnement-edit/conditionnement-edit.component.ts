import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { ConditionnementService } from 'src/app/services/conditionnement.service';
import { LoaderService } from 'src/app/util/service/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conditionnement-edit',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './conditionnement-edit.component.html',
  styleUrl: './conditionnement-edit.component.scss'
})
export class ConditionnementEditComponent {
  form: FormGroup;
  check:boolean= false;
  @Output() emitData = new EventEmitter<any>();

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private conditionnementService:ConditionnementService,
  ){
    this.form = this.formBuilder.group({
      designation: ['', Validators.required],
      abreviation: ['', Validators.required],
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
    if(this.form.valid){
      this.loaderService.show();
      this.conditionnementService.insert(this.form.getRawValue())
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
