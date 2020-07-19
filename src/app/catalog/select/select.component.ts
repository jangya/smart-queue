import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/core/firestore.service';
import { Observable } from 'rxjs';
import { Catalog, Status } from 'src/app/core/catalog.model';
import { AuthService } from 'src/app/core/auth.service';
import { User, analytics } from 'firebase';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  selectedCatalog: Observable<Catalog>;
  selectedCatalogId: string;
  dbName = 'catalogs';
  error = '';
  loading = false;
  currentUserId: string;
  progressCatalog: boolean;
  myOPD: number;
  opdToken: Observable<Object>;

  constructor(
    private db: FirestoreService, 
    private authService: AuthService,
    private afs: AngularFirestore) { 
    
  }
  get Status() { return Status; }
  
  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserId;
    this.onOPDChange();
    this.opdToken = this.db.doc$('opd/opd' + this.myOPD);
    this.db.col$(this.dbName, ref => 
      ref.where('status', '==', 'PROGRESS').where('treatedBy', '==', this.currentUserId).limit(1))
      .subscribe(data => {
          // this.selectCatalog.emit(data);
          // data.map(x => {
          //   this.catalogs = x;
          // });
          this.progressCatalog = data.length ? true : false;
    });
  }

  onOPDChange(opd?: number) {
    if (!opd) {
      let savedOPD = parseInt(localStorage.getItem('myOPD'));
      this.myOPD = savedOPD ? savedOPD : 1;
      return;
    }    
    this.myOPD = opd;
    localStorage.setItem('myOPD', this.myOPD.toString());
  }

  selectPatient(catalogId: string) {
    this.error = '';
    this.selectedCatalogId = catalogId;
    this.selectedCatalog = this.db.doc$(this.dbName + '/' + catalogId);
  }

  async delete() {
    this.loading = true;
    await this.db.delete(this.dbName + '/' + this.selectedCatalogId);
    this.selectedCatalogId = '';
    this.error = "Successfully deleted.";
    setTimeout(() => this.loading = false, 200);
  }

  discard(): void{
    this.selectedCatalogId = '';
    this.selectedCatalog = undefined;
  }

  async statusUpdate(status: Status, assignUser: string, token?:number) {
    if (status == Status.Progress && this.progressCatalog) {
      this.error = "Already one patient is in progress by you. Please make a decision first.";
      return;
    }
    if (status != Status.Progress && assignUser !== this.currentUserId) {
      this.error = "This patient is in progress by other Doctor. Please select a different patient.";
      return;
    }
    let data: any;
    this.loading = true;
    if (status == Status.Progress) {
      await this.afs.doc('opd/opd' + this.myOPD).update({
        token: token
      });
    }
    data = {
      status: status,
      treatedBy: status == Status.Open ? '' : this.currentUserId
    };
    await this.db.update(this.dbName + '/' + this.selectedCatalogId, data);
    setTimeout(() => this.loading = false, 200);
  }

}
