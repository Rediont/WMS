import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WarehouseRemainsObject } from './models/warehouse-remains-model'

@Injectable({
  providedIn: 'root'
})
export class WarehouseRemainsService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/InventoryBalance`; 

  constructor() { }

  getAllInventoryBalanceRecords(page: number = 0) {
    var params = new HttpParams().set('page', page);
    return this.http.post<WarehouseRemainsObject[]>(`${this.apiUrl}/records/all`, { params })
  }

  CalculateRemains(payload: any): Observable<WarehouseRemainsObject[]> {
    return this.http.post<WarehouseRemainsObject[]>(`${this.apiUrl}/calculate/all`, payload);
  }

}