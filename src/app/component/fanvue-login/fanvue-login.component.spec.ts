import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanvueLoginComponent } from './fanvue-login.component';

describe('FanvueLoginComponent', () => {
  let component: FanvueLoginComponent;
  let fixture: ComponentFixture<FanvueLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanvueLoginComponent]
    });
    fixture = TestBed.createComponent(FanvueLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
