import { Component, inject } from '@angular/core';
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { DocumentObject } from '../model/document.model';
import { GenericFilterComponent } from "../../../shared/generic-filter/component/generic-filter.component";
import { FilterField } from '../../../shared/generic-filter/model/generic-filter.model';
import { AppStateService } from '../../../core/state.service/state.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-management',
  imports: [GenericTableComponent, GenericFilterComponent, MatButton],
  templateUrl: './document-management.component.html',
  styleUrl: './document-management.component.scss'
})
export class DocumentManagementComponent {
  private Dialog = inject(MatDialog);
  private appState = inject(AppStateService);
  private router = inject(Router);
  private sub?: Subscription;
  private documentService = inject(DocumentService)

  currentPage: number = 0;
  totalPages: number = 0;

  documentItems: DocumentObject[] = [];

  documentColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'type', label: 'Тип документа' },
    { key: 'clientName', label: 'Клієнт' },
    { key: 'contractName', label: 'Контракт' },
    { key: 'creationDate', label: 'Дата створення' }
  ];

  rowIdKeyForDocuments = 'index';

  documentFilterConfig: FilterField[] = [
    { key: 'documentTypeId', label: 'Тип документа', type: 'select', options: [] },
    { key: 'clientId', label: 'Клієнт', type: 'select', options: [] },
    { key: 'contractId', label: 'Контракт', type: 'select', options: [] },
    { key: 'palletTypeId', label: 'Тип палети', type: 'select', options: [] },
    { key: 'dateRange', label: 'Період', type: 'date-range' } // Завжди корисно для документів
  ];

  // 💡 2. Викликаємо заповнення при старті
  ngOnInit() {
    this.documentService.getDocuments(0).subscribe({
      next: (response : any) => {
        this.documentItems = response
      },
      error: (err : any) => {
        console.log(err)
      }
    })
    this.populateFilters();
    this.sub = this.documentService.documentCreated$.subscribe((newDoc) => {
      this.documentItems.unshift(newDoc);
    });
  }

  ngOnDestroy() {
    // Важливо відписатися, щоб не було витоку пам'яті
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // 💡 3. Метод для розкладання даних зі стейту по випадаючих списках
  private populateFilters() {
    const lookups = this.appState.lookups;

    // Мапимо типи документів (ті, що ми зробили з Enum)
    const documentTypeOptions = (lookups.documentTypes || []).map(dt => ({
      value: dt.id,
      display: dt.name
    }));

    // Мапимо клієнтів
    const clientOptions = (lookups.clients || []).map(client => ({
      value: client.id,
      display: client.name
    }));

    // Мапимо контракти
    const contractOptions = (lookups.contracts || []).map(contract => ({
      value: contract.id,
      display: contract.contractName
    }));

    // Мапимо типи палет
    const palletTypeOptions = (lookups.palletTypes || []).map(pt => ({
      value: pt.id,
      display: pt.name
    }));

    // 💡 4. Оновлюємо конфігурацію (реактивно через .map)
    this.documentFilterConfig = this.documentFilterConfig.map(field => {
      switch (field.key) {
        case 'documentTypeId': return { ...field, options: documentTypeOptions };
        case 'clientId': return { ...field, options: clientOptions };
        case 'contractId': return { ...field, options: contractOptions };
        case 'palletTypeId': return { ...field, options: palletTypeOptions };
        default: return field;
      }
    });
  }

  onItemSelected(item: any) {
    console.log('Selected document:', item);
  }

  onSelectionChange(selectedItems: any[]) {
    console.log('Selected documents:', selectedItems);
  }

  applyFilter(filterValues: any) {
    console.log('Застосовано фільтр з наступними значеннями:', filterValues);
  }

  openAddDocumentDialog() {
    this.router.navigate(['workflow/documents/new']);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      // Виклик методу для завантаження даних наступної сторінки
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      // Виклик методу для завантаження даних попередньої сторінки
    }
  }
}
