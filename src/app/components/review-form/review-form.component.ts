import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Review } from 'src/app/model/review';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {

  form: FormGroup;
  characterCount: number = 0;
  formSubmitted: boolean = false;

  constructor(private router: Router, private reviewService: ReviewService, private fb: FormBuilder) {
    this.form = this.fb.group({
      product: new FormControl('', Validators.required),
      score: new FormControl(0, [Validators.required, Validators.pattern(/^[1-5]*$/)]),
      comment: new FormControl('', Validators.pattern(/^.{1,500}$/)),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      zipcode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}|\d{9})$/)]),
    });
  }

  ngOnInit() {
    console.log('ReviewFormComponent has been rendered.');
    // You can add any other initialization or rendering-related logic here.
  }

  products = [
    'iConnectX',
    'EmployMe',
    'WeInvite',
    'CompanyTRAK',
  ];

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

      const review = new Review(null, firstName, lastName, zipcode, product, score, comment, null);

      try {
        const response = await this.reviewService.newReview(review);
        this.router.navigate(['/reviews']);
      } catch (error) {
        console.log('Error:', error);
        //create a placeholder component and display error message within it
      }
    }
  }
}
