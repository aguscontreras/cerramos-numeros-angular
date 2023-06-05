import { Injectable } from '@angular/core';
import { StorageInteractor } from './database-interactor';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService extends StorageInteractor<'members'> {
  constructor(public database: DatabaseService) {
    super(database, 'members');
  }
}
