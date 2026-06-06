import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletBindingComponent } from './pallet-binding.component';

describe('PalletBindingComponent', () => {
  let component: PalletBindingComponent;
  let fixture: ComponentFixture<PalletBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletBindingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
