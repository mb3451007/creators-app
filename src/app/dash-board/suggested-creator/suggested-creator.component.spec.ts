import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedCreatorComponent } from './suggested-creator.component';

describe('SuggestedCreatorComponent', () => {
  let component: SuggestedCreatorComponent;
  let fixture: ComponentFixture<SuggestedCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestedCreatorComponent]
    });
    fixture = TestBed.createComponent(SuggestedCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
