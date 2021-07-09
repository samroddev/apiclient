import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-authentification-form',
  templateUrl: './authentification-form.component.html',
  styleUrls: ['./authentification-form.component.scss']
})
export class AuthentificationFormComponent implements OnInit {

  // Déclaration du formulaire de connexion
  authentificationForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private restApi: AuthentificationService) { }

  ngOnInit(): void {
  }

}
