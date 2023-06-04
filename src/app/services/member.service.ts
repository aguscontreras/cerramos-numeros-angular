import { Injectable } from '@angular/core';
import { StorageInteractor } from './storage-interactor';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService extends StorageInteractor<'members'> {
  constructor(public storage: StorageService) {
    super(storage, 'members');
  }
}
