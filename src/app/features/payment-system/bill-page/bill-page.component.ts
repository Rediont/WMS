import { Component, computed, inject, signal } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generic-table/app-table.component';
import { BillDto, BillItem } from '../../../core/models/payment.interfaces';
import { Client } from '../../clients/models/client.model';
import { Contract } from '../../contracts/models/contract.model';
import { PaymentService } from '../payment.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ClientService } from '../../clients/client.service';
import { ContractService } from '../../contracts/contract.service';
import { firstValueFrom } from 'rxjs';
import { AppStateService } from '../../../core/state.service/state.service';
import { ContractLookupItem, LookupItem } from '../../../core/state.service/lookup.model';

@Component({
  selector: 'app-bill-page',
imports: [
    GenericTableComponent,
    FormsModule, 
    CommonModule, 
    MatFormFieldModule,  
    MatInputModule,       
    MatSelectModule,      
    MatDatepickerModule,  
    MatNativeDateModule,  
    MatButtonModule,      
    MatIconModule         
  ],
  templateUrl: './bill-page.component.html',
  styleUrl: './bill-page.component.scss'
})
export class BillPageComponent {
  private router = inject(Router);
  
  clients = signal<LookupItem[]>([]);
  allContracts = signal<ContractLookupItem[]>([]);
  


  filters = {
    clientId: null as number | null,
    contractId: null as number | null,
    periodStart: '',
    periodEnd: ''
  };

  billData = signal<BillDto | null>(null);

  filteredContracts = computed(() => {
    const selectedClientId = this.filters.clientId;
    return this.allContracts().filter(c => c.clientId === selectedClientId);
  });

  tableColumns : TableColumn[] = [
    { key: 'palletTypeId', label: 'ID Типу' },
    { key: 'palletTypeName', label: 'Тип палети' }, // Бажано додати назву в BillItem
    { key: 'amountOfDays', label: 'Палето-дні' },
    { key: 'costPerDay', label: 'Ціна за добу' },
    { key: 'totalCost', label: 'Сума' }
  ];

  billDataRowIdKey = 'palletTypeId';

  constructor(
    private paymentService: PaymentService, 
    private clientService : ClientService,
    private contractService : ContractService,
    private stateService : AppStateService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    var clientsData = this.stateService.lookups.clients;
    this.clients.set(clientsData ?? []);

    var contractsData = this.stateService.lookups.contracts;
    this.allContracts.set(contractsData ?? []);
  }

  onClientChange() {
    // Скидаємо обраний контракт, якщо змінили клієнта
    this.filters.contractId = null;
    this.billData.set(null);
    this.allContracts.set([...this.allContracts()]);
  }

  async calculateBill() {
    if (this.isFiltersValid()) {
      try {
        const result = await firstValueFrom (this.paymentService.CalculateContractBillForClient(
          this.filters.clientId!,
          this.filters.contractId!,
          new Date(this.filters.periodStart),
          new Date(this.filters.periodEnd)
        ));
        
        this.billData.set(result ?? null);
      } catch (error) {
        console.error('Помилка при розрахунку:', error);
        alert('Не вдалося провести розрахунок за вказаний період');
      }
    }
  }

  async saveBill() {
    const data = this.billData();
    if (data) {
      try {
        // Обов'язково додаємо await і перетворюємо в Promise
        await firstValueFrom(this.paymentService.save(data));
        
        alert('Чек успішно збережено!');
        this.cancel(); // Повернення на сторінку платіжок
      } catch (error) {
        console.error('Помилка при збереженні:', error);
        alert('Не вдалося зберегти чек. Перевірте консоль бекенда.');
      }
    }
  }

  cancel() {
    this.router.navigate(['workflow/payments']);
  }

  reset() {
    this.billData.set(null);
    this.filters.clientId = null;
    this.filters.contractId = null;
    this.filters.periodStart = '';
    this.filters.periodEnd = '';
  }

  private isFiltersValid(): boolean {
    return !!(this.filters.clientId && 
              this.filters.contractId && 
              this.filters.periodStart && 
              this.filters.periodEnd);
  }
}
