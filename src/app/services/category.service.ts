import { Injectable } from '@angular/core';
import { StorageInteractor } from './storage-interactor';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends StorageInteractor<'categories'> {
  constructor(public storage: StorageService) {
    super(storage, 'categories');
  }
}
