import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Alley, AlleyCellOccupancyMapDto, Cell } from '../models/warehouse.model';
import { WarehouseService } from '../warehouseService';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { AppStateService } from '../../../core/state.service/state.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-overview-component',
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './warehouse-map-component.component.html',
  styleUrl: './warehouse-map-component.component.scss'
})
export class WarehouseMapComponent {
  private warehouseService = inject(WarehouseService);
  private stateService = inject(AppStateService);

  // Стан даних
  alleys = signal<Alley[]>([]);
  selectedAlleyId = signal<number | null>(null);
  alleyFloorMap = signal<AlleyCellOccupancyMapDto[]>([]);

  // Автоматично вираховуємо обрану алею
  selectedAlley = computed(() => 
    this.alleys().find(a => a.id === this.selectedAlleyId())
  );

  constructor() {
    // Автоматично реагуємо на зміну обраної алеї та вантажимо її карту
    effect(() => {
      const currentAlleyId = this.selectedAlleyId();
      if (currentAlleyId !== null) {
        this.loadAlleySlotting(currentAlleyId);
      }
    });
  }

  ngOnInit() {
    this.loadAlleys();
  }

  loadAlleys() {
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

        // Оновлюємо сигнал
        this.alleys.set(Alleys);

        // Якщо хочемо одразу обрати першу алею
        if (Alleys.length > 0) {
          this.selectedAlleyId.set(Alleys[0].id);
        }
      }
    );
  }

  loadAlleySlotting(alleyId: number) {
    this.warehouseService.getAlleyOccupancyMap(alleyId).subscribe({
      next: (mapData) => {
        this.alleyFloorMap.set(mapData);
        console.log('Карта алеї успішно завантажена:', mapData);
      },
      error: (err) => console.error('Помилка завантаження карти алеї:', err)
    });
  }

  selectAlley(id: number) {
    this.selectedAlleyId.set(id);
  }

  goToAlley(alleyId: number): void {
    console.log(`Перемикаємося на алею: ${alleyId}`);
    
    this.selectedAlleyId.set(alleyId);
  }

  onCellClick(cell: number, floorIndex: number) {
    console.log('Вибрано комірку:', cell, 'на поверсі:', floorIndex);
    // Тут логіка призначення палети або перегляду деталей
  }

  getCellSlotColor(freeCapacity: number): string {
    // Оскільки максимальна місткість комірки дорівнює 3:
    if (freeCapacity >= 3) {
      return '#c8e6c9'; // Повністю вільна (Світло-зелений)
    }
    if (freeCapacity > 1) {
      return '#fff9c4'; // Частково заповнена (Світло-жовтий)
    }
    return '#ffcdd2'; // Повністю забита палетами (Світло-червоний)
  }

  getOccupancyColor(occupancy: number): string {
    if (occupancy < 30) return '#c8e6c9'; // Світло-зелений
    if (occupancy < 70) return '#fff9c4'; // Жовтий
    if (occupancy < 95) return '#ffcc80'; // Помаранчевий
    return '#ffcdd2'; // Червоний
  }
}
