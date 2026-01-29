import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Page } from '../util/generique/page';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private url = Constants.BASE_URL + '/api/produit'

  constructor(private router:Router, private http: HttpClient) {
    
  }

  find(data:any){
      var parametre="";
      Object.entries(data).forEach(([key, value]) => {
        if(value!=null && value!==""){
          if(parametre===""){
            parametre=`?${parametre}`
          }
          else{
            parametre=parametre+"&";
          }
          parametre=`${parametre}${key}=${value}`;
        }
      });
      const url = `${this.url}${parametre}`;
      return this.http.get<Page<any>>(url);
  }
  
  insert(data: any ){
    return this.http.post< any>(this.url,data);
  }

  get(id:string){
    return this.http.get<any>(`${this.url}/${id}`)
  }

  update(data: any,idProduit:string ){
    return this.http.put< any>(`${this.url}/${idProduit}`,data);
  }

  
  supprimer(idProduit:string){
    return this.http.delete< any>(`${this.url}/${idProduit}`);
  }

  getVariante(idProduit:string){
    return this.http.get<any>(`${this.url}/${idProduit}/variante`)
  }

  getVarianteData(idProduit:string){
    return this.http.get<any>(`${this.url}/${idProduit}/variante/data`)
  }

  affecterVariante(id:string,idVariante:string){
    return this.http.post<any>(`${this.url}/${id}/variante?idVariante=${idVariante}`,{})
  }
  retirerVariante(id:string,idVariante:string){
    return this.http.delete<any>(`${this.url}/${id}/variante?idVariante=${idVariante}`)
  }
  getConditionnement(idProduit:string){
    return this.http.get<any>(`${this.url}/${idProduit}/conditionnement`)
  }

  addConditionnement(idProduit:string,conditionnement:any){
    return this.http.post<any>(`${this.url}/${idProduit}/conditionnement`,conditionnement)
  }

  retirerConditionnement(id:string,idConditionementProduit:string){
    return this.http.delete<any>(`${this.url}/${id}/conditionnement?idConditionnementProduit=${idConditionementProduit}`)
  }
  
  updateConditionnement(idProduit:string,idConditionementProduit:string,conditionnement:any){
    return this.http.put<any>(`${this.url}/${idProduit}/conditionnement/${idConditionementProduit}`,conditionnement)
  }
  
  
  getPrixAchat(idProduit:string){
    return this.http.get<any>(`${this.url}/${idProduit}/prix-achat`)
  }

  getFournisseurData(idProduit:string){
    return this.http.get<any>(`${this.url}/${idProduit}/prix-achat/data`)
  }

  addPrixFournisseur(idProduit:string,prixAchat:any){
    return this.http.post<any>(`${this.url}/${idProduit}/prix-achat`,prixAchat)
  }

  updatePrixFournisseur(idProduit:string, idPrixAchat:string ,prixAchat:any){
    return this.http.put<any>(`${this.url}/${idProduit}/prix-achat/${idPrixAchat}`,prixAchat)
  }

}
