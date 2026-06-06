import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PalletInfo } from './models/inventory-item.model'; // Вкажіть ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Інжектимо HttpClient для роботи з мережею
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/inventory`; 

  getTotalPages(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-pages`);
  }

  getInventoryItems(page?: number): Observable<PalletInfo[]> {
    let params = new HttpParams().set('page', page?.toString() || '0');
    return this.http.get<PalletInfo[]>(`${this.apiUrl}/pallets/all`, { params });
  }

  getItemById(id: number): Observable<PalletInfo> {
    return this.http.get<PalletInfo>(`${this.apiUrl}/${id}`);
  }

  addItem(newItem: Omit<PalletInfo, 'id'>): Observable<PalletInfo> {
    return this.http.post<PalletInfo>(this.apiUrl, newItem);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}