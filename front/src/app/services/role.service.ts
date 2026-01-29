import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Page } from '../util/generique/page';
import { Role } from '../modele/role';
import { Permission } from '../modele/permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = Constants.BASE_URL + '/api/role'

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
    return this.http.get<Page<Role>>(url);
  }

  insert(data: any ){
    return this.http.post< any>(this.url,data);
  }

  get(id:string){
    return this.http.get<any>(`${this.url}/${id}`)
  }

  update(data: any,idRole:string ){
    return this.http.put< any>(`${this.url}/${idRole}`,data);
  }

  supprimer(idRole:string){
    return this.http.delete< any>(`${this.url}/${idRole}`);
  }
  
  getPermission(id:string){
    return this.http.get<Permission[]>(`${this.url}/${id}/permission`)
  }

  getUtilisateur(id:string){
    return this.http.get<any>(`${this.url}/${id}/utilisateur`)
  }
  
  updatePermission(data: any,idRole:string ){
    return this.http.put< any>(`${this.url}/${idRole}/permission`,data);
  }

  getUtilisateurData(id:string){
    return this.http.get<any>(`${this.url}/${id}/utilisateur/data`)
  }

  affecterUtilisateur(id:string,idUtilisateur:string){
    return this.http.post<any>(`${this.url}/${id}/utilisateur?idUtilisateur=${idUtilisateur}`,{})
  }

  retirerUtilisateur(id:string,idUtilisateur:string){
    return this.http.delete<any>(`${this.url}/${id}/utilisateur?idUtilisateur=${idUtilisateur}`)
  }
}
