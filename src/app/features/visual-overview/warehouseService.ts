import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alley, AlleyCellOccupancyMapDto, AlleyOccupancy } from './models/warehouse.model'; // Вкажіть ваш шлях
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' // Робить сервіс доступним у всьому додатку (Singleton)
})
export class WarehouseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`; // Вкажіть ваш базовий URL

  public getAllAlleysOccupancy(): Observable<AlleyOccupancy[]> {
    return this.http.get<AlleyOccupancy[]>(`${this.apiUrl}/Alley/occupancy`); // Вкажіть ваш endpoint
  }

  getAlleyOccupancyMap(alleyId: number): Observable<AlleyCellOccupancyMapDto[]> {
    return this.http.get<AlleyCellOccupancyMapDto[]>(`${this.apiUrl}/Alley/${alleyId}/occupancy-map`);
  }

}