import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureFoodLoginComponent } from './feature-food-login.component';

describe('FeatureFoodLoginComponent', () => {
  let component: FeatureFoodLoginComponent;
  let fixture: ComponentFixture<FeatureFoodLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureFoodLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureFoodLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
