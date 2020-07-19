import { Injectable } from '@angular/core';
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:  User;

  constructor(public  afAuth:  AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('userId', JSON.stringify(this.user.uid));
      } else {
        localStorage.setItem('userId', null);
      }
    });
  }
  //TODO: use angular fire observable
  get currentUserId(): string {
    // return firebase.auth().currentUser.uid;
    return JSON.parse(localStorage.getItem('userId'));
  }

  async login(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password);
    // localStorage.setItem('userId', JSON.stringify(this.user.uid));
  }

  async logout(){
    await this.afAuth.signOut();
    localStorage.removeItem('userId');
  }

  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('userId'));
    return  user  !==  null;
  }

  async register(email: string, password: string, name: string) {
   await this.afAuth.createUserWithEmailAndPassword(email, password);
   await (await this.afAuth.currentUser).updateProfile({displayName: name});
    // this.sendEmailVerification();
  }

  // async sendEmailVerification() {
  //   await this.afAuth.currentUser.sendEmailVerification();
  // }

  // async sendPasswordResetEmail(passwordResetEmail: string) {
  //   return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  // }
}
