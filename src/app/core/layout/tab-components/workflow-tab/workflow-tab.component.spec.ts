import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTabComponent } from './workflow-tab.component';

describe('WorkflowTabComponent', () => {
  let component: WorkflowTabComponent;
  let fixture: ComponentFixture<WorkflowTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
