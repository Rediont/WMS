import { Component, inject } from '@angular/core';
import { GenericFilterComponent } from "../../../shared/generic-filter/component/generic-filter.component";
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/state.service/state.service';
import { BillRecordDto } from '../models/bill.model';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payments-page',
  imports: [GenericFilterComponent, GenericTableComponent, MatButton],
  templateUrl: './payments-page.component.html',
  styleUrl: './payments-page.component.scss'
})
export class PaymentsPageComponent {
  private router = inject(Router);
  private stateService = inject(AppStateService);
  private paymentService = inject(PaymentService);

  currentPage : number = 0;
  totalPages : number = 0;


  paymentColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Id Платежу' },
    { key: 'clientName', label: 'Клієнт' },
    { key: 'contractName', label: 'Контракт' },
    { key: 'isPaid', label: 'Status' },
    { key: 'total', label: 'Сума' },
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

  paymentItems: BillRecordDto[] = [];

  rowIdKeyForPayments = 'id';

  ngOnInit() {
    const clientOptions = this.stateService.lookups.clients.map(client => ({ value: client.id, display: client.name }));
    const clientFilter = this.paymentFilterConfig.find(f => f.key === 'clientId');
    if (clientFilter) {
      clientFilter.options = clientOptions;
    }

    const contractOptions = this.stateService.lookups.contracts.map(contract => ({ value: contract.id, display: contract.contractName }));
    const contractFilter = this.paymentFilterConfig.find(f => f.key === 'contractId');
    if (contractFilter) {
      contractFilter.options = contractOptions;
    }

    this.loadPayments(this.currentPage);
  }

  loadPayments(page: number) {
    this.paymentService.loadPayments(page).subscribe({
      next: (response: BillRecordDto[]) => {
        console.log('Payments loaded:', response);
        this.paymentItems = response;
      },
      error: (err) => {
        console.error('Помилка завантаження платежів:', err);
      }
    });

  }

  openAddPaymentDocumentDialog() {
    // Перенаправляємо користувача на сторінку додавання
    this.router.navigate(['workflow/payments/add-bill']);
  }

  applyFilter(event: any) {
  }
    onItemSelected(item: any) {
    console.log('Selected contract:', item);
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

