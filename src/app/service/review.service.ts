import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, firstValueFrom, lastValueFrom, map } from 'rxjs';
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

  //explore pagination within spring boot instead of angular

  public async findAll(): Promise<Review[]> {
    try {
      const reviews = await firstValueFrom(this.http.get<Review[]>(this.allReviewsUrl));
      return reviews;
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  public async newReview(review: Review): Promise<HttpResponse<Object>> {
    try {
      const response = await firstValueFrom(this.http.post<HttpResponse<Object>>(this.newReviewUrl, review, {observe:'response'}));
      if (response.status === 200) {
        return response;
      } else {
        throw new Error(`HTTP status: ${response.status}, Error: ${response.body}`);
      }
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }
}