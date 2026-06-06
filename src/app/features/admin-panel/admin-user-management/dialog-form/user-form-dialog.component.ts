import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'; // Додали для іконки ока
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, 
    MatSelectModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Редагувати користувача' : 'Новий користувач' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="dialog-form">
        <mat-form-field appearance="fill" fullWidth>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
        </mat-form-field>

        <mat-form-field appearance="fill" fullWidth>
          <mat-label>Роль</mat-label>
          <mat-select formControlName="role">
            <mat-option value="Admin">Адмін</mat-option>
            <mat-option value="Worker">Працівник</mat-option>
            <mat-option value="Client">Клієнт</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill" fullWidth>
          <mat-label>{{ isEdit ? 'Новий пароль (залиште пустим, щоб не змінювати)' : 'Пароль' }}</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          
          <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
            <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          
          @if (userForm.get('password')?.hasError('minlength')) {
            <mat-error>Пароль має містити мінімум 6 символів</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Скасувати</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="onSave()">Зберегти</button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Задаємо світлий фон безпосередньо, якщо глобальна тема десь "протікає" */
    :host {
      display: block;
      background-color: #ffffff; 
      color: #333333;
    }

    .dialog-title {
      margin: 0 0 16px;
      padding-bottom: 16px;
      color: #202124;
    }

    .dialog-form { 
      display: flex; 
      flex-direction: column; 
      gap: 8px; /* outline поля візуально більші, тому gap можна зменшити */
      margin-top: 8px; 
      min-width: 350px; 
    }

    .dialog-actions {
      padding: 16px 24px;
      margin-bottom: -8px;
    }
  `]
})
export class UserFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  
  userForm: FormGroup;
  isEdit: boolean = false;
  hidePassword = true; // Стан видимості пароля

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.isEdit = !!data;

    this.userForm = this.fb.group({
      id: [data?.id || null],
      email: [data?.email || '', [Validators.required, Validators.email]],
      role: [data?.role || 'Worker', Validators.required],
      
      // Якщо це створення — пароль обов'язковий. Якщо редагування — ні.
      password: ['', this.isEdit ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]]
    });
  }

  onSave() {
    if (this.userForm.valid) {
      const result = this.userForm.value;
      
      // Якщо пароль пустий при редагуванні, ми можемо його видалити з об'єкта,
      // щоб випадково не відправити порожній рядок на бекенд
      if (this.isEdit && !result.password) {
        delete result.password;
      }
      
      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}