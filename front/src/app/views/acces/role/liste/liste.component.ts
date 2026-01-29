import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { RoleService } from '../../../../services/role.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { Page } from '../../../../util/generique/page';
import { ListeGeneriqueComponent } from '../../../../layout/generique/liste/liste.component';
import { Column } from '../../../../util/generique/column';

@Component({
  selector: 'app-liste',
  imports: [
    ListeGeneriqueComponent,

  ],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeComponent {
  page :Page<any>|undefined;
  pageSelected:number=1;
  sizeSelected:number=5;
  search:string="";
  columns :Column[]=[
    {attribut:"idRole",label:"Ref",visible:true,link:"/acces/role/fiche"},
    {attribut:"nom",label:"Nom",visible:true},
  ]
  saisieButton={
    title:"Nouveau rôle",
    link:"/acces/role/saisie"
  }

  constructor(
    private loaderService:LoaderService,
    private roleService : RoleService
  ){

  }
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    var data={
      page:this.pageSelected,
      size:this.sizeSelected,
      search:this.search
    }
    this.roleService.find(data)
    .pipe(
      finalize(() => this.loaderService.hide()) // ✅ appelé toujours
    )
    .subscribe({
      next: (response: any) => {
        this.page=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  recherche(data:any){
    this.pageSelected=data.pageSelected;
    this.sizeSelected=data.sizeSelected;
    this.search=data.search;
    this.getData();
  }
}
