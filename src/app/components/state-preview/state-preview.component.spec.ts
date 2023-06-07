import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatePreviewComponent } from './state-preview.component';

describe('StatePreviewComponent', () => {
  let component: StatePreviewComponent;
  let fixture: ComponentFixture<StatePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatePreviewComponent],
    });
    fixture = TestBed.createComponent(StatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
