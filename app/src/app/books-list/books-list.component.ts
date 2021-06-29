import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../shared/rest-api-service";
import { Book } from '../shared/book';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  private recordsByPage: number = 10;
  public pageNumber: number = 1;
  public books: any = [];

  constructor(private restApi: RestApiService) {}

  ngOnInit(): void {
    this.startPage();
  }

  /**
   * Récupère la liste des livres de la page courante et affiche le résultat
   */
  private loadBooks() {
    return this.restApi.getBooks(this.pageNumber, this.recordsByPage).subscribe((data: {}) => {
      this.books = data;
    });
  }

  /**
   * Retourne à la première page et rafraichi le résultat
   */
  public startPage() {
    this.pageNumber = 1;
    this.loadBooks();
  }

  /**
   * Revient sur la page précédente et rafraichi le résultat
   */
  public prevPage() {
    this.pageNumber -= this.recordsByPage;
    this.loadBooks();
  }

  /**
   * Passe à la page suivante et rafraichi le résultat
   */
   public nextPage() {
    this.pageNumber += this.recordsByPage;
    this.loadBooks();
  }

  /**
   * Retourne à la dernière page et rafraichi le résultat
   */
   public endPage() {
    this.pageNumber = 1;
    this.loadBooks();
  }

}
