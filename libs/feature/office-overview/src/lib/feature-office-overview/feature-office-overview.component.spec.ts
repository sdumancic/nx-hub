import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureOfficeOverviewComponent } from './feature-office-overview.component';

describe('FeatureOfficeOverviewComponent', () => {
  let component: FeatureOfficeOverviewComponent;
  let fixture: ComponentFixture<FeatureOfficeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureOfficeOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureOfficeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
