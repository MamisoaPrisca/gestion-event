import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RoleService } from '../../../../services/role.service';
import { finalize } from 'rxjs';
import { LoaderService } from '../../../../util/service/loader.service';
import { Permission } from '../../../../modele/permission';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, TableDirective } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-permission',
  imports: [
    TableDirective,
    FormCheckComponent, 
    FormCheckInputDirective, 
    ButtonDirective,
    ReactiveFormsModule, 
    FormsModule
  ],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent implements OnChanges{
  @Input() itemKey:number|undefined
  @Input() idRole:string|undefined;
  permissions:Permission[]=[];
  @Input() modifier:boolean=false;
  @Output() emitModifier = new EventEmitter<boolean>();
  constructor(
    private roleService:RoleService,
    private loaderService:LoaderService
  ){

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemKey']) {
      this.itemKey=parseInt(changes['itemKey'].currentValue);
      if(this.itemKey==0){
        this.getData();
      }
    }
  }

  getData(){
    this.roleService.getPermission(this.idRole!)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.permissions=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  sauvegarder(){
    const toutesLesPermissions = this.permissions.flatMap(item => item.permissions);
    this.loaderService.show()
    this.roleService.updatePermission(toutesLesPermissions,this.idRole!)
    .pipe(
      finalize(
        () => {
          this.loaderService.hide();
          this.emitModifier.emit(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      ) 
      
    )
    .subscribe({
      next: (response: any) => {
        this.permissions=response

      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }
}
