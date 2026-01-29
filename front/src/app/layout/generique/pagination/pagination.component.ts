import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormSelectDirective, PageItemDirective, PageLinkDirective, PaginationComponent, } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'generique-pagination',
  standalone: true,
  imports: [
      PageItemDirective, 
      PageLinkDirective, 
      PaginationComponent,
      CommonModule,
      FormSelectDirective,
      FormsModule
    ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationGenregiqueComponent {
  @Input() totalPages: number =1;
  @Input() first: number=1;
  @Input() size: number=25;
  @Input() page = 1;
  @Input() totalRecords: number=1;
  @Input() sizeSelect:number[]=[5,10,25,50];
  @Output() emitData= new EventEmitter <{page:number, size:number}>();

  tailleMax=10;

  getPageArray(){
    var reste = this.page%this.tailleMax;
    var start = reste==0 ?this.page-this.tailleMax+1:  this.page-reste+1;
    var prochaine = start+this.tailleMax
    var end= prochaine>this.totalPages? this.totalPages+1 : start+this.tailleMax 
    return Array.from({ length: end - start}, (_, i) => i + start);
  }
  chercherPage(page:number){
    this.page=page;
    this.emittePage();
  }

  next(){
    if(this.page<this.totalPages!){
      this.page++;
      this.emittePage();
    }
  }
  nextGroupe(){
    var reste = this.page%this.tailleMax;
    var start= reste==0 ?this.page-this.tailleMax+1 :this.page-reste+1
    var prochaine = start+this.tailleMax
    this.page= (prochaine>this.totalPages) ? this.totalPages : prochaine;
    this.emittePage();
  }

  
  previousGroupe(){
    var reste = this.page%this.tailleMax;
    var start= reste==0 ?this.page-this.tailleMax+1 :this.page-reste+1
    var prochaine = start-this.tailleMax
    this.page= (prochaine==0) ? 1 : prochaine;
    this.emittePage();
  }

  previous(){
    if(this.page>0){
      this.page--;
      this.emittePage();
    }
  }
  emittePage(){
    var data={page:this.page,size:this.size};
    this.emitData.emit(data);
  }
  afficherGauche(){
    return this.page>this.tailleMax
  }
  afficherDroite(){
    var reste = this.page%this.tailleMax;
    var start= reste==0 ?this.page-this.tailleMax+1 :this.page-reste+1
    var prochaine = start+this.tailleMax
    return this.totalPages>this.tailleMax &&  prochaine<this.totalPages
  }
  afficherNumeroPage(i:number){
    return this.page+i;
  }

  changeSize($event:any){
    const value = ($event.target as HTMLSelectElement).value; // récupérer la valeur sélectionnée
    this.size=parseInt(value) ;
    this.page=1;
    this.emittePage();
  }
}
