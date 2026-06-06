import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfig, FormField } from '../models/dynamic-form.model';
import { CommonModule } from '@angular/common'; // Якщо використовуєш Standalone компоненти

@Component({
  selector: 'app-dynamic-form',
  standalone: true, // Рекомендую використовувати standalone
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input({ required: true }) config!: FormConfig;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  // Динамічно будуємо FormGroup на основі конфігурації
  private buildForm() {
    const group: any = {};
    
    this.config.fields.forEach((field: FormField) => {
      group[field.key] = [
        field.defaultValue || '', 
        field.validators || []
      ];
    });

    this.form = this.fb.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      // Відправляємо дані назовні, якщо форма валідна
      this.formSubmit.emit(this.form.value);
    } else {
      // Показуємо помилки, якщо користувач натиснув Submit на невалідній формі
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  // Допоміжний метод для перевірки помилок в HTML
  hasError(key: string): boolean {
    const control = this.form.get(key);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}