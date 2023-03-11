import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUiSideboardComponent } from './shared-ui-sideboard.component';

describe('SharedUiSideboardComponent', () => {
  let component: SharedUiSideboardComponent;
  let fixture: ComponentFixture<SharedUiSideboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUiSideboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUiSideboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
