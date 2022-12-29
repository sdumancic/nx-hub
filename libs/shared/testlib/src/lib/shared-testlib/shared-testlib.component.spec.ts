import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTestlibComponent } from './shared-testlib.component';

describe('SharedTestlibComponent', () => {
  let component: SharedTestlibComponent;
  let fixture: ComponentFixture<SharedTestlibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestlibComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTestlibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
