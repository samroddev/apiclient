import { Component, OnInit } from '@angular/core';
import { RestApiService } from "../shared/rest-api-service";
import { TokenStorageService } from "../shared/token-storage.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification-form',
  templateUrl: './authentification-form.component.html',
  styleUrls: ['./authentification-form.component.scss']
})
export class AuthentificationFormComponent implements OnInit {

  // Déclaration du formulaire de connexion
  authentificationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private restApiService: RestApiService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Lance la procèdure d'authentification à l'aide des infos entrées par l'utilisateur
   */
  startAuthentification(): void {
    let email: string = this.authentificationForm.get('email')?.value;
    let password: string = this.authentificationForm.get('password')?.value;
    this.restApiService.login(email, password)
      .subscribe(
        data => {
          console.log('Connected! [token=' + data.token + ']');
          this.tokenStorageService.setUser(email, data.token);
          this.router.navigateByUrl('/');
        },
        err => {
          console.log('Authentification failed!');
        }
      );
  }

}
