import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppStateService } from '../../../core/state.service/state.service';
import { DocumentService } from '../document.service';
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { Location } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-document-create',
  imports: [
    MatIcon,
    MatFormField, 
    MatLabel, 
    MatOption, 
    MatSelectModule, 
    ReactiveFormsModule, 
    MatButton],
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
      if (this.items.length === 0) {
        alert('Додайте хоча б один тип палет до документа!');
        return;
      }

      console.log('Відправляємо на сервер:', this.documentForm.value);
      
      // this.documentService.createDocument(this.documentForm.value).subscribe({
      //   next: () => this.goBack(),
      //   error: (err) => console.error(err)
      // });
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
