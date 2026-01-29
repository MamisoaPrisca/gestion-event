import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../util/constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = Constants.BASE_URL + '/api/auth'

  constructor(private router:Router, private http: HttpClient) { }

  isLoggedIn(): boolean {
    // Ici, tu peux vérifier un token JWT ou une variable dans localStorage
    return !!localStorage.getItem('token'); // exemple simple
  }

  loggedIn(infos :any){
    return this.http.post<any>(this.url+'/login', infos);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
