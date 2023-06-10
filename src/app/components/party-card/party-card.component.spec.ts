import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCardComponent } from './party-card.component';

describe('PartyCardComponent', () => {
  let component: PartyCardComponent;
  let fixture: ComponentFixture<PartyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyCardComponent]
    });
    fixture = TestBed.createComponent(PartyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
