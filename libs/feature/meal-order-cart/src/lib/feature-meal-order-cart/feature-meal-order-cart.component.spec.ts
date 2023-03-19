import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureMealOrderCartComponent } from './feature-meal-order-cart.component';

describe('FeatureMealOrderCartComponent', () => {
  let component: FeatureMealOrderCartComponent;
  let fixture: ComponentFixture<FeatureMealOrderCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureMealOrderCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureMealOrderCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
