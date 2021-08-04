import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BooksListComponent } from './books-list/books-list.component';
import { OrderingComponent } from './ordering/ordering.component';
import { FilteringComponent } from './filtering/filtering.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { AuthentificationFormComponent } from './authentification-form/authentification-form.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './shared/auth.guard';
import { AuthorSelectorComponent } from './author-selector/author-selector.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'books', component: BooksListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthentificationFormComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    OrderingComponent,
    FilteringComponent,
    HomeComponent,
    AuthentificationFormComponent,
    AuthorSelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule, 
    NgbModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
