// app-state.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { GlobalLookup } from './lookup.model';
import { environment } from '../../../environments/environment.development'; // Твій шлях до API

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private http = inject(HttpClient);
  
  // Тут ми зберігаємо всі завантажені словники
  public lookups: GlobalLookup = {
    clients: [],
    contracts: [],
    palletTypes: []
  };

  // Метод, який піде на бекенд
  loadGlobalLookups() {
    // Вкажи правильний шлях до твого контролера, наприклад:
    const url = `${environment.apiUrl}/Lookup/all`; 
    
    return this.http.get<GlobalLookup>(url).pipe(
      tap(data => {
        this.lookups = data;
        console.log('Всі словники успішно завантажені при старті сайту:', this.lookups);
      })
    );
  }



}