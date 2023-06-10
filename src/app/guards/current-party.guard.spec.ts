import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { currentPartyGuard } from './current-party.guard';

describe('currentPartyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => currentPartyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
