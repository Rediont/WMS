import { Component, inject } from '@angular/core';
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { MatCheckbox } from "@angular/material/checkbox";
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WarehouseRemainsService } from '../warehouse-remains.service';
import { WarehouseRemainsObject } from '../models/warehouse-remains-model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-warehouse-remains',
  imports: [GenericTableComponent, MatCheckbox, MatButton, ReactiveFormsModule],
  templateUrl: './warehouse-remains.component.html',
  styleUrl: './warehouse-remains.component.scss'
})
export class WarehouseRemainsComponent {
  private fb = inject(FormBuilder);
  private warehouseRemainsService = inject(WarehouseRemainsService);

  filterForm! : FormGroup;

  currentPage : number = 0;
  totalPages : number = 0;

  warehouseRemainsColumns : TableColumn[] = [
    { key: "id", label: "Id" },
  ]

  warehouseRemainsItems : WarehouseRemainsObject[] = [];
  rowIdKeyForWarehouseRemains = "id";

  ngOnInit() {
    this.initForm();
    this.loadRemains(0);
  }

  private initForm() {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [new Date()],
      groupByClient: [false],
      groupByContract: [false],
      groupByPalletType: [true] // За замовчуванням дивимось залишки по палетах
    });
  }

  private updateTableColumns(filters: any) {
    const newColumns: TableColumn[] = []; 

    // Додаємо колонки тільки якщо відповідний чекбокс був увімкнений
    if (filters.groupByClient) {
      newColumns.push({ key: 'clientName', label: 'Клієнт' }); 
    }
    
    if (filters.groupByContract) {
      newColumns.push({ key: 'contractName', label: 'Контракт' });
    }
    
    if (filters.groupByPalletType) {
      newColumns.push({ key: 'palletTypeName', label: 'Тип палети' });
    }

    newColumns.push({ key: 'amount', label: 'Залишок (шт)' });

    this.warehouseRemainsColumns = newColumns;
  }

  loadRemains(page: number=0) {
    // 1. Встановлюємо колонки спеціально для режиму "Всі записи"
    this.warehouseRemainsColumns = [
      { key: 'documentName', label: 'Документ' },
      { key: 'clientName', label: 'Клієнт' },
      { key: 'contractName', label: 'Контракт' },
      { key: 'palletTypeName', label: 'Тип палети' },
      { key: 'amount', label: 'Кількість' },
      { key: 'transactionDate', label: 'Дата' },
      { key: 'batchDocumentName', label: 'Партія (Прихід)' }
    ];

    // 2. Робимо запит
    this.warehouseRemainsService.getAllInventoryBalanceRecords(page).subscribe({
      next: (data) => {
        this.warehouseRemainsItems = data;
        this.currentPage = page;
        // this.totalPages = ... (Якщо твій бекенд віддає загальну кількість сторінок)
      },
      error: (err) => console.error('Помилка завантаження історії руху:', err)
    });
  }

  onCalculate() {
    const filters = this.filterForm.value;

    const payload = {
      startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
      endDate: filters.endDate ? new Date(filters.endDate).toISOString() : null,
      groupByClients: filters.groupByClient,
      groupByContracts: filters.groupByContract,
      groupByPalletTypes: filters.groupByPalletType
    };

    // 💡 Оновлюємо колонки перед відправкою (або всередині next)
    this.updateTableColumns(filters);

    this.warehouseRemainsService.CalculateRemains(payload).subscribe({
      next: (data) => {
        console.log(data);
        this.warehouseRemainsItems = data.map((item, index) => ({
          ...item,
          tempId: index 
        }));
      },
      error: (err) => {
        console.error('Помилка отримання залишків:', err);
        alert('Не вдалося завантажити залишки');
      }
    });
  }


  onItemSelected(item: any) {
    console.log('Selected client:', item);
  }

  onSelectionChange(selectedItems: any[]) {
  }


  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRemains(this.currentPage);
    } else {
      console.warn('Ви вже на першій сторінці!');
    }

  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRemains(this.currentPage);
    } else {
      console.warn('Ви вже на останній сторінці!');
    }
  }

}
