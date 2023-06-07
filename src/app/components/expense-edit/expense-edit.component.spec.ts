import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseEditComponent } from './expense-edit.component';

describe('ExpenseEditComponent', () => {
  let component: ExpenseEditComponent;
  let fixture: ComponentFixture<ExpenseEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseEditComponent]
    });
    fixture = TestBed.createComponent(ExpenseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
