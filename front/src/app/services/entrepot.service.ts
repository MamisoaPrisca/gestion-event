import { Injectable } from '@angular/core';
import { Constants } from '../util/constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntrepotService {
  private url = Constants.BASE_URL + '/api/entrepot'

  constructor(private router:Router, private http: HttpClient) {
    
  }

  getAll(){
    return this.http.get<any>(`${this.url}/all`)
  }
}
