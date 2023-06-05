import { Injectable } from '@angular/core';
import { StorageInteractor } from './database-interactor';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends StorageInteractor<'categories'> {
  constructor(public storage: DatabaseService) {
    super(storage, 'categories');
  }
}
