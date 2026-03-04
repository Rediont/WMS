import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ClientObject } from '../../models/client.model';

@Component({
  selector: 'app-client-form-body',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './app-client-form-body.component.html',
  styleUrls: ['./app-client-form-body.component.scss'],
})
export class ClientFormBodyComponent implements OnChanges {
  private fb = inject(FormBuilder);

  // Вхідні дані: якщо null - це режим створення, якщо є об'єкт - редагування
  @Input() initialData: ClientObject | null = null;

  // Події: збереження та скасування
  @Output() save = new EventEmitter<ClientObject>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup = this.fb.group({  
    name: ['', [Validators.required]],
    EDRPO: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    contactPersonName: ['', [Validators.required]],
    contactPersonPhone: ['', [Validators.required]]    
  });

  // Гетер для визначення режиму
  get isEditMode(): boolean {
    return !!this.initialData;
  }

  // Спрацьовує, коли змінюються вхідні дані (при відкритті форми)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

submit() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        EDRPO: String(this.form.value.EDRPO)
      };

      this.save.emit(payload);
    }
  }
}