import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiStepperComponent } from './shared-ui-stepper.component';

describe('SharedUiStepperComponent', () => {
  let component: SharedUiStepperComponent;
  let fixture: ComponentFixture<SharedUiStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
