import { Component, inject, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ApiContractObject, ContractObject } from '../models/contract.model';
import { ContractService } from '../contract.service';
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { GenericFilterComponent } from '../../../shared/generic-filter/component/generic-filter.component';
import { AppStateService } from '../../../core/state.service/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormConfig } from '../../../shared/dynamic-form/models/dynamic-form.model';
import { Validators } from '@angular/forms';
import { DynamicFormDialogComponent } from '../../../shared/dynamic-form/dynamic-form-component/dynamic-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-contracts',
    imports: [GenericTableComponent, MatButton, GenericFilterComponent],
    templateUrl: './contracts.component.html',
    styleUrl: './contracts.component.scss'
})
export class ContractsComponent {

  private dialog = inject(MatDialog);
  private contractService = inject(ContractService);
  private appState = inject(AppStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Отримуємо доступ до компонента фільтра, щоб програмно викликати apply()
  @ViewChild(GenericFilterComponent) filterComponent!: GenericFilterComponent;

  currentPage : number = 0;
  totalPages : number = 0;


  contractColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'contractId', label: 'Contract ID' },
    { key: 'contractName', label: 'Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'statusDisplay', label: 'Status' }
  ];

  contractFilterConfig: FilterField[] = [
    { 
      key: 'clientId', 
      label: 'Client', 
      type: 'select', 
      options: [] 
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

  contractItems: ContractObject[] = [];

  rowIdKeyForContracts = 'id';
  
  contractFormConfig: FormConfig = {
    title: 'Додати новий контракт',
    submitText: 'Зберегти',
    fields: [
      {
        // ДОДАНО: Поле для вибору клієнта
        key: 'clientId',
        label: 'Клієнт',
        type: 'select',
        validators: [Validators.required],
        options: [] // Поки що порожньо, наповнимо в ngOnInit
      },
      {
        key: 'name',
        label: 'Назва контракту',
        type: 'text',
        validators: [Validators.required, Validators.minLength(3)]
      },
      {
        key: 'currentStatus',
        label: 'Поточний статус',
        type: 'select',
        validators: [Validators.required],
        options: [
          { value: 0, label: 'Неактивний' },
          { value: 1, label: 'Активний' },
          { value: 2, label: 'Розірваний' },
          { value: 3, label: 'Завершений' },
          { value: 4, label: 'Недійсний' }
        ],
        // Можеш встановити статус за замовчуванням (наприклад, одразу "Активний")
        defaultValue: 1 
      }
    ]
  };

  ngOnInit() {
    this.populateClientFilter();
    this.populateClientFormOptions();

    this.contractService.getTotalPages().subscribe({
      next: (pages) => {
        this.totalPages = pages;
        console.log('Total pages:', this.totalPages);
      },
      error: (err) => console.error('Помилка отримання кількості сторінок:', err)
    });

    this.route.queryParams.subscribe(params => {
      if (params['clients']) {
        // Беремо ID першого клієнта з URL (оскільки у нас звичайний select)
        const clientIdFromUrl = Number(params['clients'].split(',')[0]);

        setTimeout(() => {
          this.setInitialFilters(clientIdFromUrl);
        });

      } else {
        const statusMap: { [key: number]: string } = {
          0: 'Inactive',
          1: 'Active',
          2: 'Terminated',
          3: 'Completed',
          4: 'Invalid'
        };

        this.contractItems = this.appState.lookups.contracts.map(c => ({

          contractId: c.id,
          contractName: c.contractName,
          clientId: c.clientId,
          clientName: c.clientName,
          statusDisplay: statusMap[c.status] ?? 'Unknown',
          
        }));
      }
    });
  }

  // Виніс завантаження контрактів в окремий метод для зручності
  private loadAllContracts( page: number = 0) {
    this.contractService.getContracts(page).subscribe({
      next: (contracts) => {
        console.log('Дані, що прийшли з бекенду:', contracts);

        // Словник, де 0 — це Inactive (згідно з твоїм C# Enum)
        const statusMap: { [key: number]: string } = {
          0: 'Inactive',
          1: 'Active',
          2: 'Terminated',
          3: 'Completed',
          4: 'Invalid'
        };

        this.contractItems = contracts.map(c => {
          // Перевіряємо, чи є в об'єкті clientName (для дебагу)
          if (!c.clientName) {
            console.warn(`Контракт ID ${c.id} прийшов без імені клієнта!`);
          }

          return {
            ...c,
            // Створюємо окреме текстове поле, яке таблиця точно відобразить
            statusDisplay: statusMap[c.status] ?? 'Unknown'
          };
        });
      },
      error: (err) => console.error('Помилка завантаження:', err)
    });
  }

  private populateClientFilter() {
    // Перетворюємо масив клієнтів з бекенду у формат { value, display }, який розуміє наш фільтр
    const clientOptions = this.appState.lookups.clients.map(client => ({
      value: client.id,
      display: client.name
    }));

    // Оновлюємо конфігурацію фільтра (важливо робити це через .map(), щоб Angular помітив зміни)
    this.contractFilterConfig = this.contractFilterConfig.map(field => {
      if (field.key === 'clientId') {
        return { ...field, options: clientOptions };
      }
      return field;
    });
  }

  private populateClientFormOptions() {
    const clientOptions = this.appState.lookups.clients.map(client => ({
      value: client.id,
      label: client.name
    }));

    // 2. Знаходимо поле 'clientId' у конфігурації форми і оновлюємо його options
    this.contractFormConfig.fields = this.contractFormConfig.fields.map(field => {
      if (field.key === 'clientId') {
        return { ...field, options: clientOptions };
      }
      return field;
    });
  }

  private setInitialFilters(clientId: number) {
    if (this.filterComponent && this.filterComponent.filterForm) {
      const clientControl = this.filterComponent.filterForm.get('clientId');
      
      if (clientControl) {
        // Встановлюємо значення у випадаючий список
        clientControl.setValue(clientId);
        
        // Автоматично натискаємо "Apply" (це викличе метод applyFilter нижче)
        this.filterComponent.applyFilters();
      }
    }
  }

  applyFilter(filterValues: any) {
    console.log('Дані з фільтра:', filterValues);
  }

  openAddContractDialog() {
    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      width: '450px',
      data: this.contractFormConfig,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Новий контракт:', result);

        const apiPayload: ApiContractObject = {
          clientId: Number(result.clientId),
          name: result.name,        
          currentStatus: Number(result.currentStatus)
        };

        this.contractService.addContract(apiPayload).subscribe({
          next: (createdContract) => {
            // Оскільки createdContract приходить з бекенду (можливо без clientName і statusDisplay),
            // нам треба його "домапити" для таблиці, щоб він одразу красиво з'явився
            
            const statusMap: { [key: number]: string } = {
              0: 'Inactive',
              1: 'Active', 
              2: 'Terminated', 
              3: 'Completed', 
              4: 'Invalid'
            };
            
            // Шукаємо ім'я клієнта у словнику, щоб показати в таблиці
            const matchedClient = this.appState.lookups.clients.find(c => c.id == createdContract.clientId);
            
            const newTableItem: ContractObject = {
              contractId: createdContract.contractId,
              contractName: createdContract.contractName, // або createdContract.name залежно від того що повертає DTO після створення
              clientId: createdContract.clientId,
              clientName: matchedClient ? matchedClient.name : 'Невідомий клієнт',
              statusDisplay: statusMap[apiPayload.currentStatus] ?? 'Unknown',
            };

            this.contractItems = [...this.contractItems, newTableItem];
            console.log('Контракт успішно створений та доданий в таблицю:', newTableItem);
          }
        });
      }
    });
  }

  onItemSelected(item: any) {
    console.log('Selected contract:', item);
    this.router.navigate(['/contracts/details', item.contractId])
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAllContracts(this.currentPage); 
    } else {
      console.warn('Ви вже на першій сторінці!');
    } 
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAllContracts(this.currentPage); // Підвантажуємо контракти для нової сторінки
    } else {
      console.warn('Ви вже на останній сторінці!');
    }
  }

}
