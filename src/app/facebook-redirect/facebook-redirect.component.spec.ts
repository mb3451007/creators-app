import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookRedirectComponent } from './facebook-redirect.component';

describe('FacebookRedirectComponent', () => {
  let component: FacebookRedirectComponent;
  let fixture: ComponentFixture<FacebookRedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacebookRedirectComponent]
    });
    fixture = TestBed.createComponent(FacebookRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
