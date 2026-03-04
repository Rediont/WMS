import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from './models/inventory-item.model'; // Вкажіть ваш шлях до моделі

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // Інжектимо HttpClient для роботи з мережею
  private http = inject(HttpClient);
  
  private apiUrl = 'https://my-warehouse-api.com/api/inventory'; 

  constructor() { }

  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiUrl}`);
  }

  /**
   * GET: Отримати один елемент за його ID (для сторінки деталей)
   */
  getItemById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST: Створити новий запис (додати палету)
   * Використовуємо Omit, щоб не передавати id (його згенерує база даних)
   */
  addItem(newItem: Omit<InventoryItem, 'id'>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, newItem);
  }

  /**
   * DELETE: Видалити запис за ID
   */
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}