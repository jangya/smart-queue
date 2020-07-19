import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

type CollectionPredicate<T>  = string | AngularFirestoreCollection<T>;
type DocumentPredicate<T>    = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private afs: AngularFirestore) { }

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocumentPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  doc$<T>(ref: DocumentPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      return doc.payload.data() as T;
    }));
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(docs => {
        return docs.map(a => a.payload.doc.data()) as T[];
    }));
  }

  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get increment() {
    return firebase.firestore.FieldValue.increment(1);
  }
  increment1 = firebase.firestore.FieldValue.increment(1);

  set<T>(ref: DocumentPredicate<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp
    });
  }

  update<T>(ref: DocumentPredicate<T>, data: any) {
    const timestamp = this.timestamp;
    return this.doc(ref).update({
      ...data,
      updatedAt: timestamp
    });
  }

  delete<T>(ref: DocumentPredicate<T>) {
    return this.doc(ref).delete();
  }

  add<T>(ref: CollectionPredicate<T>, data: T) {
    const timestamp = this.timestamp;
    const increment = this.increment;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }
}
