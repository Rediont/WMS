import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContractObject } from './models/contract.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/contract`; 

  constructor() { }

  getContracts(filters?: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters) {
      // 1. Звичайні параметри (клієнт, статус)
      if (filters.clientId) params = params.append('clientId', filters.clientId);
      if (filters.status) params = params.append('status', filters.status);
      
      // 2. Параметри для проміжку часу (дата контракту від - до)
      if (filters.contractDateRange) {
        if (filters.contractDateRange.start) {
          params = params.append('dateFrom', filters.contractDateRange.start.toISOString());
        }
        if (filters.contractDateRange.end) {
          params = params.append('dateTo', filters.contractDateRange.end.toISOString());
        }
      }
    }

    return this.http.get<any[]>(`${this.apiUrl}/all`, { params });
  }


  getContractById(id: number): Observable<ContractObject> {
    return this.http.get<ContractObject>(`${this.apiUrl}/${id}`);
  }

  addContract(newContract: Omit<ContractObject, 'id'>): Observable<ContractObject> {
    return this.http.post<ContractObject>(`${this.apiUrl}/add`, newContract);
  }

  updateContract(id: number, updatedData: Partial<ContractObject>): Observable<ContractObject> {
    return this.http.put<ContractObject>(`${this.apiUrl}/${id}`, updatedData);
  }
}