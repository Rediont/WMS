import { Component, inject } from '@angular/core';
import { TableColumn } from '../../../../shared/generic-table/table-config.model';
import { GenericTableComponent } from "../../../../shared/generic-table/app-table.component";
import { ClientObject } from '../../models/client.model';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogWrapperComponent } from '../client-form/client-dialog-wrapper.component';
import { MatDivider } from '@angular/material/divider';
import { A11yModule } from "@angular/cdk/a11y";
import { ClientService } from '../../client.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-clients',
    imports: [GenericTableComponent, MatButton, A11yModule],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  private dialog = inject(MatDialog);
  private clientService = inject(ClientService);
  private router = inject(Router);

  selectedClientIds: number[] = [];

  clientColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Client ID' },
    { key: 'name', label: 'Name' },
    { key: 'contactPersonName', label: 'Contact Person' },
    { key: 'contactPersonPhone', label: 'Phone Number'},
    { key: 'email', label: 'Email'}
  ];

  rowIdKeyForClients = 'id';

  clientItems: ClientObject[] = [];

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clientItems = clients;
      },
      error: (err) => {
        console.error('Помилка завантаження клієнтів:', err);
      }
    });
  }

  onItemSelected(item: any) {
    console.log('Selected client:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Вибрані клієнти (повні об\'єкти):', selectedItems);
    
    this.selectedClientIds = selectedItems.map(item => item.id);
    
    console.log('Записані ID для фільтра:', this.selectedClientIds);
  }

  goToContracts() {
    // Якщо ніхто не вибраний, просто переходимо
    if (this.selectedClientIds.length === 0) {
      this.router.navigate(['/contracts']);
      return;
    }

    // Передаємо масив ID як кому-розділений рядок (query param)
    this.router.navigate(['/contracts'], { 
      queryParams: { clients: this.selectedClientIds.join(',') } 
    });
    // URL буде виглядати так: /contracts?clients=1,5,12
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
        this.clientService.addClient(result).subscribe({
          next: (createdClient) => {
            this.clientItems.push(createdClient);
            console.log('Client created successfully:', createdClient);
          }
        });
      }
    });
  }

}
