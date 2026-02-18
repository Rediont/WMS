import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ClientFormBodyComponent } from './app-client-form-body.component';
import { ClientObject} from '../../models/client.model';

@Component({
  selector: 'app-client-dialog-wrapper',
  standalone: true,
  imports: [MatDialogModule, ClientFormBodyComponent], // Імпортуємо нашу форму
  template: `
    <div class="dialog-padding">
      
      <app-client-form-body 
        [initialData]="data"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-client-form-body>

    </div>
  `,
  styles: [`
    .dialog-padding { padding: 20px; min-width: 350px; }
  `]
})
export class ClientDialogWrapperComponent {
  constructor(

    private dialogRef: MatDialogRef<ClientDialogWrapperComponent>,

    @Inject(MAT_DIALOG_DATA) public data: ClientObject | null
  ) {}

  onSave(result: ClientObject) {
    // Закриваємо діалог і передаємо результат назад у батьківський компонент
    this.dialogRef.close(result);
  }

  onCancel() {
    // Закриваємо діалог без результату
    this.dialogRef.close(null);
  }
}