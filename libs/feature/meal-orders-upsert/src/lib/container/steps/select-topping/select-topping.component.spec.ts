import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectToppingComponent } from './select-topping.component';

describe('SelectToppingComponent', () => {
  let component: SelectToppingComponent;
  let fixture: ComponentFixture<SelectToppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectToppingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
