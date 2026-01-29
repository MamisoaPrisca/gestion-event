import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges  } from '@angular/core';
import { BadgeComponent, CardBodyComponent, CardComponent, CardHeaderComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective, TableDirective, BgColorDirective, ButtonDirective, CollapseDirective, FormSelectDirective } from '@coreui/angular';
import { Page } from '../../../util/generique/page';
import { DateUtils } from '../../../util/method/dateUtil';
import { Column, SelectColumn } from '../../../util/generique/column';
import { Button } from '../../../util/generique/button';
import { PaginationGenregiqueComponent } from '../pagination/pagination.component';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoaderService } from '../../../util/service/loader.service';

@Component({
  selector: 'generique-liste',
  imports: [
    TableDirective,
    CardComponent,
    CardBodyComponent,
    CommonModule,
    PaginationGenregiqueComponent,
    IconDirective,
    FormControlDirective,
    FormsModule,
    BadgeComponent,
    RouterLink,
    FormCheckComponent,
    FormCheckInputDirective,
    ButtonDirective,
    CollapseDirective,
    FormSelectDirective, 
    ReactiveFormsModule,
],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss'
})
export class ListeGeneriqueComponent implements OnChanges{
  @Input() page :Page<any>|undefined;
  @Input() pageSelected:number=1;
  @Input() sizeSelected:number=5;
  @Input() search:string="";
  @Input() title="Liste";
  @Output() emitData = new EventEmitter<{ pageSelected: number; sizeSelected: number; search: string }>();
  @Input() columns:Column[]=[];
  @Input() saisieButton:Button|undefined;
  @Input() filtre:SelectColumn[]=[]
  @Output() emitFiltre = new EventEmitter<any[]>
  @Input() boutons?:Button[]=[];

  readonly visible = signal(false);
  form: FormGroup;
  filtred:boolean=false;
  filtreAfficher:{attribut:string,value:string}[]=[];

  constructor(
    private formBuilder:FormBuilder,
    private loaderService:LoaderService
  ){
    this.form = this.formBuilder.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtre']) {
      for(let item of this.filtre){
          this.form.addControl(item.attribut, this.formBuilder.control(''));
      }
    }
  }

  toggleCollapse(): void {
    this.visible.update((value) => !value);
  }
  
  getData(): void {
    var data={
      pageSelected: this.pageSelected,
      sizeSelected: this.sizeSelected,
      search: this.search
    }
    this.emitData.emit(data);
  }

  getPage(){
    return this.page?.pageable!.pageNumber! +1 ;
  }

  chercherPage(data: {page:number,size:number}) {
    this.pageSelected = data.page;
    this.sizeSelected= data.size;
    this.getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  recherche(event : any){
    this.search=event;
    this.pageSelected=1;
    this.getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  resetSearch(){
    this.recherche("");
  }
  isNumerique(value: any): boolean {
    return typeof(value)==="number"
  }

  isDate(value: any): boolean {
    return DateUtils.isDate(value);
  }

  
  
  afficher(col:any):string{
    if(this.isNumerique(col)){
      return col.toLocaleString('fr-FR'); 
    }
    else if(this.isDate(col)){
      const date = new Date(col);
      return DateUtils.formatDate(date);
    }
    else {
      return col
    }
  }

  
  getClass(col:any){
    if(this.isNumerique(col)){
      return "text-end"; 
    }
    else {
      return "text-start"
    }
  }

  filtrer(){
    var filtred= this.form.getRawValue();
    var data:any[]=[]
    this.filtreAfficher=[];
     for(let item of this.filtre){
        var value= filtred[item.attribut]
        if(value!==""){
          if (typeof value === 'string') {
            data.push({[item.attribut]:value})
            this.filtreAfficher.push({attribut:item.attribut,value:value});
          }
          else if (typeof value === 'object' && value !== null) {
            data.push({[item.attribut]:value[item.value!]});
            this.filtreAfficher.push({attribut:item.attribut,value:value[item.labelAfficher!]});
          }
        }
    }
    this.emitFiltre.emit(data);
    this.visible.update((value) => false);
    this.filtred=true;
  }

  supprimerFiltrer(attribut:string , index:number){
    this.filtreAfficher.splice(index,1);
    this.form.patchValue({ [attribut]: '' });
    this.filtrer();
  }


}
