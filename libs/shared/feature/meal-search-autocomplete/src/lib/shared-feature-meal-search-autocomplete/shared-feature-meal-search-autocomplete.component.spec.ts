import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFeatureMealSearchAutocompleteComponent } from './shared-feature-meal-search-autocomplete.component';

describe('SharedFeatureMealSearchAutocompleteComponent', () => {
  let component: SharedFeatureMealSearchAutocompleteComponent;
  let fixture: ComponentFixture<SharedFeatureMealSearchAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFeatureMealSearchAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SharedFeatureMealSearchAutocompleteComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
