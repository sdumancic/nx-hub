import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUtilCoreComponent } from './shared-util-core.component';

describe('SharedUtilCoreComponent', () => {
  let component: SharedUtilCoreComponent;
  let fixture: ComponentFixture<SharedUtilCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilCoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
