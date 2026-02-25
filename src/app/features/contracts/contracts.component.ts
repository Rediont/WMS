import { Component } from '@angular/core';
import { GenericTableComponent } from '../../shared/generic-table-component/app-table.component';
import { TableColumn } from '../../shared/generic-table-component/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'app-contracts',
    imports: [GenericTableComponent, MatButton],
    templateUrl: './contracts.component.html',
    styleUrl: './contracts.component.scss'
})
export class ContractsComponent {

  contractColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Contract ID' },
    { key: 'name', label: 'Name' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'status', label: 'Status' }
  ];

  contractItems: any[] = [
    { index: 1, id: 'P001', name: 'Contract A', clientId: 'C001', status: 'Active' },
    { index: 2, id: 'P002', name: 'Contract B', clientId: 'B2', status: 'Active' },
    { index: 3, id: 'P003', name: 'Contract C', clientId: 'C3', status: 'Inactive' }
  ];

  rowIdKeyForContracts = 'id';

  onItemSelected(item: any) {
    console.log('Selected contract:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }
}
