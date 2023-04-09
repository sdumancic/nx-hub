import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFeatureAuthComponent } from './shared-feature-auth.component';

describe('SharedFeatureAuthComponent', () => {
  let component: SharedFeatureAuthComponent;
  let fixture: ComponentFixture<SharedFeatureAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFeatureAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFeatureAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
