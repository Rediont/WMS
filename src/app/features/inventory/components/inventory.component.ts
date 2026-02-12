import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import { TableColumn } from "../../../shared/table-config.model";
import { GenericTableComponent } from '../../../shared/app-table.component';

@Component({
    selector: 'app-inventory',
    imports: [ MatDividerModule, GenericTableComponent],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  // Наші дані
  inventoryItems = [
    { id: 101, name: 'Box A', alley: 'A1', type: 'Wood' },
    { id: 102, name: 'Box B', alley: 'B2', type: 'Plastic' },
    { id: 103, name: 'Box C', alley: 'C3', type: 'Metal' },
    { id: 104, name: 'Box D', alley: 'D4', type: 'Glass' },
    { id: 105, name: 'Box E', alley: 'E5', type: 'Cardboard' },
    { id: 106, name: 'Box F', alley: 'F6', type: 'Paper' },
    { id: 107, name: 'Box G', alley: 'G7', type: 'Foam' },
    { id: 108, name: 'Box H', alley: 'H8', type: 'Wood' },
    { id: 109, name: 'Box I', alley: 'I9', type: 'Plastic' },
    { id: 110, name: 'Box J', alley: 'J10', type: 'Metal' },
    { id: 111, name: 'Box K', alley: 'K11', type: 'Glass' },
    { id: 112, name: 'Box L', alley: 'L12', type: 'Cardboard' }
  ];

  // Конфігурація колонок САМЕ для інвентарю
  inventoryColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Pallet ID' },
    { key: 'name', label: 'Name' },
    { key: 'alley', label: 'Alley Location' },
    { key: 'type', label: 'Material Type' }
  ];

  onItemSelected(item: any) {
    console.log('Selected inventory:', item);
  }
}
