import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from './book';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


export class JsonLDBooksCollection {
  'hydra:member': Array<Book>  = [];
  'hydra:totalItems': number = 0;
}


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  // Url de l'api
  apiBaseUrl = 'http://localhost:8080/api';

  // On veut dialoguer avec l'api via des données formatées en Json
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Injection du client Http
  constructor(private http: HttpClient) { }

  // Méthode permettant de lister les livres à partir de l'api
  getBooks(pageNumber: number = 1, recordsPerPage: number = 25): Observable<JsonLDBooksCollection> {
    return this.http.get<JsonLDBooksCollection>(this.apiBaseUrl + '/books?page=' + pageNumber + '&recordsPerPage=' + recordsPerPage)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // Error handling 
  handleError(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

}
