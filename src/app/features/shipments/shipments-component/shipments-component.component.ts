import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { MatButton } from '@angular/material/button';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatDivider } from '@angular/material/divider';
import { GenericFilterComponent } from "../../../shared/generic-filter/component/generic-filter.component";
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';

@Component({
  selector: 'app-shipments-component',
  imports: [GenericTableComponent, MatButton, GenericFilterComponent],
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

  shipmentFilterConfig: FilterField[] = [
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
    console.log('Selected shipment:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected shipments changed:', selectedItems);
  }

  applyFilter(filterValues: any) {
    console.log('Дані з фільтра:', filterValues);
    // Тут буде логіка відправки запиту на C# бекенд або фільтрації локального масиву
  }
}
