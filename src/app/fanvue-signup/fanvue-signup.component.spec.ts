import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanvueSignupComponent } from './fanvue-signup.component';

describe('FanvueSignupComponent', () => {
  let component: FanvueSignupComponent;
  let fixture: ComponentFixture<FanvueSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanvueSignupComponent]
    });
    fixture = TestBed.createComponent(FanvueSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
