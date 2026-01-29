import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Tabs2Module } from '@coreui/angular';
import {MarqueComponent} from './marque/marque.component'
import {CategorieComponent} from './categorie/categorie.component'
import {VarianteComponent} from './Variante/variante.component'
import {ConditionnementComponent} from './conditionnement/conditionnement.component'

@Component({
  selector: 'app-referenciel',
  imports: [
    Tabs2Module,
    RouterLink,
    MarqueComponent,
    CategorieComponent,
    VarianteComponent,
    ConditionnementComponent
  ],
  templateUrl: './referenciel.component.html',
  styleUrl: './referenciel.component.scss'
})
export class ReferencielComponent implements OnInit {
  itemKey = 3;
  tabs:string[]=[
    "Marque" , "Catégorie","Variante","Conditionnement"
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
  ){
    
  }
  ngOnInit(): void {
    var item=this.activatedRoute.snapshot.queryParams!["itemKey"]
    if(item){
      var index= this.tabs.findIndex(x=> x===item);
      this.itemKey=index || 0;
    }
  }
  // ----------------------- Onglet  ------------------------
  onTabChange(event: any) {
    this.itemKey = event;
  }
}
