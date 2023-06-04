import { Injectable } from '@angular/core';
import { StorageInteractor } from './storage-interactor';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends StorageInteractor<'expenses'> {
  constructor(public storage: StorageService) {
    super(storage, 'expenses');
  }
}
