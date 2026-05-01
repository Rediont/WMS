import { Component, inject } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/generic-table/app-table.component";
import { TableColumn } from '../../../../shared/generic-table/table-config.model';
import { PalletTypeService } from '../pallet-type.service';
import { AppStateService } from '../../../../core/state.service/state.service';
import { PalletType } from '../pallet-type.model';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { FormConfig } from '../../../../shared/dynamic-form/models/dynamic-form.model';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form-component/dynamic-form.component';
import { DynamicFormDialogComponent } from '../../../../shared/dynamic-form/dynamic-form-component/dynamic-form-dialog.component';

@Component({
  selector: 'app-pallet-types',
  imports: [GenericTableComponent, MatButton],
  templateUrl: './pallet-types.component.html',
  styleUrl: './pallet-types.component.scss'
})
export class PalletTypesComponent {
  private palletTypeService = inject(PalletTypeService);
  private appState = inject(AppStateService);  
  private dialog = inject(MatDialog);

  palletTypeColumns: TableColumn[] = [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Назва'},
    {key: 'size', label: 'Розмір'},
  ];

  palletTypeItems: PalletType[] = [];

  rowIdKeyForPalletTypes = 'id';

  palletTypeFormConfig: FormConfig = {
  title: 'Додати новий тип палети',
  submitText: 'Зберегти',
  fields: [
    {
      key: 'name',
      label: 'Назва (напр. Європалета)',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    },
    {
      key: 'size',
      label: 'Розмір напр. 1.2 (в метрах)',
      type: 'number',
      validators: [Validators.required, Validators.maxLength(50)]
    }
  ]
};

  ngOnInit() {
    this.palletTypeItems = this.appState.lookups.palletTypes;
  }

  openAddPalletTypeDialog() {
    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      width: '400px',
      data: this.palletTypeFormConfig,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Дані з динамічного діалогу:', result);
        
        // Викликаємо сервіс збереження
        this.palletTypeService.createPalletType(result).subscribe({
          next: (response) => {
            console.log('Тип палети успішно створено:', response);
            // Оновлюємо локальний список після успішного створення
            this.palletTypeItems.push(response);
          },
          error: (error) => {
            console.error('Помилка при створенні типу палети:', error);
          }
        });
      }
    });
  }

  onItemSelected(event: PalletType) {
    console.log('Selected pallet type:', event); 
  }

  onSelectionChanged(selectedItems: PalletType[]) {
    console.log('Selected pallet types:', selectedItems);
  }
}
