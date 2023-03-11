import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiMaterialComponent } from './shared-ui-material.component';

describe('SharedUiMaterialComponent', () => {
  let component: SharedUiMaterialComponent;
  let fixture: ComponentFixture<SharedUiMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiMaterialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
