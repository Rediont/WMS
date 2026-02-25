import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alley } from '../models/warehouse.model';

@Component({
  selector: 'app-main-overview-component',
  imports: [],
  templateUrl: './warehouse-map-component.component.html',
  styleUrl: './warehouse-map-component.component.scss'
})
export class WarehouseMapComponent {
  @Input({ required: true }) alleys: Alley[] = [];
  @Output() alleyClicked = new EventEmitter<Alley>();

  getOccupancyColor(occupancy: number): string {
    if (occupancy < 30) return '#c8e6c9'; // Світло-зелений
    if (occupancy < 70) return '#fff9c4'; // Жовтий
    if (occupancy < 95) return '#ffcc80'; // Помаранчевий
    return '#ffcdd2'; // Червоний
  }
}
