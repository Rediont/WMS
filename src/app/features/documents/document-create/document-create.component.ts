import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppStateService } from '../../../core/state.service/state.service';
import { DocumentService } from '../document.service';
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatNativeDateModule, MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { Location } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-document-create',
  imports: [
    MatIcon,
    MatFormField, 
    MatLabel, 
    MatOption, 
    MatSelectModule, 
    ReactiveFormsModule, 
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './document-create.component.html',
  styleUrl: './document-create.component.scss'
})
export class DocumentCreateComponent {
  private fb = inject(FormBuilder);
  public appState = inject(AppStateService); // Робимо public, щоб юзати в HTML
  private documentService = inject(DocumentService);
  private location = inject(Location); // Для кнопки "Назад"

  documentForm!: FormGroup;

  ngOnInit() {
    console.log('Палети в стейті:', this.appState.lookups.palletTypes);
    this.initForm();
  }

  private initForm() {
    this.documentForm = this.fb.group({
      creationDate: [new Date(), Validators.required],
      documentTypeId: [null, Validators.required],
      clientId: [null, Validators.required],
      contractId: [null, Validators.required],
      items: this.fb.array([]) // Це масив для рядків палет
    });

    // Можна додати слухача: якщо змінився клієнт, очистити контракт
    this.documentForm.get('clientId')?.valueChanges.subscribe(() => {
      this.documentForm.get('contractId')?.setValue(null);
    });
  }

  // --- Робота з рядками (Items) ---

  get items(): FormArray {
    return this.documentForm.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      palletTypeId: [null, Validators.required],
      expectedAmount: [1, [Validators.required, Validators.min(1)]]
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  // --- Загальні дії ---

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.documentForm.valid) {
      const formValue = this.documentForm.value;

      // Перевіряємо, чи є хоча б один рядок у FormArray
      if (!formValue.items || formValue.items.length === 0) {
        alert('Додайте хоча б один тип палет до документа!');
        return;
      }

      // 1. Перетворюємо масив з форми на Словник (Dictionary)
      const itemsDictionary: { [key: number]: number } = {};
      
      formValue.items.forEach((item: any) => {
        const palletId = Number(item.palletTypeId);
        const amount = Number(item.expectedAmount);

        if (itemsDictionary[palletId]) {
          itemsDictionary[palletId] += amount;
        } else {
          itemsDictionary[palletId] = amount;
        }
      });

      // 2. Формуємо DTO
      const payload = {
        documentTypeId: Number(formValue.documentTypeId),
        clientId: Number(formValue.clientId),
        contractId: Number(formValue.contractId),
        creationDate: formValue.creationDate.toISOString(),
        items: {
          items: itemsDictionary 
        }
      };

      console.log('Відправляємо на сервер:', payload);
      
      let request$;

      if (payload.documentTypeId === 0) { 
        request$ = this.documentService.createReceipt(payload);
      } else if (payload.documentTypeId === 1) { 
        request$ = this.documentService.createShipment(payload);
      } else {
        alert('Помилка: Невідомий тип документа!');
        return;
      }

      // 4. Підписуємося і відправляємо на бекенд
      request$.subscribe({
        next: (createdDocument) => {
          this.documentService.documentCreated$.next(createdDocument);
          this.goBack();
        },
        error: (err) => {
          console.error('Помилка створення:', err);
          
          const errorMessage = typeof err.error === 'string' ? err.error : 'Сталася помилка при збереженні бази даних.';
          alert(errorMessage);
        }
      });

    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  // Helper для фільтрації контрактів за обраним клієнтом
  get availableContracts() {
    const selectedClientId = this.documentForm.get('clientId')?.value;
    if (!selectedClientId) return [];
    
    return this.appState.lookups.contracts.filter(c => c.clientId === selectedClientId);
  }
}
