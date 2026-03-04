import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShipmentObject } from './models/shipment.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';
import { ReceiptObject } from '../receipts/models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/shipment`; 

  constructor() { }

  getShipments(): Observable<ShipmentObject[]> {
    return this.http.get<ShipmentObject[]>(`${this.apiUrl}/all`);
  }

  getShipmentById(id: number): Observable<ShipmentObject> {
    return this.http.get<ShipmentObject>(`${this.apiUrl}/${id}`);
  }

  addShipment(newShipment: Omit<ShipmentObject, 'id'>): Observable<ShipmentObject> {
    return this.http.post<ShipmentObject>(`${this.apiUrl}/add`, newShipment);
  }

  updateShipment(id: number, updatedData: Partial<ShipmentObject>): Observable<ShipmentObject> {
    return this.http.put<ShipmentObject>(`${this.apiUrl}/${id}`, updatedData);
  }
}