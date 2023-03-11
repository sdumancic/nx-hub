import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureLocationsOverviewComponent } from './feature-locations-overview.component';

describe('FeatureLocationsOverviewComponent', () => {
  let component: FeatureLocationsOverviewComponent;
  let fixture: ComponentFixture<FeatureLocationsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureLocationsOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureLocationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
