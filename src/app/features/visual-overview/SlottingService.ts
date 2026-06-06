// services/slotting.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AvailableCell } from './models/Available-cell';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SlottingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Alley`; // Або як ти назвав свій контролер

  getAvailableCells(alleyIndex: number, palletTypeId: number): Observable<AvailableCell[]> {
    return this.http.get<AvailableCell[]>(`${this.apiUrl}/${alleyIndex}/available-cells?palletType=${palletTypeId}`);
  }
}