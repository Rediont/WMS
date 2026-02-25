import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlleyOverviewComponentComponent } from './alley-overview-component.component';

describe('AlleyOverviewComponentComponent', () => {
  let component: AlleyOverviewComponentComponent;
  let fixture: ComponentFixture<AlleyOverviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlleyOverviewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlleyOverviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
