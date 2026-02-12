import { Component } from '@angular/core';
import { TableColumn } from '../../shared/table-config.model';
import { GenericTableComponent } from "../../shared/app-table.component";

@Component({
    selector: 'app-clients',
    imports: [GenericTableComponent],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    inventoryColumns: TableColumn[] = [
      { key: 'index', label: '№' },
      { key: 'id', label: 'Pallet ID' },
      { key: 'name', label: 'Name' },
      { key: 'alley', label: 'Alley Location' },
      { key: 'type', label: 'Material Type' }
    ];

    inventoryItems: any[] = [];

    onItemSelected(item: any) {
      console.log('Selected client:', item);
    }

}
