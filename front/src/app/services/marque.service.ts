import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Page } from '../util/generique/page';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {
  private url = Constants.BASE_URL + '/api/marque'

  constructor(private router:Router, private http: HttpClient) {
    
  }

  getAll(){
    return this.http.get<any>(`${this.url}/all`)
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

    
  update(data: any,idCategorie:string ){
    return this.http.put< any>(`${this.url}/${idCategorie}`,data);
  }

  
  supprimer(idCategorie:string){
    return this.http.delete< any>(`${this.url}/${idCategorie}`);
  }
}
