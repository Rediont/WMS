import { Component, inject } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ContractObject } from '../models/contract.model';
import { ContractService } from '../contract.service';
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { GenericFilterComponent } from '../../../shared/generic-filter/component/generic-filter.component';

@Component({
    selector: 'app-contracts',
    imports: [GenericTableComponent, MatButton, GenericFilterComponent],
    templateUrl: './contracts.component.html',
    styleUrl: './contracts.component.scss'
})
export class ContractsComponent {

  private contractService = inject(ContractService);

  contractColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Contract ID' },
    { key: 'name', label: 'Name' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'status', label: 'Status' }
  ];

  contractFilterConfig: FilterField[] = [
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


  contractItems: ContractObject[] = [];

  rowIdKeyForContracts = 'id';

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      next: (contracts) => {
        this.contractItems = contracts;
      },
      error: (err) => {
        console.error('Error loading contracts:', err);
      }
    });
  }

  applyFilter(filterValues: any) {
    console.log('Дані з фільтра:', filterValues);
    // Тут буде логіка відправки запиту на C# бекенд або фільтрації локального масиву
  }

  onItemSelected(item: any) {
    console.log('Selected contract:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }
}
