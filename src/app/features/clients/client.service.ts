import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientObject } from './models/client.model'; // Ваш шлях до моделі
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/clientManager`; 

  constructor() { }

  getClients(): Observable<ClientObject[]> {
    return this.http.get<ClientObject[]>(`${this.apiUrl}/all`);
  }

  getClientById(id: number): Observable<ClientObject> {
    return this.http.get<ClientObject>(`${this.apiUrl}/${id}`);
  }

  addClient(newClient: Omit<ClientObject, 'id'>): Observable<ClientObject> {
    return this.http.post<ClientObject>(`${this.apiUrl}/add`, newClient);
  }

  updateClient(id: number, updatedData: Partial<ClientObject>): Observable<ClientObject> {
    return this.http.put<ClientObject>(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}