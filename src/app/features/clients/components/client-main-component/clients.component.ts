import { Component, inject } from '@angular/core';
import { TableColumn } from '../../../../shared/generic-table-component/table-config.model';
import { GenericTableComponent } from "../../../../shared/generic-table-component/app-table.component";
import { ClientObject } from '../../models/client.model';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogWrapperComponent } from '../client-form/client-dialog-wrapper.component';
import { MatDivider } from '@angular/material/divider';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
    selector: 'app-clients',
    imports: [GenericTableComponent, MatButton, MatDivider, A11yModule],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
    private dialog = inject(MatDialog);

    clientColumns: TableColumn[] = [
      { key: 'index', label: '№' },
      { key: 'id', label: 'Client ID' },
      { key: 'name', label: 'Name' },
      { key: 'alley', label: 'Contact Person' },
      { key: 'type', label: 'Phone Number'},
      { key: 'email', label: 'Email'}
    ];

    rowIdKeyForClients = 'id';

    clientItems: ClientObject[] = [];

    onItemSelected(item: any) {
      console.log('Selected client:', item);
    }

    openAddDialog() {
      const dialogRef = this.dialog.open(ClientDialogWrapperComponent, {
        width: '400px',
        data: null, // Даних немає -> Режим створення
        disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: ClientObject | null) => {
      if (result) {
        console.log('Creating new client:', result);
        // Тут логіка додавання (id генеруємо для прикладу)
        this.clientItems.push({...result});
      }
    });
  }

}
