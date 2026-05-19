import { Component, inject, signal } from '@angular/core';
import { GenericTableComponent } from "../../../../shared/generic-table/app-table.component";
import { MatIconModule } from "@angular/material/icon";
import { WarehouseService } from '../../../visual-overview/warehouseService';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/generic-table/table-config.model';
import { PalletBindingService } from '../../service/pallet-binding.service';

@Component({
  selector: 'app-pallet-binding-main',
  imports: [GenericTableComponent, MatIconModule],
  templateUrl: './pallet-binding-main.component.html',
  styleUrl: './pallet-binding-main.component.scss'
})
export class PalletBindingMainComponent {
  private palletBindingService = inject(PalletBindingService);
  private router = inject(Router);

  // Дані для твоєї таблиці
  tableData = signal<any[]>([]);

  documents = signal<any[]>([]);

  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'documentName', label: 'Назва документа' },
    { key: 'activePalletsCount', label: 'Палети в роботі' },
  ];

  rowIdKey = 'id'; 

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.palletBindingService.loadUnboundPalletStatistics().subscribe({
      next: (data) => {
        this.documents.set(data);

        const mappedData = data.map(item => {
          // Визначаємо, яке саме ID приходить з бекенду (documentId чи arrivalDocumentId)
          const actualId = item.documentId;

          return {
            ...item,
            id: actualId, // ОБОВ'ЯЗКОВО створюємо поле 'id' для нашої generic таблиці!
            documentName: `Прихід №${actualId}`,
            activePalletsCount: item.totalActivePallets 
          };
        });

        this.tableData.set(mappedData);
      },
      error: (err) => {
        console.error('Помилка при завантаженні статистики:', err);
      }
    });
  }

  navigateToSlotting(row: any) {
    console.log('Натиснуто рядок таблиці:', row);
    if (row && row.id) {
      this.router.navigate(['/warehouse/pallet-binding', row.id]);
    } else {
      console.error('Не вдалося знайти ID документа в рядку таблиці:', row);
    }
  }
}
