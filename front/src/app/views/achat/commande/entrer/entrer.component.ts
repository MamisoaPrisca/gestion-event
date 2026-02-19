import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormControlDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, RowComponent, TableDirective } from '@coreui/angular';
import { EntrepotService } from '../../../../services/entrepot.service';
import { LoaderService } from '../../../../util/service/loader.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommandeFournisseurService } from '../../../../services/commande-fournisseur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entrer',
  imports: [
    TableDirective,
    ButtonDirective,
    FormControlDirective,
    FormSelectDirective,
    FormsModule,
    ButtonDirective,
    RowComponent,  
    FormLabelDirective, 
    ColComponent, 
    ReactiveFormsModule,
  ],
  templateUrl: './entrer.component.html',
  styleUrl: './entrer.component.scss'
})
export class EntrerComponent implements OnChanges{
  @Input() visible :boolean=false;
  detailCommande:any[]=[];
  detailCommandeAfficher:any[]=[];
  valeur :any[]=[];
  entrepot:any[]=[];
  idEntrepot:string="";
  @Input() idcommandeFournisseur:string="";
  @Output() emitData = new EventEmitter<boolean>();

  constructor( private entrepotService:EntrepotService,
    private loaderService:LoaderService,
    private commandeFournisseurService:CommandeFournisseurService
  ){
    this.getEntrepotData();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] ) {
      if(changes['visible'].currentValue==true){
        this.getData();
      }
      
    }

  }

  getEntrepotData(){
    this.loaderService.show();
    this.entrepotService.getAll()
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.entrepot=response
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  
  getData(){
    this.loaderService.show();
    this.commandeFournisseurService.getDataEntrer(this.idcommandeFournisseur)
    .pipe(finalize(() => this.loaderService.hide()))
    .subscribe({
      next: (response: any) => {
        this.detailCommande=response
        this.detailCommandeAfficher = this.detailCommande.filter(item => item.reste > 0);
        this.valeur = this.detailCommandeAfficher.map(item => ({
          idSource: item.idDetailCommandeFournisseur,
          quantite: item.reste,
        }));
      },
      error: (error: HttpErrorResponse) => {
        var message= error.error|| 'Erreur lors de la connexion';
      }
    });
  }

  enregistrer(){
    var data={
      'idEntrepot':this.idEntrepot===""? undefined : this.idEntrepot,
      'entrerStock':this.valeur
    }
    this.loaderService.show();
      this.commandeFournisseurService.addEntrer(this.idcommandeFournisseur,data)
      .pipe(
        finalize(() => this.loaderService.hide()) // ✅ appelé toujours
      )
      .subscribe({
        next: () => {
          this.emitData.emit(true);
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
