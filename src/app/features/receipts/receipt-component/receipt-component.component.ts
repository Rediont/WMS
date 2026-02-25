import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table-component/app-table.component';
import { TableColumn } from '../../../shared/generic-table-component/table-config.model';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-receipt-component',
  imports: [GenericTableComponent, MatButton],
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

  onItemSelected(item: any) {
    console.log('Selected receipt:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected receipts changed:', selectedItems);
  }
}
