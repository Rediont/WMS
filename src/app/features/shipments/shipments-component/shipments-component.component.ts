import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table-component/app-table.component';
import { MatButton } from '@angular/material/button';
import { TableColumn } from '../../../shared/generic-table-component/table-config.model';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-shipments-component',
  imports: [GenericTableComponent, MatButton],
  templateUrl: './shipments-component.component.html',
  styleUrl: './shipments-component.component.scss'
})
export class ShipmentsComponent {

  shipmentColumns : TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Shipment ID' },
    { key: 'date', label: 'Date' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'status', label: 'Status' }
  ];

  shipmentItems: any[] = []

  rowIdKeyForShipments = 'id';

  onItemSelected(item: any) {
    console.log('Selected shipment:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected shipments changed:', selectedItems);
  }
}
