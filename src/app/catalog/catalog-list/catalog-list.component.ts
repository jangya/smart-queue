import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FirestoreService } from 'src/app/core/firestore.service';
import { Observable } from 'rxjs';
import { Catalog, Status } from 'src/app/core/catalog.model';
import { AuthService } from 'src/app/core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss'],
  inputs: ['action: catalog-action'],
  outputs: ['selectCatalogEmit', 'selectCatalogIdEmit'],
})
export class CatalogListComponent implements OnInit {
  action: string|null = null;
  selectCatalogEmit = new EventEmitter<Catalog>();
  selectCatalogIdEmit = new EventEmitter<string>();
  colName = 'catalogs';
  catalogs: Observable<Catalog[]>;
  currentUserId: string;
  fromSelect = false;
  selectedCatalogId: string;
  progressCatalog: boolean;
  loading: number;

  // @Input() selectedCatalogId: string;
  // @Input()
  // set selectedCatalog(value: string) {
  //   this.selectedCatalogId = (value && value.trim()) || '';
  // }

  // get selectedCatalog(): string { return this.selectedCatalogId; }

  constructor(
    private db: FirestoreService,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {

  }

  ngOnInit(): void {
    // this.catalogs = this.db.colWithIds$(this.colName);
    this.currentUserId = this.authService.currentUserId;
    // this.db.col$('catalogs', ref => 
    //   ref.where('status', '==', 'PROGRESS').where('treatedBy', '==', this.currentUserId).limit(1))
    //   .subscribe(data => {
    //       // this.selectCatalog.emit(data);
    //       // data.map(x => {this.selectCatalog.emit(x);})
    //       this.progressCatalog = data.length ? true : false;
    // });
    this.fromSelect = this.action === 'select' ? true : false;
    // this.currentUserId = firebase.auth().currentUser.uid;
    this.getCatalogList();
  }

  getCatalogList(): void {
    this.catalogs = this.db.colWithIds$(this.colName, ref => {
      let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (this.action === 'select') { 
        query = query.orderBy('createdAt').limit(15) 
      }
      else { 
        query = query.orderBy('createdAt', 'desc').limit(15)
      };
      return query;
    });
  }
 
  select(catalogId: string): void {
    if (this.fromSelect) {
      this.selectedCatalogId = catalogId;
      this.selectCatalogIdEmit.emit(catalogId);
    }
  }

  delete(id : string) {
    this.db.delete(this.colName + '/' + id);
  }
  
  edit(catalog: Catalog) {
    this.selectCatalogEmit.emit(catalog);
  }

  // async display(catalog: Catalog, index:number) {
  //   this.loading = index + 1;
  //   this.selectedCatalogId = catalog.id;
  //   this.selectCatalog.emit(catalog);
    
   
  //   setTimeout(async () => {
  //     await this.statusUpdate(catalog.id, true);
  //     this.loading = 0;
  //   },3000);
  // }

  // resolve(docId: string) {
  //   this.statusUpdate(docId, false);
  // }

  // async statusUpdate(id: string, progress: boolean) {
  //   let data: any;
  //   if(progress) {
  //     data = {
  //       status: Status.Progress,
  //       treatedBy: this.currentUserId
  //     };
  //   } else {
  //     data = {
  //       status: Status.Resolved,
  //     }
  //   }
  //   await this.db.update(this.colName + '/' + id, data);
  // }

}
