import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManagementTabComponent } from './warehouse-management-tab.component';

describe('WarehouseManagementTabComponent', () => {
  let component: WarehouseManagementTabComponent;
  let fixture: ComponentFixture<WarehouseManagementTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseManagementTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
