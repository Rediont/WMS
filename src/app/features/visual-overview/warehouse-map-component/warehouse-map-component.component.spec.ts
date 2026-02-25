import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMapComponent } from './warehouse-map-component.component';

describe('WarehouseMapComponent', () => {
  let component: WarehouseMapComponent;
  let fixture: ComponentFixture<WarehouseMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
