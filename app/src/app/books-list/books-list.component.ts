import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RestApiService } from "../shared/rest-api-service";
import { Book, Tag, Author } from '../shared/book';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TokenStorageService } from "./../shared/token-storage.service";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  // Définition du contexte d'affichage de la liste (page courante, nombre de livres total, etc...)
  public recordsByPage: number = 10;
  public pagesCount: number = 0;
  public pageNumber: number = 1;
  public books: Array<Book> = [];
  public totalBooksCount: number = 0;
  public filters: any = {};
  public orders: any = {title: 'asc'};

  // Déclaration du formulaire d'ajout / édition de livre et des règles de validation
  bookForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    author: new FormControl(null),
    resume: new FormControl(''),
    pagesCount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999999)]),
    isbn: new FormControl('',  [Validators.required, Validators.maxLength(13), Validators.pattern(/^[0-9]*$/)]),
    inSell: new FormControl(false),
    tags: new FormControl(''),
  });


  // Mode d'edition (ajout ou suppression)
  updateMode: string = 'add';

  // Flag permettant de savoir si l'utilisateur courant est administrateur (conditionne l'affichage de certains controles)
  isAdmin: boolean = false;

  constructor(private restApi: RestApiService, private modalService: NgbModal, private tokenStorageService: TokenStorageService) {}

  /**
   * Initialise la liste des livres en chargeant la première page
   */
  ngOnInit(): void {
    this.isAdmin = this.tokenStorageService.hasRole('ROLE_ADMIN');
    this.firstPage();
  }

  /**
   * Ouvre la modale permettant d'ajouter / éditer un fichier
   */
  openBookFormModal(bookFormModal: any, book: Book|null = null) {
    if (book !== null) {
      let tagLabels: Array<string> = [];
      book.tags.forEach((tag) => {
        tagLabels.push(tag.label);
      });
      this.bookForm.patchValue({
        id: book.id,
        title: book.title,
        resume: book.resume,
        author: book.author,
        isbn: book.isbn,
        pagesCount: book.pagesCount,
        tags: tagLabels.join(', '),
        inSell: book.inSell,
      });
      this.updateMode = 'update';
    } else {
      this.updateMode = 'add';
    }
    this.modalService.open(bookFormModal, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result: string) => {
      if (this.bookForm.valid) {
        let book = new Book();
        book.id = this.bookForm.get('id')?.value;
        book.title = this.bookForm.get('title')?.value;
        book.author = this.bookForm.get('author')?.value;
        book.resume = this.bookForm.get('resume')?.value;
        book.isbn = this.bookForm.get('isbn')?.value;
        book.inSell = this.bookForm.get('insell')?.value === undefined ? false : true;
        book.pagesCount = this.bookForm.get('pagesCount')?.value;
        book.tags = [];
        this.bookForm.get('tags')?.value.split(',').forEach(function(tagLabel: string) {
          let tag = new Tag();
          tag.label = tagLabel.trim();
          book.tags.push(tag);
        });
        if (book.id === null) {
          this.restApi.createBook(book).subscribe((data: any) => {
            this.loadBooks();
          });
        } else {
          this.restApi.updateBook(book).subscribe((data: any) => {
            this.loadBooks();
          });
        }
      }
    }, (dismiss: string) => {
      console.log('Adding / Updating book cancelled');
    });
  }

  /**
   * Récupère la liste des livres de la page courante et affiche le résultat
   */
  public loadBooks() {
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
