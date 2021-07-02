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
  public filters: any = {};
  public orders: any = {title: 'asc'};

  constructor(private restApi: RestApiService) {}

  ngOnInit(): void {
    this.firstPage();
  }

  /**
   * Récupère la liste des livres de la page courante et affiche le résultat
   */
  private loadBooks() {
    return this.restApi.getBooks(this.pageNumber, this.recordsByPage, this.orders, this.filters).subscribe((data: any) => {
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

  /**
   * Reconstruit l'objet local définissant l'ordre actuel, et rafraichi les données
   */
  public onOrderChanged(e: any) {
    // Ré-ecrit un nouvel objet pour mettre la selection du dernier ordre en premier
    let orders: any = {};
    orders[e.fieldName] = e.direction;
    for (let name in this.orders) {
      if (name !== e.fieldName) {
        orders[name] = this.orders[name];
      }
    }
    this.orders = orders;
    // Recharge la collection de livres à afficher à partir des filtres et de l'ordre définis
    this.loadBooks();
  }

  /**
   * Reconstruit l'objet local définissant les filtres, et rafraichi les données
   */
  public onFilterChanged(e: any) {
    // Si la valeur de recherche est vide et que le filtre existe on le supprime, sinon on l'affecte
    if (e.searchValue.length === 0 && e.fieldName in this.filters) {
      delete this.filters[e.fieldName];
    } else {
      this.filters[e.fieldName] = e.searchValue;
    }
    // Recharge la collection de livres à afficher à partir des filtres et de l'ordre définis
    this.loadBooks();
  }

  /**
   * Supprime un livre
   */
  public onBookDelete(bookId: any, bookTitle: string| null) {
    bookId = bookId !== null ? bookId : 0;
    if (confirm('Souhaitez-vous vraiment supprimer le livre "' + bookTitle + '" ?')) {
      return this.restApi.deleteBook(bookId).subscribe((data: any) => {
        this.loadBooks();
      });
    }
    return true;
  }

}
