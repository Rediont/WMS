import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FilterField } from '../model/generic-filter.model'; // Твій шлях

@Component({
  selector: 'app-generic-filter',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
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
      } else {
        group[field.key] = [null];
      }
    });

    this.filterForm = this.fb.group(group);
  }

  // ДОДАНО: Метод для отримання вкладеної форми для дат
  getAsFormGroup(key: string): FormGroup {
    return this.filterForm.get(key) as FormGroup;
  }

  applyFilters() {
    // Перевіряємо чи форма валідна (опціонально, але гарна практика)
    if (this.filterForm.invalid) return;

    const value = this.filterForm.value;
    
    const cleanedValues = Object.fromEntries(
      Object.entries(value).filter(([_, v]) => {
        if (v && typeof v === 'object') {
          const dateRange = v as { start?: Date | null, end?: Date | null };
          if ('start' in dateRange || 'end' in dateRange) {
             // Фільтруємо, якщо хоча б одна дата вибрана
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
    this.filterChanged.emit({}); 
  }   
}