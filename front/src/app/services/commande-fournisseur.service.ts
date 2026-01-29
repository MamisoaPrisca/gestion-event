import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Page } from '../util/generique/page';

@Injectable({
  providedIn: 'root'
})
export class CommandeFournisseurService {
  private url = Constants.BASE_URL + '/api/commande-fournisseur'

  constructor(private router:Router, private http: HttpClient) {
    
  }

  insert(data: any ){
    return this.http.post< any>(this.url,data);
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

    
  get(id:string){
    return this.http.get<any>(`${this.url}/${id}`)
  }
    
  update(data: any,idCommandeFournisseur:string ){
    return this.http.put< any>(`${this.url}/${idCommandeFournisseur}`,data);
  }

  
  supprimer(idCommandeFournisseur:string){
    return this.http.delete< any>(`${this.url}/${idCommandeFournisseur}`);
  }

  valider(idCommandeFournisseur:string){
    return this.http.get< any>(`${this.url}/${idCommandeFournisseur}/valider`);
  }

  getAllProduit(idCommandeFournisseur:string){
    return this.http.get<any>(`${this.url}/${idCommandeFournisseur}/produit-data`)
  }

  addDetail(idCommandeFournisseur:string,data: any ){
    return this.http.post< any>(`${this.url}/${idCommandeFournisseur}/detail`,data);
  }
  
  getAllDetail(idCommandeFournisseur:string){
    return this.http.get<any>(`${this.url}/${idCommandeFournisseur}/detail`)
  }

  retirerDetail(idCommandeFournisseur:string,idDetailCommandeFournisseur:string){
    return this.http.delete< any>(`${this.url}/${idCommandeFournisseur}/detail/${idDetailCommandeFournisseur}`);
  }

  updateDetail(idCommandeFournisseur:string,idDetailCommandeFournisseur:string,data: any ){
    return this.http.put< any>(`${this.url}/${idCommandeFournisseur}/detail/${idDetailCommandeFournisseur}`,data);
  }

  

  addEntrer(idCommandeFournisseur:string,data: any ){
    return this.http.post< any>(`${this.url}/${idCommandeFournisseur}/entrer`,data);
  }

  getDataEntrer(id:string){
    return this.http.get<any>(`${this.url}/${id}/entrer/data`)
  }

}
