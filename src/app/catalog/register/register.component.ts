import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Catalog, Status } from 'src/app/core/catalog.model';
import { FirestoreService } from 'src/app/core/firestore.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  catalogForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  newCatalog: Catalog;
  colName = 'catalogs';
  currentUserId: string;

  constructor(
      private formBuilder: FormBuilder,
      private db: FirestoreService,
      private authService: AuthService
  ) { 
    // this.currentUserId = this.authService.currentUserId;
  }

  ngOnInit() {
      this.catalogForm = this.formBuilder.group({
          id: [''],
          benId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
          name: [''],
          token: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      });
  }

  edit(catalog: Catalog) {
    // this.f.controls.benId = catalog.benId;
    this.catalogForm.patchValue(catalog);
  }
  // convenience getter for easy access to form fields
  get f() { return this.catalogForm.controls; }

  async onSubmit() {
    this.submitted = true;
    if (this.catalogForm.invalid) {
        return;
    }
    this.loading = true;
    //Update catalog
    if (this.catalogForm.value.id) {
      const docId = this.catalogForm.value.id;
      delete this.catalogForm.value.id;
      await this.db.update('catalogs/' + docId, this.catalogForm.value);
    }
    // Add catalog
    else {
      delete this.catalogForm.value.id;
      const defaultProperty = {
        status: Status.Open,
        createdBy: this.authService.currentUserId
      };
      // this.newCatalog = new Catalog(this.catalogForm.value);
      this.newCatalog = {...defaultProperty,...this.catalogForm.value};
      await this.db.add('catalogs', this.newCatalog);
    }
    
    this.catalogForm.reset();
    this.loading = false;
  }

  delete(id : string) {
    this.db.delete(this.colName + '/' + id);
  }
}
