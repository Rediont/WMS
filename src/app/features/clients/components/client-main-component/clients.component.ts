import { Component, inject } from '@angular/core';
import { TableColumn } from '../../../../shared/generic-table/table-config.model';
import { GenericTableComponent } from "../../../../shared/generic-table/app-table.component";
import { Client } from '../../models/client.model';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { A11yModule } from "@angular/cdk/a11y";
import { ClientService } from '../../client.service';
import { Router } from '@angular/router';
import { FormConfig } from '../../../../shared/dynamic-form/models/dynamic-form.model';
import { Validators } from '@angular/forms';
import { DynamicFormDialogComponent } from '../../../../shared/dynamic-form/dynamic-form-component/dynamic-form-dialog.component';

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

  currentPage : number = 0;
  totalPages : number = 0;


  selectedClientIds: number[] = [];

  clientColumns: TableColumn[] = [
    { key: 'id', label: 'ID клієнта' },
    { key: 'name', label: 'Назва' },
    { key: 'contactPersonName', label: 'Контактна особа' },
    { key: 'contactPersonPhone', label: 'Номер телефону'},
    { key: 'email', label: 'Пошта'}
  ];

  rowIdKeyForClients = 'id';

  clientItems: Client[] = [];

  clientFormConfig: FormConfig = {
    title: 'Додати нового клієнта',
    submitText: 'Зберегти',
    fields: [
      {
        key: 'edrpo', // Або як воно у тебе називається в моделі
        label: 'ЄДРПОУ',
        type: 'text',
        validators: [Validators.required, Validators.pattern('^[0-9]{8,10}$')] // Валідація: 8-10 цифр
      },
      {
        key: 'name',
        label: 'Назва компанії',
        type: 'text',
        validators: [Validators.required]
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email]
      },
      {
        key: 'contactPersonName',
        label: 'Контактна особа',
        type: 'text',
        validators: [Validators.required]
      },
      {
        key: 'contactPersonPhone',
        label: 'Телефон',
        type: 'text',
        validators: [Validators.required]
      }
    ]
  };


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
    if (this.selectedClientIds.length === 0) {
      this.router.navigate(['/contracts']);
      return;
    }

    this.router.navigate(['/contracts'], { 
      queryParams: { clients: this.selectedClientIds.join(',') } 
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      width: '500px',
      data: this.clientFormConfig,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: Client | null) => {
      if (result) {
        console.log('Creating new client:', result);
        this.clientService.addClient(result).subscribe({
          next: (createdClient) => {
            this.clientItems = [...this.clientItems, createdClient];
            console.log('Client created successfully:', createdClient);
          }
        });
      }
    });
  }

  loadAllClients(page: number = 0) {
    this.clientService.getClients(page).subscribe({
      next: (clients) => {
        this.clientItems = clients; 
      },
      error: (err) => {
        console.error('Помилка завантаження клієнтів:', err);
      }
    });
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAllClients(this.currentPage);
    } else {
      console.warn('Ви вже на першій сторінці!');
    }

  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAllClients(this.currentPage);
    } else {
      console.warn('Ви вже на останній сторінці!');
    }
  }

}
