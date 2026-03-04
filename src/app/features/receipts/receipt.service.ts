import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceiptObject } from './models/receipt.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/receipt`; 

  constructor() { }

  getReceipts(): Observable<ReceiptObject[]> {
    return this.http.get<ReceiptObject[]>(`${this.apiUrl}/all`);
  }

  getReceiptById(id: number): Observable<ReceiptObject> {
    return this.http.get<ReceiptObject>(`${this.apiUrl}/${id}`);
  }

  addReceipt(newReceipt: Omit<ReceiptObject, 'id'>): Observable<ReceiptObject> {
    return this.http.post<ReceiptObject>(`${this.apiUrl}/add`, newReceipt);
  }

  updateReceipt(id: number, updatedData: Partial<ReceiptObject>): Observable<ReceiptObject> {
    return this.http.put<ReceiptObject>(`${this.apiUrl}/${id}`, updatedData);
  }
}