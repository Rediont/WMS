import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlleyOverviewComponent } from './alley-overview-component.component';

describe('AlleyOverviewComponent', () => {
  let component: AlleyOverviewComponent;
  let fixture: ComponentFixture<AlleyOverviewComponent  >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlleyOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlleyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
