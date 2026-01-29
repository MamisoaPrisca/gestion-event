import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, RowComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { CategorieService } from '../../../../services/categorie.service';
import { LoaderService } from '../../../../util/service/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie-edit',
  imports: [
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    FormFeedbackComponent,
    FormControlDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './categorie-edit.component.html',
  styleUrl: './categorie-edit.component.scss'
})
export class CategorieEditComponent implements OnChanges{
  form: FormGroup;
  check:boolean= false;
  @Input() categorie:any;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categorie']) {
      this.categorie=changes['categorie'].currentValue;
      if(this.categorie){
        this.form.patchValue({
          nom:this.categorie.nom!
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
      this.categorieService.update(this.form.getRawValue(),this.categorie.idCategorie)
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
