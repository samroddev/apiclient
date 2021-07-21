import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TokenStorageService } from "./shared/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Contient l'utilisateur courant (si il est connecté)
  currentUserEmail: string|null = null;

  // Contient la route courante (permet d'"activer" un lien)
  currentRoute: string = '';

  /**
   * Injection de dépendances
   * @param router 
   * @param tokenStorageService 
   */
  constructor(private router: Router, private tokenStorageService: TokenStorageService) {
    // Après avoir changé de route ("changement de page"), on récupère la nouvelle valeur de l'url et de l'utilisateur connecté
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.currentUserEmail = this.tokenStorageService.getUserEmail();
    });
  }

  /**
   * Purge les infos de session ce qui a pour effet de se déconnecter
   */
  logout(): void {
    this.tokenStorageService.clear();
    this.router.navigateByUrl('/');
  }

}
