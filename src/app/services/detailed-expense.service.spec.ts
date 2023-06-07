import { TestBed } from '@angular/core/testing';

import { DetailedExpenseService } from './detailed-expense.service';

describe('DetailedExpenseService', () => {
  let service: DetailedExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailedExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
