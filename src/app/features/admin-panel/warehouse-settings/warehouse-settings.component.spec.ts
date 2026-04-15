import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSettingsComponent } from './warehouse-settings.component';

describe('WarehouseSettingsComponent', () => {
  let component: WarehouseSettingsComponent;
  let fixture: ComponentFixture<WarehouseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
