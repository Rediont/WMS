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
  template: `
    <form [formGroup]="form" class="form-container">

      <h2>{{ isEditMode ? 'Edit Item' : 'Create New Item' }}</h2>

      <mat-form-field appearance="outline">
        <mat-label>Client ID</mat-label>
        <input matInput type="number" formControlName="id">
        <mat-error *ngIf="form.get('id')?.hasError('required')">Required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Client Name</mat-label>
        <input matInput formControlName="name">
        <mat-error *ngIf="form.get('name')?.hasError('required')">Required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email">
        <mat-error *ngIf="form.get('email')?.hasError('required')">Required</mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Phone Number</mat-label>
        <input matInput formControlName="phone">
        <mat-error *ngIf="form.get('phone')?.hasError('required')">Required</mat-error>
      </mat-form-field>

        <div class="actions">
            <button mat-button type="button" (click)="cancel.emit()">Cancel</button>

        <button mat-raised-button color="primary"
                [disabled]="form.invalid || form.pristine"
                (click)="submit()">
          {{ isEditMode ? 'Save Changes' : 'Create' }}
        </button>
    </div>

    </form>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 15px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
  `]
})
export class ClientFormBodyComponent implements OnChanges {
  private fb = inject(FormBuilder);

  // Вхідні дані: якщо null - це режим створення, якщо є об'єкт - редагування
  @Input() initialData: ClientObject | null = null;

  // Події: збереження та скасування
  @Output() save = new EventEmitter<ClientObject>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    id: [null],   
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]]    
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
      this.save.emit(this.form.value);
    }
  }
}