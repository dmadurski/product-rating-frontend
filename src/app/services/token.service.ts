import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { AppState } from '../store/app-state';
import * as selectors from 'src/app/store/store.selectors';
import { resetState, updateToken } from '../store/store.actions';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from './confirmation-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private verifyTokenUrl: string;
  private regenJwtUrl: string;

  constructor(private router: Router, private http: HttpClient, private confirmationDialogService: ConfirmationDialogService, private store: Store<AppState>) {
    this.verifyTokenUrl = 'http://localhost:8080/checkJwt';
    this.regenJwtUrl = 'http://localhost:8080/jwt/regenJwt';
  }

  public async verifyToken() {
    try {
      const jwtString: string = await firstValueFrom(this.store.select(selectors.selectToken).pipe(take(1)));

      //If there is a user logged in, make sure the JWT is authentic, and has not expired
      if(jwtString != null && jwtString.length > 0) {
        const params = new HttpParams().set('jwtString', jwtString);
        const response = await firstValueFrom(this.http.get(this.verifyTokenUrl, {observe:'response', params: params, responseType: 'text'}));
        if(response.body){
          //If the JWT was recently expired, provide a dialog asking if the user wants to continue
          //Otherwise, the JWT is not authentic, or has expired past the grace period, so force logout
          const responseMessage: String = response.body;
          console.log(responseMessage);
          if(responseMessage === "JWT recently expired"){
            this.confirmContinueSession();
          } else if (responseMessage === "JWT expired for too long") {
            this.logout();
          }
        }
      } 
    } catch (error) {
      console.log('Error:', error);
      this.logout();
    }
  }

  //If the user chooses to logout, logout
  //Otherwise, generate a new JWT and replace the current one in storage
  public async confirmContinueSession(){
    const exitSession: Boolean = await this.confirmationDialogService.openContinueSessionDialog();
    if(exitSession){
      this.logout();
    } else {
      const userId: string = await firstValueFrom(this.store.select(selectors.selectUserId).pipe(take(1)));
      const params = new HttpParams().set('userId', userId);
      const response = await firstValueFrom(this.http.get(this.regenJwtUrl, {observe:'response', params: params, responseType: 'text'}));
      if(response.status === 200 && response.body){
        const newToken: string = response.body;
        this.store.dispatch(updateToken({ newToken }));
      }
    }
  }

  public logout() {
    localStorage.clear();
    this.store.dispatch(resetState());
    this.router.navigate(['/login']);
  }
}
