import { Component, inject, ViewChild } from '@angular/core';
import { TableColumn } from "../../../../shared/generic-table/table-config.model";
import { GenericTableComponent } from '../../../../shared/generic-table/app-table.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InventoryItem } from '../../models/inventory-item.model';
import { FilterField } from '../../../../shared/generic-filter/model/generic-filter.model';
import { GenericFilterComponent } from "../../../../shared/generic-filter/component/generic-filter.component";
import { AppStateService } from '../../../../core/state.service/state.service';

@Component({
    selector: 'app-inventory',
    imports: [GenericTableComponent, MatButton, GenericFilterComponent],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @ViewChild(GenericTableComponent) table!: GenericTableComponent;

  private appState = inject(AppStateService);
  private dialog = inject(MatDialog);

  inventoryFilterConfig: FilterField[] = [
    { 
      key: 'palletTypeId', 
      label: 'Тип палети', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'clientId', 
      label: 'Клієнт', 
      type: 'select', 
      options: [] 
    },
    { 
      key: 'contractId', 
      label: 'Контракт', 
      type: 'select', 
      options: [] 
    }
  ];

  // Наші дані
  inventoryItems: InventoryItem[] = [
  ];

  // Конфігурація колонок САМЕ для інвентарю
  inventoryColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Pallet ID' },
    { key: 'name', label: 'Name' },
    { key: 'alley', label: 'Alley Location' },
    { key: 'type', label: 'Pallet Type' }
  ];

  rowIdKeyForInventory = 'id';

  selectedInventoryItems: any[] = [];
  
  ngOnInit() {
    this.populateFiltersFromLookups();
  }

  onItemSelected(item: any) {
    console.log('Selected inventory item:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected items changed:', selectedItems);
    this.selectedInventoryItems = selectedItems;
  }

  private populateFiltersFromLookups() {
    // Отримуємо словники (якщо вони ще не завантажились, беремо порожні масиви як fallback)
    const lookups = this.appState.lookups;

    // 1. Мапимо LookupItem для Типів палет
    const palletTypeOptions = (lookups.palletTypes || []).map(pt => ({
      value: pt.id,
      display: pt.name
    }));

    // 2. Мапимо LookupItem для Клієнтів
    const clientOptions = (lookups.clients || []).map(client => ({
      value: client.id,
      display: client.name
    }));

    // 3. Мапимо ContractLookupItem для Контрактів
    // Використовуємо .contractName як текст (display)
    const contractOptions = (lookups.contracts || []).map(contract => ({
      value: contract.id,
      // Можна зробити ще красивіше: 'Назва контракту (Клієнт)'
      // display: `${contract.contractName} (${contract.clientName})`
      display: contract.contractName 
    }));

    // 4. Оновлюємо конфігурацію (обов'язково через .map(), щоб Angular оновив UI)
    this.inventoryFilterConfig = this.inventoryFilterConfig.map(field => {
      switch (field.key) {
        case 'palletTypeId':
          return { ...field, options: palletTypeOptions };
        case 'clientId':
          return { ...field, options: clientOptions };
        case 'contractId':
          return { ...field, options: contractOptions };
        default:
          return field;
      }
    });
  }


  applyFilter(filterValues: any) {
    console.log('Applying filter with values:', filterValues);
  }
}
