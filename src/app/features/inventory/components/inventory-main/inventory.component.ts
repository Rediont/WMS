import { Component, inject, ViewChild } from '@angular/core';
import { TableColumn } from "../../../../shared/generic-table/table-config.model";
import { GenericTableComponent } from '../../../../shared/generic-table/app-table.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InventoryDialogWrapperComponent } from '../inventory-form/inventory-dialog-wrapper.component';
import { InventoryItem } from '../../models/inventory-item.model';

@Component({
    selector: 'app-inventory',
    imports: [GenericTableComponent, MatButton],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  @ViewChild(GenericTableComponent) table!: GenericTableComponent;

  private dialog = inject(MatDialog);

  // Наші дані
  inventoryItems: InventoryItem[] = [
    { id: 101, palletId: 1001, name: 'Box A', alley: 'A1', type: 'Wood' },
    { id: 102, palletId: 1002, name: 'Box B', alley: 'B2', type: 'Plastic' },
    { id: 103, palletId: 1003, name: 'Box C', alley: 'C3', type: 'Metal' },
    { id: 104, palletId: 1004, name: 'Box D', alley: 'D4', type: 'Glass' },
    { id: 105, palletId: 1005, name: 'Box E', alley: 'E5', type: 'Cardboard' },
    { id: 106, palletId: 1006, name: 'Box F', alley: 'F6', type: 'Paper' },
    { id: 107, palletId: 1007, name: 'Box G', alley: 'G7', type: 'Foam' },
    { id: 108, palletId: 1008, name: 'Box H', alley: 'H8', type: 'Wood' },
    { id: 109, palletId: 1009, name: 'Box I', alley: 'I9', type: 'Plastic' },
    { id: 110, palletId: 1010, name: 'Box J', alley: 'J10', type: 'Metal' },
    { id: 111, palletId: 1011, name: 'Box K', alley: 'K11', type: 'Glass' },
    { id: 112, palletId: 1012, name: 'Box L', alley: 'L12', type: 'Cardboard' }
  ];

  // Конфігурація колонок САМЕ для інвентарю
  inventoryColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'Pallet ID' },
    { key: 'name', label: 'Name' },
    { key: 'alley', label: 'Alley Location' },
    { key: 'type', label: 'Material Type' }
  ];

  rowIdKeyForInventory = 'id';

  selectedInventoryItems: any[] = [];
  
  onItemSelected(item: any) {
    console.log('Selected inventory item:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected items changed:', selectedItems);
    this.selectedInventoryItems = selectedItems;
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(InventoryDialogWrapperComponent, {
      width: '400px',
      data: null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: InventoryItem | null) => {
      if (result) {
        console.log('Creating new item:', result);
        this.inventoryItems.push({...result});
      }
    });

    this.table.refresh();
  }

  openEditDialog(item: InventoryItem) {
    const dialogRef = this.dialog.open(InventoryDialogWrapperComponent, {
      width: '400px',
      data: item
    });

    dialogRef.afterClosed().subscribe((result: InventoryItem | null) => {
      if (result) {
        console.log('Updating item:', result);
        const index = this.inventoryItems.findIndex(i => i.id === result.id);
        if (index !== -1) {
          this.inventoryItems[index] = result;
        }
      }
    });
  }
}
