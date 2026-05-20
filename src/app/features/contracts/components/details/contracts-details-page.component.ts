import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../contract.service';
import { DetailsConfig } from '../../../../shared/dynamic-details/models/detail-config.model';
import { DynamicDetailsComponent } from '../../../../shared/dynamic-details/dynamic-details/dynamic-details.component';
import { GenericTableComponent } from "../../../../shared/generic-table/app-table.component";
import { TableColumn } from '../../../../shared/generic-table/table-config.model';

@Component({
  selector: 'app-contract-details-page',
  imports: [DynamicDetailsComponent, GenericTableComponent],
  template: `
    @if (isLoading) {
    <div>Завантаження...</div>
    } @else if (contractData) {
    <app-dynamic-details 
        [config]="contractDetailsConfig" 
        [data]="contractData"
        [extraData]="documentList"
        (actionClicked)="handleAction($event)">
        
      <div class="extra-section" style="margin-top: 20px;">
        <h3>Документи за цим контрактом</h3>
        
        <app-table 
          [data]="documentList" 
          [columns]="documentColumns" 
          rowIdKey="id">
        </app-table>
      </div>

    </app-dynamic-details>
    }
  `
})
export class ContractDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);

  isLoading = true;
  contractData: any;
  documentList: any[] = [];

  // КОНФІГУРАЦІЯ ДЛЯ КОНТРАКТУ
  contractDetailsConfig: DetailsConfig = {
    title: 'Картка Контракту',
    fields: [
      { key: 'id', label: 'ID Контракту' },
      { key: 'contractName', label: 'Назва' },
      { key: 'startDate', label: 'Дата початку', type: 'date' },
      { key: 'currentStatus', label: 'Статус', type: 'badge' }
    ],
    actions: [
      { actionId: 'edit', label: 'Редагувати', color: 'accent' },
      { actionId: 'terminate', label: 'Розірвати', color: 'warn' },
      { actionId: 'back', label: 'Повернутись', color: 'primary' }
    ]
  };

  documentColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'documentType', label: 'Тип' }, 
    { key: 'creationDate', label: 'Дата створення' }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFullContractInfo(Number(id));
    }
  }

  mapContractStatus(status: number | string): string {
    const statusMap: Record<string, string> = {
      '0': 'Неактивний',
      '1': 'Активний',
      '2': 'Розірваний',
      '3': 'Завершений',
      '4': 'Недійсний',
      'Inactive': 'Неактивний',
      'Active': 'Активний',
      'Terminated': 'Розірваний',
      'Completed': 'Завершений',
      'Invalid': 'Недійсний'
    };

    // Перетворюємо вхідне значення на рядок і шукаємо в словнику
    return statusMap[status?.toString()] || 'Невідомий статус';
  }

  loadFullContractInfo(id: number) {
    this.isLoading = true;
    
    this.contractService.getContractDetails(id).subscribe({
      next: (data) => {
        console.log('Отримані деталі контракту:', data);
        this.contractData = {
          id: data.id,
          contractName: data.contractName,
          startDate: data.startDate,
          currentStatus: this.mapContractStatus(data.currentStatus),
          clientName: data.clientName,
        };

        this.documentList = data.documents; 
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Помилка завантаження контракту', err);
        this.isLoading = false;
      }
    });
  }

  handleAction(actionId: string) {
    switch (actionId) {
      case 'back':
        this.router.navigate(['workflow/contracts']);
        break;
      case 'edit':
        // Відкрити діалог редагування
        console.log('Редагуємо', this.contractData.id);
        break;
      case 'terminate':
        // Виклик API для зміни статусу
        console.log('Розірвання контракту!');
        break;
    }
  }
}