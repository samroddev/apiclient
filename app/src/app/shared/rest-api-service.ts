import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from './book';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

// Structure des objects récupérés à partir du webservice
export class JsonLDBooksCollection {
  'hydra:member': Array<Book>  = [];
  'hydra:totalItems': number = 0;
}

// Fixe l'adresse de l'api
const apiBaseUrl = environment['apiBaseUrl'];

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  // Injection du client Http
  constructor(private http: HttpClient) { }

  // Méthode permettant de lister les livres à partir de l'api
  getBooks(pageNumber: number = 1, recordsPerPage: number = 25, orders: any = {}, filters: any = {}): Observable<JsonLDBooksCollection> {
    let queryUrl = apiBaseUrl + '/books.jsonld?page=' + pageNumber + '&recordsPerPage=' + recordsPerPage;
    for (const propertyName in orders) {
      queryUrl += '&order[' + propertyName + ']=' + orders[propertyName];
    }
    for (const propertyName in filters) {
      queryUrl += '&' + propertyName + '[]=' + filters[propertyName];
    }
    console.log(queryUrl);
    return this.http.get<JsonLDBooksCollection>(queryUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // Supprime un livre
  deleteBook(bookId: number) {
    let queryUrl = apiBaseUrl + '/books/' + bookId.toString();
    return this.http.delete(queryUrl)
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
