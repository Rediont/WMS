import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Видаляємо MatSelectModule і додаємо MatCheckboxModule:
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FilterField } from '../model/generic-filter.model'; 

@Component({
  selector: 'app-generic-filter',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule, // ДОДАНО
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './generic-filter.component.html',
  styleUrls: ['./generic-filter.component.scss']
})
export class GenericFilterComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() fields: FilterField[] = [];
  @Output() filterChanged = new EventEmitter<any>();

  filterForm!: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    const group: any = {};
    
    this.fields.forEach(field => {
      if (field.type === 'date-range') {
        group[field.key] = this.fb.group({ start: [null], end: [null] });
      } else if (field.type === 'select') {
        // Для чекбоксів початкове значення - порожній масив
        group[field.key] = [[]]; 
      } else {
        group[field.key] = [null];
      }
    });

    this.filterForm = this.fb.group(group);
  }

  getAsFormGroup(key: string): FormGroup {
    return this.filterForm.get(key) as FormGroup;
  }

  // --- НОВІ МЕТОДИ ДЛЯ ЧЕКБОКСІВ ---

  // Перевіряє, чи вибраний конкретний чекбокс
  isChecked(controlName: string, value: any): boolean {
    const control = this.filterForm.get(controlName);
    return control?.value ? control.value.includes(value) : false;
  }

  // Додає або видаляє значення з масиву при кліку на чекбокс
  toggleCheckbox(controlName: string, value: any, checked: boolean) {
    const control = this.filterForm.get(controlName);
    if (control) {
      const currentValue = control.value || [];
      if (checked) {
        control.setValue([...currentValue, value]); // Додаємо
      } else {
        control.setValue(currentValue.filter((v: any) => v !== value)); // Видаляємо
      }
    }
  }

  // ----------------------------------

  applyFilters() {
    if (this.filterForm.invalid) return;

    const value = this.filterForm.value;
    
    const cleanedValues = Object.fromEntries(
      Object.entries(value).filter(([_, v]) => {
        // Перевірка для масивів (наших чекбоксів)
        if (Array.isArray(v)) {
          return v.length > 0; // Відправляємо тільки якщо вибрано хоча б 1 пункт
        }
        
        // Перевірка для дат
        if (v && typeof v === 'object') {
          const dateRange = v as { start?: Date | null, end?: Date | null };
          if ('start' in dateRange || 'end' in dateRange) {
            return dateRange.start != null || dateRange.end != null;
          }
        }
        return v != null && v !== '';
      })
    );
    
    this.filterChanged.emit(cleanedValues);
  }

  resetFilters() {
    this.filterForm.reset();
    
    // Щоб при скиданні чекбокси коректно очистились (отримали []), 
    // потрібно знову проініціалізувати форму масивами
    this.fields.forEach(field => {
      if (field.type === 'select') {
        this.filterForm.get(field.key)?.setValue([]);
      }
    });

    this.filterChanged.emit({}); 
  }   
}