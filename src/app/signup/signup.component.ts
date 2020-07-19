import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

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
    this.signupForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        pwd: ['', Validators.required],
        confirmPwd: ['', Validators.required]
    },);
  }

  // checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  //   let pass = group.get('pwd').value;
  //   let confirmPass = group.get('confirmPwd').value;

  //   return pass === confirmPass ? null : { mismatch: true }     
  // }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  async onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.signupForm.invalid) {
          return;
      }
      if (this.f.pwd.value !== this.f.confirmPwd.value) {
        this.error = 'Password do not match';
        return;
      }

      this.loading = true;
      await this.authService.register(this.f.email.value, this.f.pwd.value, this.f.name.value)
        .catch(err => {
          this.error = err;
        });
      this.loading = false;
      if (!this.error) location.reload();
      // this.router.navigate([this.returnUrl]);
  }
}
