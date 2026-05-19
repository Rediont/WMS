import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './models/client.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/clientManager`; 

  constructor() { }

  getClients(page: number = 0): Observable<Client[]> {
    const params = new HttpParams().set('page', page);

    return this.http.get<Client[]>(`${this.apiUrl}/all`, { params });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  addClient(newClient: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/add`, newClient);
  }

  updateClient(id: number, updatedData: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}