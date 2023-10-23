import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { User } from 'src/app/model/user';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  form: FormGroup;
  shouldShowError: boolean = false;
  errorMessage?: string;

  constructor(private router: Router, private reviewService: ReviewService, private fb: FormBuilder) {
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
      const password = this.form.get('password')?.value;

      const user = new User(firstName, lastName, userName, password);

      console.log(user);

      try {
        const response = await this.reviewService.newUser(user);
        console.log("User successfully added");
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
      }
    }
  }
}