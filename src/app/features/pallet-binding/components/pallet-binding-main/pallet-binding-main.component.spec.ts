import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletBindingMainComponent } from './pallet-binding-main.component';

describe('PalletBindingMainComponent', () => {
  let component: PalletBindingMainComponent;
  let fixture: ComponentFixture<PalletBindingMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalletBindingMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalletBindingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
