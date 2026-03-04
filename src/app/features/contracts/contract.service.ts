import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getContracts(): Observable<ContractObject[]> {
    return this.http.get<ContractObject[]>(`${this.apiUrl}/all`);
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