import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RackCell } from '../models/warehouse.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alley-overview-component',
  imports: [CommonModule],
  templateUrl: './alley-overview-component.component.html',
  styleUrl: './alley-overview-component.component.scss'
})
export class AlleyOverviewComponent {
  @Input({ required: true }) alleyName: string = '';
  @Input({ required: true }) cells: RackCell[] = [];
  
  @Output() backClicked = new EventEmitter<void>();
  @Output() cellClicked = new EventEmitter<RackCell>();

  levels: number[] = [];

  ngOnChanges() {
    const uniqueLevels = [...new Set(this.cells.map(c => c.level))];
    this.levels = uniqueLevels.sort((a, b) => b - a);
  }

  getCellsForLevel(level: number): RackCell[] {
    return this.cells
      .filter(c => c.level === level)
      .sort((a, b) => a.section - b.section);
  }
}
