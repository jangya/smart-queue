import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../core/navbar.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  title = 'smart-queue';
  constructor(
    public nav: NavbarService,
    public auth: AngularFireAuth
    ) { }

  ngOnInit(): void {
  }

  async logout() {
    await this.auth.signOut();
    location.reload();
    // this.router.navigate(['../login']);
  }
}
