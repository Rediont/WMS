import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { GenericFilterComponent } from '../../../shared/generic-filter/component/generic-filter.component';
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { CdkDialogContainer } from "@angular/cdk/dialog";

@Component({
  selector: 'app-receipt-component',
  imports: [GenericTableComponent, MatButton, GenericFilterComponent],
  templateUrl: './receipt-component.component.html',
  styleUrl: './receipt-component.component.scss'
})
export class ReceiptComponent {

  receiptColumns : TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Receipt ID' },
    { key: 'date', label: 'Date' },
    { key: 'supplierId', label: 'Supplier ID' },
    { key: 'status', label: 'Status' }
  ];

  receiptItems: any[] = []

  rowIdKeyForReceipts = 'id';

  receiptFilterConfig: FilterField[] = [
    { 
      key: 'clientId', 
      label: 'Client', 
      type: 'select', 
      options: [
        // Поки що заглушки, пізніше заповнимо їх реальними даними з БД
        { value: 1, display: 'Client A' },
        { value: 2, display: 'Client B' }
      ] 
    },
    { 
      // Змінено ключ та тип для фільтрації по проміжку часу (З - По)
      key: 'contractDateRange', 
      label: 'Date Range', 
      type: 'date-range' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select', 
      options: [
        //статуси контракту
        { value: 0, display: 'Inactive' },    // 0 замість 'Inactive'
        { value: 1, display: 'Active' },      // 1 замість 'Active'
        { value: 2, display: 'Terminated' },  // 2 замість 'Terminated'
        { value: 3, display: 'Completed' },   // 3 замість 'Completed'
        { value: 4, display: 'Invalid' }      // 4 замість 'Invalid'
      ] 
    }
  ];

  onItemSelected(item: any) {
    console.log('Selected receipt:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected receipts changed:', selectedItems);
  }

  applyFilter(filterValues: any) {
    console.log('Дані з фільтра:', filterValues);
    // Тут буде логіка відправки запиту на C# бекенд або фільтрації локального масиву
  }
}
