import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { RegisterComponent } from './catalog/register/register.component';
import { DisplayComponent } from './catalog/display/display.component';
import { SelectComponent } from './catalog/select/select.component';
import { SignupComponent } from './signup/signup.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['/']);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  // { path: 'catalog', component: RegisterComponent, children: [
  //   { path: 'register', component: RegisterComponent },
  //   { path: 'display', component: DisplayComponent },
  //   { path: 'select', component: SelectComponent },
  //   ]
  // },
  { path: 'catalog-register', component: RegisterComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'catalog-display', component: DisplayComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'catalog-select', component: SelectComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
