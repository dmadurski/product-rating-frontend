import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review } from '../model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private allReviewsUrl: string;
  private newReviewUrl: string;

  constructor(private http: HttpClient) {
    this.allReviewsUrl = 'http://localhost:8080/allReviews';
    this.newReviewUrl = 'http://localhost:8080/newReview';
  }

  //make pages responsive, viewable on mobile

  //explore pagination within spring boot instead of angular

  public findAll(): Observable<Review[]> {
    //wait for this to finish, turn this into a synchronous call
    const reviews: Observable<Review[]> = this.http.get<Review[]>(this.allReviewsUrl);
    return reviews;
  }

  public newReview(review: Review): Observable<HttpResponse<Object>> {
    return this.http.post<HttpResponse<Object>>(this.newReviewUrl, review);
  }
}