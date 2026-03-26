import { Component, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './table-config.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class GenericTableComponent {
  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) rowIdKey!: string; 

  @Output() rowClicked = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any[]>();

  selectedIds = new Set<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.selectedIds.clear();
      this.emitSelection();
    }
  }

  private cdr = inject(ChangeDetectorRef);

  refresh() {
    this.cdr.markForCheck(); 
  }

  // --- Логіка вибору ---

  // Чи вибраний конкретний рядок?
  isSelected(row: any): boolean {
    const id = row[this.rowIdKey];
    return this.selectedIds.has(id);
  }

  // Чи вибрані ВСІ рядки на поточній сторінці?
  isAllSelected(): boolean {
    if (this.data.length === 0) return false;
    return this.data.every(row => this.selectedIds.has(row[this.rowIdKey]));
  }

  // Перемикання одного рядка
  toggleRow(row: any, event: Event): void {
    event.stopPropagation(); // Важливо! Щоб клік по чекбоксу не тригерив клік по рядку (rowClicked)
    
    const id = row[this.rowIdKey];
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.emitSelection();
  }

  // Перемикання "Вибрати все" в шапці
  toggleAll(event: Event): void {
    if (this.isAllSelected()) {
      // Якщо все вибрано - очищаємо
      this.selectedIds.clear();
    } else {
      // Інакше - додаємо всі поточні ID в сет
      this.data.forEach(row => this.selectedIds.add(row[this.rowIdKey]));
    }
    this.emitSelection();
  }

  // Допоміжний метод для відправки повних об'єктів батьку
  private emitSelection(): void {
    // Фільтруємо вихідні дані, залишаючи ті, чиї ID є в нашому сеті
    const selectedItems = this.data.filter(row => this.selectedIds.has(row[this.rowIdKey]));
    this.selectionChanged.emit(selectedItems);
  }
}