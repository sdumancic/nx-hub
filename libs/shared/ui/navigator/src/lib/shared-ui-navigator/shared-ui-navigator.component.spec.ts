import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiNavigatorComponent } from './shared-ui-navigator.component';

describe('SharedUiNavigatorComponent', () => {
  let component: SharedUiNavigatorComponent;
  let fixture: ComponentFixture<SharedUiNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiNavigatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
