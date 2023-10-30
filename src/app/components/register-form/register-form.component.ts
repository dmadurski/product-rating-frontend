import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { ReviewService } from 'src/app/services/review.service';
import { SHA256 } from 'crypto-js';
import { login, updateFirstName, updateLastName, updateUserId, updateToken, updateRole } from 'src/app/store/store.actions';
import { AppState } from 'src/app/store/app-state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  form: FormGroup;
  shouldShowError: boolean = false;
  errorMessage?: string;

  constructor(private renderer: Renderer2, private router: Router, private reviewService: ReviewService, private fb: FormBuilder, private store: Store<AppState>) {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^(?![0-9])[A-Za-z0-9]*$/)]),
      userName: new FormControl('', [Validators.required, Validators.pattern(/^(?=.{3,20}$)(?!.*[._-]{2})[A-Za-z0-9][A-Za-z0-9._-]*[A-Za-z0-9]$/)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{10,}$/)]),
    });
  }

  setFirstName(firstName: string) {
    this.form.get('firstName')!.setValue(firstName);
  }

  setLastName(lastName: string) {
    this.form.get('lastName')!.setValue(lastName);
  }

  setUserName(userName: string) {
    this.form.get('userName')!.setValue(userName);
  }

  setPassword(password: string) {
    this.form.get('password')!.setValue(password);
  }

  async registerUser(event: Event){
    event.preventDefault();

    //If all form inputs are correct, create a new review
    if (this.form.valid) {
      const firstName = this.form.get('firstName')?.value;
      const lastName = this.form.get('lastName')?.value;
      const userName = this.form.get('userName')?.value;
      const password = this.form.get('password')?.value.toString();
      console.log("Password during reg: " + password);
      const hashedPassword = SHA256(password).toString();
      console.log("Hashed password during reg: " + hashedPassword);

      const user = new User(firstName, lastName, userName, hashedPassword, "USER");

      console.log(user);

      //We expect a response similar to a successful login: necessary user info that we store locally
      try {
        const response = await this.reviewService.newUser(user);
        this.dispatchActions(response.firstName, response.lastName, response.userId, response.token, response.role)
        this.router.navigate(['/home']);
      } catch (error: any) {
        console.error('Error:', error);
        this.shouldShowError = true;
        if(error.status === 409) {
          this.errorMessage = "That username is already in use, please choose another one.";
        } else {
          this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
        }
        //Scroll the page to the top to show the error message
        window.scroll({ top: 0, });
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