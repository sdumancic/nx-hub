import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperSideboardComponent } from './stepper-sideboard.component';

describe('StepperSideboardComponent', () => {
  let component: StepperSideboardComponent;
  let fixture: ComponentFixture<StepperSideboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperSideboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperSideboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
