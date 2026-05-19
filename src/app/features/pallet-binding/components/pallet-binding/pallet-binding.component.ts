import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute } from '@angular/router';
import { WarehouseService } from '../../../visual-overview/warehouseService';
import { Alley, AlleyCellOccupancyMapDto } from '../../../visual-overview/models/warehouse.model';
import { PalletBindingService } from '../../service/pallet-binding.service';
import { ActivePalletsPerDocumentDto, PalletAssignmentDto } from '../../models/pallet-binding.models';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AppStateService } from '../../../../core/state.service/state.service';

@Component({
  selector: 'app-pallet-binding',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule, 
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './pallet-binding.component.html',
  styleUrl: './pallet-binding.component.scss'
})
export class PalletBindingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private warehouseService = inject(WarehouseService);
  private palletBindingService = inject(PalletBindingService);
  private stateService = inject(AppStateService);

  // Контекстні сигнали для дропдаунів
  documents = signal<ActivePalletsPerDocumentDto[]>([]);
  palletTypes = signal<number[]>([]); 
  alleys = signal<Alley[]>([]);

  // Обрані значення
  selectedDocumentId = signal<number | null>(null);
  selectedPalletType = signal<number | null>(null);
  selectedAlleyId = signal<number | null>(null);

  // Списки для роботи
  unboundPallets = signal<PalletAssignmentDto[]>([]); // палети зліва
  alleyFloorMap = signal<AlleyCellOccupancyMapDto[]>([]); // карта алеї справа

  selectedPalletForBinding = signal<PalletAssignmentDto | null>(null);

  // 1. РОЗУМНИЙ COMPUTED СИГНАЛ: Рахує розмір палети тільки тоді, коли реально змінюється виділення
  selectedPalletSize = computed(() => {
    const pallet = this.selectedPalletForBinding();
    if (!pallet) return 0;

    const typesList = this.stateService.lookups.palletTypes || [];
    const foundType = typesList.find(t => Number(t.id) === Number(pallet.palletTypeId));
    
    console.log(`[Computed] Зміна виділеної палети. Тип: ${pallet.palletTypeId}, Знайдено розмір:`, foundType?.size);
    return foundType ? (foundType.size || 1) : 1;
  });

  // 2. КЕШОВАНИЙ COMPUTED СЛОВНИК: Позбавляє шаблони від постійних пошуків у масиві документів
  currentDocActivePallets = computed(() => {
    const docId = this.selectedDocumentId();
    if (!docId) return null;
    const doc = this.documents().find(d => d.documentId === docId);
    return doc ? doc.activePalletsCount : null;
  });

  // Тимчасовий локальний буфер для BindMultiple: Ключ = CellIndex, Значення = Масив PalletId
  localBindingChanges: { [key: number]: number[] } = {};

  ngOnInit() {
    this.loadInitialData();
    
    // Перевіряємо, чи ми перейшли сюди з таблиці приходів з ID в URL
    const docIdParam = this.route.snapshot.paramMap.get('documentId');
    if (docIdParam) {
      this.onDocumentChange(+docIdParam);
    }
  }

  getPalletTypeName(typeId: number): string {
    const typesList = this.stateService.lookups.palletTypes || []; 
    const foundType = typesList.find(t => Number(t.id) === Number(typeId));
    return foundType ? foundType.name : `Тип #${typeId}`;
  }

  getPalletCountForType(typeId: number): number {
    const counts = this.currentDocActivePallets();
    return counts ? (counts[typeId] || 0) : 0;
  }

  loadInitialData() {
    this.warehouseService.getAllAlleysOccupancy().subscribe(occupancies => {
      const count = occupancies.length;
      const Alleys: Alley[] = [];

      for (let i = 1; i <= count; i++) {
        Alleys.push({
          id: i,
          name: `Alley ${i}`,
          occupancy: occupancies.find(o => o.alleyId === i)?.occupancyPercentage || 0,
          cells: []
        });
      }

      this.alleys.set(Alleys);

      if (Alleys.length > 0) {
        this.onAlleyChange(Alleys[0].id);
      }
    });

    this.palletBindingService.loadUnboundPalletStatistics().subscribe(stats => {
      this.documents.set(stats);
      
      // На випадок, якщо документ прийшов з URL раніше, ніж завантажилась статистика
      const docId = this.selectedDocumentId();
      if (docId) {
        this.updatePalletTypesForDocument(docId);
      }
    });
  }

  resetLocalChangesAndReloadMap() {
    this.localBindingChanges = {};
    
    const alleyId = this.selectedAlleyId();
    if (alleyId) {
      this.warehouseService.getAlleyOccupancyMap(alleyId).subscribe({
        next: (map) => this.alleyFloorMap.set(map),
        error: (err) => console.error('Помилка відновлення карти алеї:', err)
      });
    }
  }

  onDocumentChange(docId: number) {
    this.selectedDocumentId.set(docId);
    this.selectedPalletType.set(null); 
    this.selectedPalletForBinding.set(null);

    if (this.canSaveBatch()) {
      const confirmLeave = confirm('У вас є незбережені прив\'язки палет! При зміні документа вони будуть втрачені. Продовжити?');
      if (!confirmLeave) return; 
    }

    this.resetLocalChangesAndReloadMap();

    this.updatePalletTypesForDocument(docId);
    this.loadPalletsForDocument();
  }

  private updatePalletTypesForDocument(docId: number) {
    const currentDoc = this.documents().find(d => d.documentId === docId);
    if (currentDoc && currentDoc.activePalletsCount) {
      const typesInDoc = Object.keys(currentDoc.activePalletsCount).map(key => +key);
      this.palletTypes.set(typesInDoc);

      if (typesInDoc.length > 0) {
        this.onPalletTypeChange(typesInDoc[0]);
      }
    } else {
      this.palletTypes.set([]);
    }
  }

  onPalletTypeChange(typeId: number) {
    this.selectedPalletType.set(typeId);
    this.selectedPalletForBinding.set(null);
    this.loadPalletsForDocument(); 
  }

  onAlleyChange(alleyId: number) {
    this.selectedAlleyId.set(alleyId);
    this.warehouseService.getAlleyOccupancyMap(alleyId).subscribe(map => this.alleyFloorMap.set(map));

    if (this.canSaveBatch()) {
      const confirmLeave = confirm('У вас є незбережені прив\'язки палет! При зміні алеї вони будуть втрачені. Продовжити?');
      if (!confirmLeave) return; 
    }

    this.resetLocalChangesAndReloadMap();

  }

  loadPalletsForDocument() {
    const docId = this.selectedDocumentId();
    const typeId = this.selectedPalletType();
    
    if (!docId || !typeId) {
      this.unboundPallets.set([]);
      return;
    }

    // Передаємо також і typeId для точного завантаження палет потрібного типу
    this.palletBindingService.getUnboundPalletsByDocument(docId, typeId).subscribe(pallets => {
      this.unboundPallets.set(pallets);
    });
  }

  selectPalletForBinding(pallet: PalletAssignmentDto) {
    this.selectedPalletForBinding.set(
      this.selectedPalletForBinding()?.palletId === pallet.palletId ? null : pallet
    );
  }

  bindSelectedPalletToCell(cellIndex: number, floorIndex: number) {
    const pallet = this.selectedPalletForBinding();
    if (!pallet) return; 

    // Використовуємо миттєве значення з сигналу
    const neededSpace = this.selectedPalletSize();
    console.log(`Спроба прив'язати палету ${pallet.palletId} (потрібно місця: ${neededSpace}) до комірки ${cellIndex}`);

    const currentMap = this.alleyFloorMap();
    const floor = currentMap.find(f => f.floorIndex === floorIndex);
    const cell = floor?.cellOccupancies.find(c => c.cellIndex === cellIndex);

    if (!cell) return;

    if (cell.freeCapacity < neededSpace) {
      console.error(`Недостатньо місця! Потрібно: ${neededSpace}, залишилось: ${cell.freeCapacity}`);
      alert(`Не можна розмістити палету! Потрібно місця: ${neededSpace}, а в комірці є лише: ${cell.freeCapacity}`);
      return;
    }

    // Віднімаємо реальний розмір палети
    cell.freeCapacity -= neededSpace;
    this.alleyFloorMap.set([...currentMap]);

    if (!this.localBindingChanges[cellIndex]) {
      this.localBindingChanges[cellIndex] = [];
    }
    this.localBindingChanges[cellIndex].push(pallet.palletId);

    this.unboundPallets.set(this.unboundPallets().filter(p => p.palletId !== pallet.palletId));
    this.selectedPalletForBinding.set(null); // Скидання сигналу автоматично оновить обчислюваний розмір на 0
  }

  canSaveBatch(): boolean {
    return Object.keys(this.localBindingChanges).length > 0;
  }

  saveBindingBatch() {
    const alleyId = this.selectedAlleyId();
    if (!alleyId || !this.canSaveBatch()) return;

    this.palletBindingService.bindMultiplePallets(this.localBindingChanges, alleyId).subscribe({
      next: () => {
        console.log('Пакет прив\'язок успішно збережено!');
        this.localBindingChanges = {}; 
        this.onAlleyChange(alleyId); 
      },
      error: (err) => console.error('Помилка збереження пакету прив\'язок:', err)
    });
  }

  getCellColor(cell: any): string {
    if (cell.freeCapacity >= 3) return '#c8e6c9'; 
    if (cell.freeCapacity > 0) return '#fff9c4';  
    return '#ffcdd2';                             
  }

  // Швидке та легке порівняння без важких циклів перевірки в HTML
  isCellTooSmallForSelectedPallet(cellCapacity: number): boolean {
    if (!this.selectedPalletForBinding()) return false;
    return cellCapacity < this.selectedPalletSize();
  }
}