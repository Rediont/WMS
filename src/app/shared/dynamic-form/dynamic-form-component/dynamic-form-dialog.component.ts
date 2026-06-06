import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormConfig } from '../models/dynamic-form.model';
import { DynamicFormComponent } from './dynamic-form.component';

@Component({
  selector: 'app-dynamic-form-dialog',
  standalone: true,
  imports: [DynamicFormComponent, MatDialogModule],
  template: `
    <app-dynamic-form 
      [config]="config" 
      (formSubmit)="onSave($event)" 
      (formCancel)="onCancel()">
    </app-dynamic-form>
  `,
  // Прибираємо внутрішні відступи діалогу, бо наша форма вже має свої
  styles: [`
    :host { display: block; background: transparent; }
  `]
})
export class DynamicFormDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<DynamicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: FormConfig // Отримуємо конфігурацію, яку передали при відкритті
  ) {}

  onSave(formData: any) {
    // Закриваємо діалог і передаємо зібрані дані назад у ClientsComponent
    this.dialogRef.close(formData);
  }

  onCancel() {
    // Закриваємо діалог без передачі даних
    this.dialogRef.close(null);
  }
}