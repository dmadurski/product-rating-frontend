import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { Review } from 'src/app/model/review';
import { ReviewService } from 'src/app/services/review.service';
import { AppState } from 'src/app/store/app-state';
import * as selectors from 'src/app/store/store.selectors';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {

  form!: FormGroup;
  isEditable: boolean = true;
  characterCount: number = 0;
  formSubmitted: boolean = false;
  shouldShowError: boolean = false;
  errorMessage?: string;
  products = [
    'iConnectX',
    'EmployMe',
    'WeInvite',
    'CompanyTRAK',
  ];
  userFirstName?: string;
  userLastName?: string;

  constructor(private router: Router, private reviewService: ReviewService, private fb: FormBuilder, private store: Store<AppState>) {
    this.initializeForm();
  }

  async initializeForm() {
    await this.loadStoreData();
    this.isEditable = false;

    this.form = this.fb.group({ 
      product: new FormControl('', Validators.required),
      score: new FormControl(0, [Validators.required, Validators.pattern(/^[1-5]*$/)]),
      comment: new FormControl('', Validators.pattern(/^.{1,500}$/)),
      firstName: new FormControl(this.userFirstName, [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      lastName: new FormControl(this.userLastName, [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      zipcode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}|\d{9})$/)]),
    });
  }

  //Fetch stored data, and use it to populate name fields
  async loadStoreData() {
    try {
      this.userFirstName = await firstValueFrom(this.store.select(selectors.selectFirstName).pipe(take(1)));
      this.userLastName = await firstValueFrom(this.store.select(selectors.selectLastName).pipe(take(1)));
    } catch (error) {
      console.error('Error fetching stored data:', error);
    }
  }

  //Data binding methods
  setProduct(product: string) {
    this.form.get('product')!.setValue(product);
  }

  setScore(score: number) {
    this.form.get('score')!.setValue(score);
  }

  setComment(comment: string) {
    this.form.get('comment')!.setValue(comment);
    this.characterCount = comment.length;
  }

  setFirstName(firstName: string) {
    this.form.get('firstName')!.setValue(firstName);
  }

  setLastName(lastName: string) {
    this.form.get('lastName')!.setValue(lastName);
  }

  setZipcode(zipcode: string) {
    this.form.get('zipcode')!.setValue(zipcode);
  }

  async submitReview(event: Event){
    event.preventDefault();

    this.formSubmitted = true;

    //If all form inputs are correct, create a new review
    if (this.form.valid) {
      const firstName = this.form.get('firstName')?.value;
      const lastName = this.form.get('lastName')?.value;
      const product = this.form.get('product')?.value;
      const score = this.form.get('score')?.value;
      const comment = this.form.get('comment')?.value;
      const zipcode = this.form.get('zipcode')?.value;

      const userId = await firstValueFrom(this.store.select(selectors.selectUserId).pipe(take(1)));

      const review = new Review(null, userId, firstName, lastName, zipcode, product, score, comment, null);

      try {
        const response = await this.reviewService.newReview(review);
        this.router.navigate(['/reviews']);
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
      }
    }
  }
}
