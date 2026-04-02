import { Component, inject, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { ContractObject } from '../models/contract.model';
import { ContractService } from '../contract.service';
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { GenericFilterComponent } from '../../../shared/generic-filter/component/generic-filter.component';
import { AppStateService } from '../../../core/state.service/state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-contracts',
    imports: [GenericTableComponent, MatButton, GenericFilterComponent],
    templateUrl: './contracts.component.html',
    styleUrl: './contracts.component.scss'
})
export class ContractsComponent {

  private contractService = inject(ContractService);
  private appState = inject(AppStateService);
  private route = inject(ActivatedRoute); // ДОДАНО: для читання URL

  // Отримуємо доступ до компонента фільтра, щоб програмно викликати apply()
  @ViewChild(GenericFilterComponent) filterComponent!: GenericFilterComponent;

  contractColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Contract ID' },
    { key: 'name', label: 'Name' },
    { key: 'clientId', label: 'Client ID' },
    { key: 'status', label: 'Status' }
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

ngOnInit() {
    this.populateClientFilter();

    // Замість простого завантаження всіх контрактів, ми підписуємося на URL параметри
    this.route.queryParams.subscribe(params => {
      
      // Перевіряємо, чи є параметр 'clients' (наприклад, ?clients=5)
      if (params['clients']) {
        // Беремо ID першого клієнта з URL (оскільки у нас звичайний select)
        const clientIdFromUrl = Number(params['clients'].split(',')[0]);

        // Чекаємо мікросекунду, щоб ViewChild (компонент фільтра) встиг ініціалізуватися
        setTimeout(() => {
          this.setInitialFilters(clientIdFromUrl);
        });

      } else {
        // Якщо параметрів немає, просто вантажимо всі контракти
        this.loadAllContracts();
      }
    });
  }

  // Виніс завантаження контрактів в окремий метод для зручності
  private loadAllContracts() {
    this.contractService.getContracts().subscribe({
      next: (contracts) => {
        this.contractItems = contracts;
      },
      error: (err) => {
        console.error('Error loading contracts:', err);
      }
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
    // Тут буде логіка відправки запиту на C# бекенд або фільтрації локального масиву
  }

  onItemSelected(item: any) {
    console.log('Selected contract:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected contracts changed:', selectedItems);
  }
}
