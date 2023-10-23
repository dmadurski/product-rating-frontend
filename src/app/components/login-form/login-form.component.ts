import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/service/review.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  form: FormGroup;
  shouldShowError: boolean = false;
  errorMessage?: string;

  constructor(private router: Router, private reviewService: ReviewService, private fb: FormBuilder) {
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

    //If all form inputs are correct, create a new review
    if (this.form.valid) {
      const userName = this.form.get('userName')?.value;
      const password = this.form.get('password')?.value;

      try {
        //const response = await this.reviewService.newUser(user);
        console.log("User successfully added");
      } catch (error) {
        console.error('Error:', error);
        this.shouldShowError = true;
        this.errorMessage = 'An error occurred while loading reviews. Please try again later.';
      }
    }
  }
}