import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureEmployeesOverviewComponent } from './feature-employees-overview.component';

describe('FeatureEmployeesOverviewComponent', () => {
  let component: FeatureEmployeesOverviewComponent;
  let fixture: ComponentFixture<FeatureEmployeesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureEmployeesOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureEmployeesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
