import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book, Author } from './book';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

// Structure des objects récupérés à partir du webservice pour les auteurs
export class JsonLDAuthorsCollection {
  'hydra:member': Array<Author>  = [];
  'hydra:totalItems': number = 0;
}

// Structure des objects récupérés à partir du webservice pour les livres
export class JsonLDBooksCollection {
  'hydra:member': Array<Book>  = [];
  'hydra:totalItems': number = 0;
}

// Fixe l'adresse de l'api
const apiBaseUrl = environment['apiBaseUrl'];

// Options http
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  // Injection du client Http
  constructor(private http: HttpClient) { }

  /**
   * Liste les auteurs.
   */
   getAuthors(filters: any = {}): Observable<JsonLDAuthorsCollection>
   {
    let queryUrl = apiBaseUrl + '/authors.jsonld?page=1&recordsPerPage=10';
    for (const propertyName in filters) {
      queryUrl += '&' + propertyName + '[]=' + filters[propertyName];
    }
    console.log(queryUrl);
    return this.http.get<JsonLDAuthorsCollection>(queryUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  /**
   * Liste les livres en fonction du contexte de pagination, de filtre et d'ordre demandé.
   */
  getBooks(pageNumber: number = 1, recordsPerPage: number = 25, orders: any = {}, filters: any = {}): Observable<JsonLDBooksCollection>
  {
    let queryUrl = apiBaseUrl + '/media/books.jsonld?page=' + pageNumber + '&recordsPerPage=' + recordsPerPage;
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
      );
  }

  /**
   * Ajoute un nouveau livre
   */
  createBook(book: Book) {
    return this.http.post(apiBaseUrl + '/media/books', book)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Modifie un nouveau livre existant
   */
  updateBook(book: Book) {
    return this.http.put(apiBaseUrl + '/media/books/' + book.id, book)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Supprime un livre
   */
  deleteBook(bookId: number) {
    let queryUrl = apiBaseUrl + '/media/books/' + bookId.toString();
    return this.http.delete(queryUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Connexion via un login / mot de passe et récupération du token
   * @param email 
   * @param password 
   * @returns 
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(apiBaseUrl + '/login_check', {username: email, password: password}, httpOptions);
  }

  /**
   * Gestion des erreurs.
   */
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
