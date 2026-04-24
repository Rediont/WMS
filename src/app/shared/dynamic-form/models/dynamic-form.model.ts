
import { ValidatorFn } from '@angular/forms';

export type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'checkbox';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormField {
  key: string;              // Назва властивості в об'єкті (напр., 'numberOfAlleys')
  label: string;            // Текст, який побачить користувач (напр., 'Кількість алей')
  type: FieldType;          // Тип поля вводу
  validators?: ValidatorFn[]; // Правила валідації (Validators.required тощо)
  options?: SelectOption[]; // Якщо це 'select', тут будуть варіанти вибору
  defaultValue?: any;       // Значення за замовчуванням
}

export interface FormConfig {
  title: string;            // Заголовок форми (напр., 'Додати клієнта')
  submitText: string;       // Текст кнопки (напр., 'Зберегти')
  fields: FormField[];      // Масив полів форми
}