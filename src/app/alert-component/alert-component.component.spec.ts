import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponentComponent } from './alert-component.component';

describe('AlertComponentComponent', () => {
  let component: AlertComponentComponent;
  let fixture: ComponentFixture<AlertComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponentComponent]
    });
    fixture = TestBed.createComponent(AlertComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
