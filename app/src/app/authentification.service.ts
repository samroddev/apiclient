import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { UserAccount } from './user-account';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  //private currentUser = Observable<UserAccount>;

  // Injection du client Http
  constructor(private http: HttpClient) { }


  login(email: string, password: string) {

  }

  logout() {

  }

}
