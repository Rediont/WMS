import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlottingService } from '../SlottingService';

// Інтерфейси для побудови візуальної сітки
interface GridCell {
  index: number;
}

interface FloorRow {
  index: number;
  cells: GridCell[];
}

@Component({
  selector: 'app-alley-overview-component',
  imports: [CommonModule],
  templateUrl: './alley-overview-component.component.html',
  styleUrl: './alley-overview-component.component.scss'
})
export class AlleyOverviewComponent {
  private slottingService = inject(SlottingService);

  @Input() alleyName: string = 'Алея 1';
  @Input() alleyIndex: number = 1;
  @Input() totalFloors: number = 4;     // Кількість поверхів (ярусів)
  @Input() cellsPerFloor: number = 10;  // Кількість комірок на одному поверсі

  @Output() backClicked = new EventEmitter<void>();

  // Змінні для шаблону
  floors: FloorRow[] = [];
  
  // Set для миттєвої перевірки (O(1)) чи є координата "Поверх-Комірка" вільною
  availableSpotsSet = new Set<string>();

  ngOnInit() {
    this.buildPhysicalGrid();
    this.loadAvailableCells();
  }

  // 1. Будуємо фізичний каркас стелажа (від верхнього поверху до нижнього)
  buildPhysicalGrid() {
    this.floors = [];
    // Цикл йде у зворотному порядку, щоб 4-й поверх візуально був зверху екрана
    for (let f = this.totalFloors - 1; f >= 0; f--) {
      const rowCells: GridCell[] = [];
      for (let c = 0; c < this.cellsPerFloor; c++) {
        rowCells.push({ index: c });
      }
      this.floors.push({ index: f, cells: rowCells });
    }
  }

  // 2. Завантажуємо вільні місця і створюємо Set
  loadAvailableCells() {
    const palletType = 1; // Тут передаєш тип палети, яку хочеш поставити
    
    this.slottingService.getAvailableCells(this.alleyIndex, palletType).subscribe({
      next: (cells) => {
        this.availableSpotsSet.clear();
        
        cells.forEach(c => {
          const coordinateKey = `${c.floorIndex}-${c.cellId}`;
          this.availableSpotsSet.add(coordinateKey);
        });
      },
      error: (err) => console.error('Помилка завантаження комірок', err)
    });
  }

  // 3. Ця функція викликається для кожної комірки в HTML.
  isSpotAvailable(floorIndex: number, cellIndex: number): boolean {
    const coordinateKey = `${floorIndex}-${cellIndex}`;
    return this.availableSpotsSet.has(coordinateKey);
  }

  // 4. Обробка кліку по комірці
  selectSpot(floorIndex: number, cellIndex: number) {
    if (this.isSpotAvailable(floorIndex, cellIndex)) {
      console.log(`✅ Вибрано вільну комірку: Поверх ${floorIndex}, Місце ${cellIndex}`);
    } else {
      console.log(`❌ Ця комірка зайнята або не підходить за розміром.`);
    }
  }
}
