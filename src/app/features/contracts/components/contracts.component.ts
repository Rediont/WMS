import { Component, inject } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table-component/app-table.component';
import { TableColumn } from '../../../shared/generic-table-component/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ContractObject } from '../models/contract.model';
import { ContractService } from '../contract.service';

@Component({
    selector: 'app-contracts',
    imports: [GenericTableComponent, MatButton],
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

  onItemSelected(item: any) {
    console.log('Selected contract:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }
}
