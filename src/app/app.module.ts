import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextareaAutoresizeDirective } from './directives/textarea-autoresize.directive';
import { NavComponent } from './components/nav/nav.component';
import { ReviewTableComponent } from './components/review-table/review-table.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/index';
import { ConfimationDialogComponent } from './components/confimation-dialog/confimation-dialog.component';
import { ConfirmationDialogService } from './services/confirmation-dialog.service';
import { DragDropDirective } from './directives/drag-drop.directive';
import { ContinueSessionDialogComponent } from './components/continue-session-dialog/continue-session-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ReviewTableComponent,
    ReviewFormComponent,
    TextareaAutoresizeDirective,
    RegisterFormComponent,
    LoginFormComponent,
    LandingPageComponent,
    ConfimationDialogComponent,
    DragDropDirective,
    ContinueSessionDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    StoreModule.forRoot(reducers)
  ],
  providers: [ConfirmationDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }