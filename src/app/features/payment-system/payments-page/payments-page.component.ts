import { Component, inject } from '@angular/core';
import { GenericFilterComponent } from "../../../shared/generic-filter/component/generic-filter.component";
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments-page',
  imports: [GenericFilterComponent, GenericTableComponent, MatButton],
  templateUrl: './payments-page.component.html',
  styleUrl: './payments-page.component.scss'
})
export class PaymentsPageComponent {
  private router = inject(Router);

  currentPage : number = 0;
  totalPages : number = 0;


  paymentColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'paymentId', label: 'Id Платежу' },
    { key: 'clientName', label: 'Клієнт' },
    { key: 'contractName', label: 'Контракт' },
    { key: 'statusDisplay', label: 'Status' }
  ];

  paymentFilterConfig: FilterField[] = [
    { 
      key: 'clientId', 
      label: 'Клієнти', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'contractId', 
      label: 'Контракти', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'paymentDateRange', 
      label: 'Date Range', 
      type: 'date-range' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select', 
      options: [
        { value: 0, display: 'Оплачено' },    // 0 замість 'Inactive'
        { value: 1, display: 'Незаплачено' },      // 1 замість 'Active'
      ] 
    }
  ];

  paymentItems: [] = [];

  rowIdKeyForPayments = 'id';

  openAddPaymentDocumentDialog() {
    // Перенаправляємо користувача на сторінку додавання
    this.router.navigate(['workflow/payments/add-bill']);
  }

  applyFilter(event: any) {
  }

    onItemSelected(item: any) {
    console.log('Selected contract:', item);
    // this.router.navigate(['/contracts/details', item.contractId])
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    } else {
      console.warn('Ви вже на першій сторінці!');
    } 
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    } else {
      console.warn('Ви вже на останній сторінці!');
    }
  }

}

