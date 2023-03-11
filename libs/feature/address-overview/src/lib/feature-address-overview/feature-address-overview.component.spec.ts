import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAddressOverviewComponent } from './feature-address-overview.component';

describe('FeatureAddressOverviewComponent', () => {
  let component: FeatureAddressOverviewComponent;
  let fixture: ComponentFixture<FeatureAddressOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAddressOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAddressOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
