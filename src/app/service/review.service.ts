import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Review } from '../model/review';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private newUserUrl: string;
  private allReviewsUrl: string;
  private newReviewUrl: string;

  constructor(private http: HttpClient) {
    this.newUserUrl = 'http://localhost:8080/newUser'
    this.allReviewsUrl = 'http://localhost:8080/allReviews';
    this.newReviewUrl = 'http://localhost:8080/newReview';

  }

  public async newUser(user: User): Promise<HttpResponse<Object>> {
    try {
      const response = await firstValueFrom(this.http.post<HttpResponse<Object>>(this.newUserUrl, user, {observe:'response'}));
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