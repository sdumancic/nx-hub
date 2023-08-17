import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesOverviewContainerComponent } from './employees-overview-container.component';

describe('FeatureEmployeesOverviewComponent', () => {
  let component: EmployeesOverviewContainerComponent;
  let fixture: ComponentFixture<EmployeesOverviewContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesOverviewContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesOverviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
