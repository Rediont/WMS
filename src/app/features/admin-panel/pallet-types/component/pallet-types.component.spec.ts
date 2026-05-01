import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletTypesComponent } from './pallet-types.component';

describe('PalletTypesComponent', () => {
  let component: PalletTypesComponent;
  let fixture: ComponentFixture<PalletTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
