import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureWorkplaceReservationsComponent } from './feature-workplace-reservations.component';

describe('FeatureWorkplaceReservationsComponent', () => {
  let component: FeatureWorkplaceReservationsComponent;
  let fixture: ComponentFixture<FeatureWorkplaceReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureWorkplaceReservationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureWorkplaceReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
