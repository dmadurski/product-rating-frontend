import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { firstValueFrom, take } from 'rxjs';
import { Review } from '../model/review';
import { User } from '../model/user';
import { LoginResponse } from '../model/login-response';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app-state';
import * as selectors from 'src/app/store/store.selectors';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private userLoginUrl: string;
  private newUserUrl: string;
  private allReviewsUrl: string;
  private userReviewsUrl: string;
  private newReviewUrl: string;
  private deleteReviewUrl: string;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.userLoginUrl = 'http://localhost:8080/login'
    this.newUserUrl = 'http://localhost:8080/newUser'
    this.allReviewsUrl = 'http://localhost:8080/allReviews';
    this.userReviewsUrl = 'http://localhost:8080/findReviewsByOwnerId';
    this.newReviewUrl = 'http://localhost:8080/newReview';
    this.deleteReviewUrl = 'http://localhost:8080/deleteReview';
  }

  public async userLogin(userName: string, password: string): Promise<LoginResponse> {
    const loginInfo = { userName, password };
    
    try {
      const response = await firstValueFrom(this.http.post(this.userLoginUrl, loginInfo, {observe:'response', responseType: 'text' }));
  
      if (response.status === 200) {
        if (response.body !== null) {
          const loginResponse: LoginResponse = JSON.parse(response.body);
          return loginResponse;
        } else {
          throw new Error('Response body is null.');
        }
      } else {
        throw new Error(`HTTP status: ${response.status}, Error: ${response.body}`);
      }
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  public async newUser(user: User): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(this.http.post(this.newUserUrl, user, {observe:'response', responseType: 'text' }));
      if (response.status === 200) {
        if (response.body !== null) {
          const loginResponse: LoginResponse = JSON.parse(response.body);
          return loginResponse;
        } else {
          throw new Error('Response body is null.');
        }
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
      const jwtString: string = await firstValueFrom(this.store.select(selectors.selectToken).pipe(take(1)));
      const headers = new HttpHeaders({'Authorization': jwtString});
      const reviews = await firstValueFrom(this.http.get<Review[]>(this.allReviewsUrl, {headers: headers}));
      return reviews;
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  public async findReviewsByOwner(ownerId: string): Promise<Review[]> {
    try {
      const jwtString = await firstValueFrom(this.store.select(selectors.selectToken).pipe(take(1)));
      const headers = new HttpHeaders({'Authorization': jwtString});
      const params = new HttpParams().set('ownerId', ownerId);
      const reviews = await firstValueFrom(this.http.get<Review[]>(this.userReviewsUrl, { headers: headers, params: params }));
      return reviews;
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  public async newReview(review: Review): Promise<HttpResponse<Object>> {
    try {
      const jwtString = await firstValueFrom(this.store.select(selectors.selectToken).pipe(take(1)));
      const headers = new HttpHeaders({'Authorization': jwtString});
      const response = await firstValueFrom(this.http.post(this.newReviewUrl, review, {headers: headers, observe:'response'}));
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

  public async deleteReview(reviewId: string): Promise<HttpResponse<Object>> {
    try {
      const jwtString = await firstValueFrom(this.store.select(selectors.selectToken).pipe(take(1)));
      const headers = new HttpHeaders({'Authorization': jwtString});
      const response = await firstValueFrom(this.http.delete(this.deleteReviewUrl, {headers: headers, body: reviewId, responseType: 'text', observe:'response'}));
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