import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiSectionComponent } from './shared-ui-section.component';

describe('SharedUiSectionComponent', () => {
  let component: SharedUiSectionComponent;
  let fixture: ComponentFixture<SharedUiSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
