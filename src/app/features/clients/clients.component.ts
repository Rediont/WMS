import { Component } from '@angular/core';
import { TableColumn } from '../../shared/generic.table.component/table-config.model';
import { GenericTableComponent } from "../../shared/generic.table.component/app-table.component";

@Component({
    selector: 'app-clients',
    imports: [GenericTableComponent],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    clientColumns: TableColumn[] = [
      { key: 'index', label: '№' },
      { key: 'id', label: 'Client ID' },
      { key: 'name', label: 'Name' },
      { key: 'alley', label: 'Contact Person' },
      { key: 'type', label: 'Phone Number'},
      { key: 'email', label: 'Email'}
    ];

    rowIdKeyForClients = 'id';

    clientItems: any[] = [];

    onItemSelected(item: any) {
      console.log('Selected client:', item);
    }

}
