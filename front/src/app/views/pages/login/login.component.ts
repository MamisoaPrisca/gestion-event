import { Component } from '@angular/core';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  AlertComponent,
  FormFeedbackComponent
} from '@coreui/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule ,ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../util/service/loader.service';
import { LoaderComponent } from 'src/app/layout/loader/loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, 
    CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, 
    InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, 
    NgStyle, ɵInternalFormsSharedModule , ReactiveFormsModule,
    AlertComponent,
    CommonModule,
    FormFeedbackComponent,
    LoaderComponent
  ]
})
export class LoginComponent {
  errorMessage: string = '';
  errorObject:any;
  form : FormGroup;
  submitted=false;
  constructor(private authService:AuthService,
    private formBuilder: FormBuilder,
    private router:Router,
    private loaderService:LoaderService
  ){
  
   this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  connexion(){
    this.submitted=true;
    this.errorMessage=""
    if(!this.form.valid){
      return ;
    }
    this.loaderService.show();
    this.authService.loggedIn(this.form.getRawValue())
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
    next: (response: any) => {
      localStorage.setItem("token",response.token)
      localStorage.setItem("username",response.username)
      this.router.navigate(['/'])
    },
    error: (error: HttpErrorResponse) => {
      
      var message= error.error|| 'Erreur lors de la connexion';
      if (message !== null && typeof message === 'object') {
        this.errorObject=message;
      } else {
        this.errorMessage = message;
      }
      setTimeout(() => {
        // this.isLoading = false;
      }, 5000);
    }
  });
  }
}
