import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewTableComponent } from './components/review-table/review-table.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginGuard, UnsavedChangesGuard } from './guards/auth.service';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'home', canActivate: [LoginGuard], component: LandingPageComponent },
  { path: 'reviews', canActivate: [LoginGuard], component: ReviewTableComponent },
  { path: 'newReview', canActivate: [LoginGuard], canDeactivate: [UnsavedChangesGuard], component: ReviewFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
