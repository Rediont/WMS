import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseRemainsComponent } from './warehouse-remains.component';

describe('WarehouseRemainsComponent', () => {
  let component: WarehouseRemainsComponent;
  let fixture: ComponentFixture<WarehouseRemainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseRemainsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseRemainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
