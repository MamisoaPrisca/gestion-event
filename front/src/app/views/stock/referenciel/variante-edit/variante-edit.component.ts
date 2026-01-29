import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { VarianteService } from '../../../../services/variante.service';
import { LoaderService } from '../../../../util/service/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-variante-edit',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './variante-edit.component.html',
  styleUrl: './variante-edit.component.scss'
})
export class VarianteEditComponent implements OnChanges{
  form: FormGroup;
  check:boolean= false;
  @Input() variante:any;
  @Output() emitData = new EventEmitter<any>();

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService,
    private varianteService:VarianteService,
  ){
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variante']) {
      this.variante=changes['variante'].currentValue;
      if(this.variante){
        this.form.patchValue({
          nom:this.variante.nom!
        })
      }
      
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

  sauvegarder(){
    this.check=true;
    this.loaderService.show();
    if(this.form.valid){
      this.varianteService.update(this.form.getRawValue(),this.variante.idVariante)
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
