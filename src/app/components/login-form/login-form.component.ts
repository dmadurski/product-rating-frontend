import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { SHA256 } from 'crypto-js';
import { Store } from '@ngrx/store';
import { login, updateFirstName, updateLastName, updateUserId, updateRole, updateToken } from 'src/app/store/store.actions';
import { LoginResponse } from 'src/app/model/login-response';
import { AppState } from 'src/app/store/app-state';
import * as selectors from 'src/app/store/store.selectors';
import { firstValueFrom, lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  form: FormGroup;
  shouldShowError: boolean = false;
  errorMessage?: string;
  loginState?: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<AppState>, private reviewService: ReviewService, private fb: FormBuilder) {

    this.form = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  setUserName(userName: string) {
    this.form.get('userName')!.setValue(userName);
  }

  setPassword(password: string) {
    this.form.get('password')!.setValue(password);
  }

  async login(event: Event){
    event.preventDefault();
    
    //If all form inputs are correct, login and save the user info returned in local storage
    if (this.form.valid) {
      const userName = this.form.get('userName')?.value;
      const password = this.form.get('password')?.value.toString();
      const hashedPassword = SHA256(password).toString();

      try {
        const loginResponse: LoginResponse = (await this.reviewService.userLogin(userName, hashedPassword));
        this.dispatchActions(loginResponse.firstName, loginResponse.lastName, loginResponse.userId, loginResponse.token, loginResponse.role);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while logging in. Make sure credentials are correct and try again.';
      }
    }
  }

  dispatchActions(newFirstName: string, newLastName: string, newUserId: string, newToken: string, newRole: string){
    this.store.dispatch(login());
    this.store.dispatch(updateFirstName({ newFirstName }));
    this.store.dispatch(updateLastName({ newLastName }));
    this.store.dispatch(updateUserId({ newUserId }));
    this.store.dispatch(updateToken({ newToken }));
    this.store.dispatch(updateRole({ newRole }));
  }
}