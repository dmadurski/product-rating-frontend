import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private verifyTokenUrl?: string;

  constructor(private http: HttpClient) {
  }
}
