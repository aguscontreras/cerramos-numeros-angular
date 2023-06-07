import { Injectable } from '@angular/core';
import { StorageInteractor } from './database-interactor';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends StorageInteractor<'expenses'> {
  constructor(public storage: DatabaseService) {
    super(storage, 'expenses');
  }

  getAllByAmount() {
    return this.getAllFromIndex('by-amount');
  }

  getAllByMemberId() {
    return this.getAllFromIndex('by-member-id');
  }
}
