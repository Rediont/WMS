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
      numberOfFloorsPerAlley: [null, [Validators.required, Validators.min(1)]],
      CellsPerAlleyFloor: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.warehouseForm.valueChanges.subscribe(values => {
      this.calculateTotals(values);
    });
  }

  calculateTotals(values: any) {
    const floors = values.numberOfFloorsPerAlley || 0;
    const cellsPerFloor = values.CellsPerAlleyFloor || 0;
    const alleys = values.numberOfAlleys || 0;

    this.calculatedCellsInAlley = floors * cellsPerFloor;
    this.calculatedTotalCells = alleys * this.calculatedCellsInAlley;
  }

  onSubmit() {
    if (this.warehouseForm.valid) {
      
      const floors = this.warehouseForm.value.numberOfFloorsPerAlley;
      const cellsPerFloor = this.warehouseForm.value.CellsPerAlleyFloor;
      const alleys = this.warehouseForm.value.numberOfAlleys;

      // 1. Формуємо об'єкт так, щоб ключі ТОЧНО збігалися з WarehouseSettingsDto в C#
      const payload = {
        numberOfAlleys: alleys,
        numberOfFloorsPerAlley: floors, // Було: numberOfAlleyFloors
        cellsPerAlleyFloor: cellsPerFloor // Було: numberOfCellsInAlleyFloor
      };

      console.log('Відправляємо на бекенд:', payload);

      // 2. ОБОВ'ЯЗКОВО додаємо .subscribe(), інакше запит не полетить!
      this.warehouseSettingsService.updateWarehouseSettings(payload).subscribe({
        next: (response) => {
          console.log('Успіх! Налаштування збережено:', response);
          // Тут можна показати тост (повідомлення) про успіх
        },
        error: (err) => {
          console.error('Помилка при збереженні:', err);
        }
      });
    }
  }

}


