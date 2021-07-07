import { Component } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Contient l'utilisateur courant (si il est connecté)
  currentUser = null;

  // Contient la route courante (permet d'"activer" un lien)
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentRoute = event.url;
      console.log(this.currentRoute);
    });
  }
}
