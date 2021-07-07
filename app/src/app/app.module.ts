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

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'books'},
  {path: 'books', component: BooksListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    OrderingComponent,
    FilteringComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
