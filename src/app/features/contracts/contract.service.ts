import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiContractObject, Contract } from './models/contract.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/contract`; 

  constructor() { }

  getContracts( page: number = 0, filters?: any): Observable<any[]> {
    let params = new HttpParams();
    params = params.append('page', page);

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


  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  addContract(data: ApiContractObject): Observable<Contract> {
    return this.http.post<Contract>(`${this.apiUrl}/add`, data);
  }

  updateContract(id: number, updatedData: Partial<ApiContractObject>): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${id}`, updatedData);
  }

  getTotalPages(filters?: any): Observable<number> {
    let params = new HttpParams();
    return this.http.get<number>(`${this.apiUrl}/total-pages`, { params });
  }

  getContractDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`);
  }
}