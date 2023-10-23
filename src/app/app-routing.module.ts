import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewTableComponent } from './components/review-table/review-table.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

const routes: Routes = [
  { path: 'register', component: RegisterFormComponent },
  { path: 'reviews', component: ReviewTableComponent },
  { path: 'newReview', component: ReviewFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
