import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { WarehouseSettingsService } from './warehouse-settings.service';

@Component({
  selector: 'app-warehouse-settings',
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './warehouse-settings.component.html',
  styleUrl: './warehouse-settings.component.scss'
})
export class WarehouseSettingsComponent {
  

  warehouseForm: FormGroup;
  calculatedCellsInAlley: number = 0;
  calculatedTotalCells: number = 0;

  constructor(
    private fb: FormBuilder,
    private warehouseSettingsService: WarehouseSettingsService // 1. ІНЖЕКТИМО СЕРВІС ТУТ
  ) {
    this.warehouseForm = this.fb.group({
      numberOfAlleys: [null, [Validators.required, Validators.min(1)]],
      numberOfAlleyFloors: [null, [Validators.required, Validators.min(1)]],
      numberOfCellsInAlleyFloor: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.warehouseForm.valueChanges.subscribe(values => {
      this.calculateTotals(values);
    });
  }

  calculateTotals(values: any) {
    const floors = values.numberOfAlleyFloors || 0;
    const cellsPerFloor = values.numberOfCellsInAlleyFloor || 0;
    const alleys = values.numberOfAlleys || 0;

    this.calculatedCellsInAlley = floors * cellsPerFloor;
    this.calculatedTotalCells = alleys * this.calculatedCellsInAlley;
  }

  onSubmit() {
    if (this.warehouseForm.valid) {
      console.log('Відправляємо:', this.warehouseForm.value);
      var floors = this.warehouseForm.value.numberOfAlleyFloors;
      var cellsPerFloor = this.warehouseForm.value.numberOfCellsInAlleyFloor;
      var alleys = this.warehouseForm.value.numberOfAlleys;

     this.warehouseSettingsService.updateWarehouseSettings({ numberOfAlleys: alleys, numberOfAlleyFloors: floors, numberOfCellsInAlleyFloor: cellsPerFloor });
    }
  }

}


