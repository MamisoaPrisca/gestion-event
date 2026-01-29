import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Page } from '../util/generique/page';

@Injectable({
  providedIn: 'root'
})
export class ConditionnementService {
  private url = Constants.BASE_URL + '/api/conditionnement'

  constructor(private router:Router, private http: HttpClient) {
    
  }

  getAll(){
    return this.http.get<any>(`${this.url}/all`)
  }

  
  insert(data: any ){
    return this.http.post< any>(this.url,data);
  }

  
  update(id:string,data: any ){
    return this.http.put< any>(`${this.url}/${id}`,data);
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
  
    supprimer(idCategorie:string){
      return this.http.delete< any>(`${this.url}/${idCategorie}`);
    }
}
