import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../shared/rest-api-service";
import { Book } from '../shared/book';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  public recordsByPage: number = 10;
  public pagesCount: number = 0;
  public pageNumber: number = 1;
  public books: Array<Book> = [];
  public totalBooksCount: number = 0;

  constructor(private restApi: RestApiService) {}

  ngOnInit(): void {
    this.firstPage();
  }

  /**
   * Récupère la liste des livres de la page courante et affiche le résultat
   */
  private loadBooks() {
    return this.restApi.getBooks(this.pageNumber, this.recordsByPage).subscribe((data: any) => {
      this.books = data['hydra:member'];
      this.totalBooksCount = data['hydra:totalItems'];
      this.pagesCount = Math.floor(this.totalBooksCount / this.recordsByPage);
    });
  }

  /**
   * Retourne à la première page et rafraichi le résultat
   */
  public firstPage() {
    this.pageNumber = 1;
    this.loadBooks();
  }

  /**
   * Revient sur la page précédente et rafraichi le résultat
   */
  public prevPage() {
    this.pageNumber--;
    this.loadBooks();
  }

  /**
   * Passe à la page suivante et rafraichi le résultat
   */
   public nextPage() {
    this.pageNumber++;
    this.loadBooks();
  }

  /**
   * Retourne à la dernière page et rafraichi le résultat
   */
   public lastPage() {
    this.pageNumber = this.pagesCount;
    this.loadBooks();
  }

  /**
   * Change le nombre de livres affichés par page et rafraichi le résultat
   */
  public changeBooksPerPage(e: any) {
    this.recordsByPage = e.target.value;
    this.firstPage();
  }

}
