import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealOrderCartSmallComponent } from './meal-order-cart-small.component';

describe('MealOrderCartSmallComponent', () => {
  let component: MealOrderCartSmallComponent;
  let fixture: ComponentFixture<MealOrderCartSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealOrderCartSmallComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MealOrderCartSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
