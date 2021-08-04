/*
 * Créée un controle permettant de choisir un auteur existant en base de données ou d'en ajouter un
 * cf. https://blog.angular-university.io/angular-custom-form-controls/
 */

import { Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { RestApiService } from "../shared/rest-api-service";
import { Author } from '../shared/book';

@Component({
  selector: 'app-author-selector',
  templateUrl: './author-selector.component.html',
  styleUrls: ['./author-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AuthorSelectorComponent
    }
  ]
})
export class AuthorSelectorComponent implements OnInit, ControlValueAccessor  {

  // Auteur actuellement sélectionné
  author: Author|null = null;

  // Liste complete des auteurs
  authors: Author[]|null = null;

  // Flags permettant d'activer le controle
  disabled: boolean = false;
  loading: boolean = false;

  constructor(private restApi: RestApiService) { }

  ngOnInit(): void {
  }

  /**
   * Met à jour la liste d'auteurs
   */
  public onAuthorChange(event: any)
  {
    this.markAsTouched();
    this.authors = null;
    let authorName = event.target.value;
    if (authorName.length >= 2) {
      let filters = {
        name: event.target.value
      };
      this.disabled = true;
      let jsAuthors = this.restApi.getAuthors(filters).subscribe((data: any) => {
        this.authors = data['hydra:member'];
        this.disabled = false;
      });
    }
  }
 
  /**
  * Lorsque l'on clique sur un auteur proposé
  */
  public onAuthorSelected(author: Author)
  {
    this.author = author;
    this.onChange(this.author);
    this.authors = null;
  }

  /**
   * Utilisé par le formulaire parent pour définir l'auteur sélectionné
   */
  writeValue(author: Author|null) {
    this.author = author;
  }

  /**
   * Autorise le formulaire parent à se mettre à jour quand la valeur de ce controle change
   */
  onChange = (author: Author|null) => {console.log(author);};
  registerOnChange(onChange: any) {
     this.onChange = onChange;
  }

  /**
   * Autorise le formulaire parent à mettre à jour son etat touched / untouched
   */
  touched = false;
  onTouched = () => {};
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  /**
   * Permet au formulaire parent de désactiver ce controle
   */
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
