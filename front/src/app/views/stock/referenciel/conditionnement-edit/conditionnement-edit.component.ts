import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { ConditionnementService } from '../../../../services/conditionnement.service';
import { LoaderService } from '../../../../util/service/loader.service';
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
export class ConditionnementEditComponent implements OnChanges{
  form: FormGroup;
  check:boolean= false;
  @Input() conditionnement:any;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conditionnement']) {
      this.conditionnement=changes['conditionnement'].currentValue;
      if(this.conditionnement){
        this.form.patchValue({
          designation:this.conditionnement.designation!
        })
      }
      
    }
  }

  isValide(designation:string){
    var champs=this.form.get(designation)!;
    return (champs.valid && (champs.dirty || champs.touched))!
  }

  getClass(designation:string){
    if(this.check){
      if(this.isValide(designation)){
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
      this.conditionnementService.update(this.form.getRawValue(),this.conditionnement.idConditionnement)
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
