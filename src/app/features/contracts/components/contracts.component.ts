import { Component, inject, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ApiContractObject, Contract, FilteredContract } from '../models/contract.model';
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
    { key: 'contractId', label: 'ID контракту' },
    { key: 'contractName', label: 'Назва контракту' },
    { key: 'clientName', label: 'Ім\'я клієнта' },
    { key: 'statusDisplay', label: 'Статус' }
  ];

  contractFilterConfig: FilterField[] = [
    { 
      key: 'clientId', 
      label: 'Клієнт', 
      type: 'select', 
      options: [] 
    },
    { 
      // Змінено ключ та тип для фільтрації по проміжку часу (З - По)
      key: 'contractDateRange', 
      label: 'Діапазон дат', 
      type: 'date-range' 
    },
    { 
      key: 'status', 
      label: 'Статус контракту', 
      type: 'select', 
      options: [
        //статуси контракту
        { value: 0, display: 'Неактивний' },    // 0 замість 'Inactive'
        { value: 1, display: 'Активний' },      // 1 замість 'Active'
        { value: 2, display: 'Розірваний' },  // 2 замість 'Terminated'
        { value: 3, display: 'Завершений' },   // 3 замість 'Completed'
        { value: 4, display: 'Недійсний' }      // 4 замість 'Invalid'
      ] 
    }
  ];

  contractItems: Contract[] = [];

  rowIdKeyForContracts = 'contractId';
  
  contractFormConfig: FormConfig = {
    title: 'Додати новий контракт',
    submitText: 'Зберегти',
    fields: [
      {
        key: 'clientId',
        label: 'Клієнт',
        type: 'select',
        validators: [Validators.required],
        options: [] 
      },
      {
        key: 'name',
        label: 'Назва контракту',
        type: 'text',
        validators: [Validators.required, Validators.minLength(3)]
      },
      {
        key: 'startDate',
        label: 'Дата початку',
        type: 'date',
        validators: [Validators.required],
        defaultValue: new Date().toISOString().substring(0, 10) // Сьогодні
      },
      {
        key: 'endDate',
        label: 'Дата закінчення',
        type: 'date',
        validators: [Validators.required]
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
          1: 'Неактивний',
          2: 'Активний',
          3: 'Розірваний',
          4: 'Завершений',
          5: 'Недійсний'
        };

        this.contractItems = this.appState.lookups.contracts.map(c => ({
          
          contractId: c.id,
          contractName: c.contractName,
          clientId: c.clientId,
          clientName: c.clientName,
          statusDisplay: statusMap[c.status + 1] ?? 'Unknown',
          
        }));
      }
    });
  }

  private loadAllContracts( page: number = 0) {
    this.contractService.getContracts(page).subscribe({
      next: (contracts) => {
        console.log('Дані, що прийшли з бекенду:', contracts);

        const statusMap: { [key: number]: string } = {
          1: 'Неактивний',
          2: 'Активний',
          3: 'Розірваний',
          4: 'Завершений',
          5: 'Недійсний'
        };

        this.contractItems = contracts.map(c => {
          if (!c.clientName) {
            console.warn(`Контракт ID ${c.id} прийшов без імені клієнта!`);
          }

          return {
            ...c,
            statusDisplay: statusMap[c.status + 1] ?? 'Unknown'
          };
        });
      },
      error: (err) => console.error('Помилка завантаження:', err)
    });
  }

  private populateClientFilter() {
    const clientOptions = this.appState.lookups.clients.map(client => ({
      value: client.id,
      display: client.name
    }));

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
        clientControl.setValue(clientId);
        
        // Автоматично натискаємо "Apply" (це викличе метод applyFilter нижче)
        this.filterComponent.applyFilters();
      }
    }
  }

  applyFilter(filterValues: FilteredContract[]) {
    console.log('Дані з фільтра:', filterValues);
    this.contractService.getContracts(this.currentPage, filterValues).subscribe({
      next: (contracts) => {
        console.log('Відфільтровані дані:', contracts);
        const statusMap: { [key: number]: string } = {
          1: 'Inactive',
          2: 'Active',
          3: 'Terminated',
          4: 'Completed',
          5: 'Invalid'
        };
        this.contractItems = contracts.map(c => ({
          ...c,
          statusDisplay: statusMap[c.currentStatus + 1] ?? 'Unknown'
        }));
      },
      error: (err) => console.error('Помилка застосування фільтра:', err)
    });
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
          currentStatus: Number(result.currentStatus),
          StartDate: result.startDate,
          EndDate: result.endDate
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
            
            const matchedClient = this.appState.lookups.clients.find(c => c.id == createdContract.clientId);
            
            const newTableItem: Contract = {
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
    this.router.navigate(['/workflow/contracts/details', item.contractId])
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
