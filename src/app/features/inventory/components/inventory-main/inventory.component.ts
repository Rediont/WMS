import { Component, inject, ViewChild } from '@angular/core';
import { TableColumn } from "../../../../shared/generic-table/table-config.model";
import { GenericTableComponent } from '../../../../shared/generic-table/app-table.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PalletInfo } from '../../models/inventory-item.model';
import { FilterField } from '../../../../shared/generic-filter/model/generic-filter.model';
import { GenericFilterComponent } from "../../../../shared/generic-filter/component/generic-filter.component";
import { AppStateService } from '../../../../core/state.service/state.service';
import { InventoryService } from '../../inventory.service';

const PalletStatusMap: Record<number, string> = {
  0: 'Прибула',       // Arrived
  1: 'Розподілена',   // Arranged
  2: 'На зберіганні', // Stored
  3: 'Відвантажена'   // Shipped
};

@Component({
    selector: 'app-inventory',
    imports: [GenericTableComponent, MatButton, GenericFilterComponent],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @ViewChild(GenericTableComponent) table!: GenericTableComponent;

  private stateService = inject(AppStateService);
  private dialog = inject(MatDialog);
  private inventoryService = inject(InventoryService);

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

  inventoryItems: PalletInfo[] = [];

  inventoryColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'arrivalDocumentId', label: 'ID Документу приходу' },
    { key: 'alleyIndex', label: 'Номер алеї' },
    { key: 'cellIndex', label: 'Номер Комірки' },
    { key: 'palletTypeName', label: 'Тип палети' },
    { key: 'palletStatusName', label: 'Статус' }
  ];

  rowIdKeyForInventory = 'palletId';

  selectedInventoryItems: any[] = [];
  
  currentPage: number = 0;
  totalPages: number = 0;

  ngOnInit() {
    this.loadTotalPages();
    this.populateFiltersFromLookups();
    this.loadInventoryItems(0);
  }

  onItemSelected(item: any) {
    console.log('Selected inventory item:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected items changed:', selectedItems);
    this.selectedInventoryItems = selectedItems;
  }

  private loadTotalPages() {
    this.inventoryService.getTotalPages().subscribe(total => {
      this.totalPages = total;
    }); 
  }

  private loadInventoryItems(page: number) {
    this.inventoryService.getInventoryItems(page).subscribe((items: PalletInfo[]) => {
      
      this.inventoryItems = items.map((item, index) => {
        
        const matchedType = this.stateService.lookups.palletTypes.find(
          pt => pt.id === item.palletTypeId
        );

        return {
          ...item,
          index: 20 * page + index + 1,
          cellIndex: item.cellIndex !== null ? item.cellIndex : 0,
          alleyIndex: item.alleyIndex !== null ? item.alleyIndex : 0,
          palletTypeName: matchedType ? matchedType.name : 'Невідомий тип', 
          palletStatusName: PalletStatusMap[item.palletStatus] || 'Невідомий статус'
        };
      });
    });
  }

  private populateFiltersFromLookups() {
    const lookups = this.stateService.lookups;

    const palletTypeOptions = (lookups.palletTypes || []).map(pt => ({
      value: pt.id,
      display: pt.name
    }));

    const clientOptions = (lookups.clients || []).map(client => ({
      value: client.id,
      display: client.name
    }));


    const contractOptions = (lookups.contracts || []).map(contract => ({
      value: contract.id,
      display: contract.contractName 
    }));

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

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadInventoryItems(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadInventoryItems(this.currentPage);
    }
  }
}
