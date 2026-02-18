import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { InventoryFormBodyComponent } from './app-inventory-form-body.component';
import { InventoryItem } from '../../models/inventory-item.model';

@Component({
  selector: 'app-inventory-dialog-wrapper',
  standalone: true,
  imports: [MatDialogModule, InventoryFormBodyComponent], // Імпортуємо нашу форму
  template: `
    <div class="dialog-padding">
      
      <app-inventory-form-body 
        [initialData]="data"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-inventory-form-body>

    </div>
  `,
  styles: [`
    .dialog-padding { padding: 20px; min-width: 350px; }
  `]
})
export class InventoryDialogWrapperComponent {
  constructor(

    private dialogRef: MatDialogRef<InventoryDialogWrapperComponent>,

    @Inject(MAT_DIALOG_DATA) public data: InventoryItem | null
  ) {}

  onSave(result: InventoryItem) {
    // Закриваємо діалог і передаємо результат назад у батьківський компонент
    this.dialogRef.close(result);
  }

  onCancel() {
    // Закриваємо діалог без результату
    this.dialogRef.close(null);
  }
}