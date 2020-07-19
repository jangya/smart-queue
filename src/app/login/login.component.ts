import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginLoading: boolean =  false;
  submitted: boolean = false;
  returnUrl: string;
  loginError: string;
  hide:boolean = true;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) { 
 
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

      // get return url from route parameters or default to '/'
      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {
      this.submitted = true;
      this.loginError = '';
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      this.loginLoading = true;
      await this.authService.login(this.f.username.value, this.f.password.value)
        .catch(err => {
          this.loginError = err;
          this.loginLoading = false;
          return;
        });
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      this.loginLoading = false;
      // if (!this.loginError) location.reload();
      if(!this.loginError) this.router.navigate(['/']);
  }
}
