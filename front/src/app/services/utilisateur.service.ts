import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Utilisateur } from '../modele/utilisateur';
import { Page } from '../util/generique/page';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private url = Constants.BASE_URL + '/api/utilisateur'

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
    return this.http.get<Page<Utilisateur>>(url);
  }

  insert(data: any ){
    return this.http.post< any>(this.url,data);
  }

  get(id:string){
    return this.http.get<any>(`${this.url}/${id}`)
  }

  update(data: any,idUtilisateur:string ){
    return this.http.put< any>(`${this.url}/${idUtilisateur}`,data);
  }

  resetPassword(idUtilisateur:string){
    return this.http.get< any>(`${this.url}/reset/password/${idUtilisateur}`);
  }

  
  activerUtilisateur(idUtilisateur:string){
    return this.http.get< any>(`${this.url}/activer/${idUtilisateur}`);
  }

  supprimer(idUtilisateur:string){
    return this.http.delete< any>(`${this.url}/${idUtilisateur}`);
  }

}
