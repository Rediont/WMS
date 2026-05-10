import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Alley } from '../models/warehouse.model';
import { WarehouseService } from '../warehouseService';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-overview-component',
  imports: [],
  templateUrl: './warehouse-map-component.component.html',
  styleUrl: './warehouse-map-component.component.scss'
})
export class WarehouseMapComponent {
  alleys: Alley[] = [];
  
  // Інжектимо сервіс, який відповідає за дані складу
  private warehouseService = inject(WarehouseService);
  private router = inject(Router);

  ngOnInit() {
    // Компонент сам завантажує алеї при відкритті сторінки
    this.alleys = this.warehouseService.getAlleys(); 
    // або через subscribe(), якщо це запит на сервер:
    // this.warehouseService.getAlleys().subscribe(data => this.alleys = data);
  }

  goToAlley(alleyId: number) {
    this.router.navigate(['warehouse/visual-overview/alley/:id', alleyId]); 
  }

  getOccupancyColor(occupancy: number): string {
    if (occupancy < 30) return '#c8e6c9'; // Світло-зелений
    if (occupancy < 70) return '#fff9c4'; // Жовтий
    if (occupancy < 95) return '#ffcc80'; // Помаранчевий
    return '#ffcdd2'; // Червоний
  }
}
