import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { DocumentObject, WeeklyDocumentStatsDto } from "./model/document.model";
import { map } from "rxjs";
import { formatDate } from "@angular/common";


@Injectable({
  providedIn: 'root' 
})
export class DocumentService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/Documents`;
  public documentCreated$ = new Subject<any>();

  public DocumentTypeNames : { [key: number]: string } = {
    1: 'Прихідна накладна',
    2: 'Ордер на відвантаження',
    3: 'Коригування інвентарю',
    4: 'Замовлення передачі',
    5: 'Інше'
  };

  getDocuments(page : number) {
    const params = new HttpParams()
      .set('page', page.toString());
    return this.http.get<any[]>(`${this.apiUrl}/all`, {params}).pipe(
    map((rawDocuments: any[]) => {
      return rawDocuments.map(rawDoc => this.mapToFrontendModel(rawDoc));
    }));
  }

  mapToFrontendModel(rawDoc: any): DocumentObject {
    return {
      id: rawDoc.id,

      type: this.DocumentTypeNames[rawDoc.documentTypeId + 1] || 'Unknown',

      clientId: rawDoc.clientId,
      clientName: rawDoc.clientName === 0 ? 'Без клієнта' : rawDoc.clientName,

      contractId: rawDoc.contractId,
      contractName: rawDoc.contractName === 0 ? 'Без контракта' : rawDoc.contractName,

      creationDate: formatDate(rawDoc.creationDate, 'dd.MM.yyyy HH:mm', 'en-US')
    }

  }

  createReceipt(payload : any) : Observable<Object> {
    return this.http.post(`${this.apiUrl}/create/receipt`,payload);
  }

  createShipment(payload : any) : Observable<Object> {
    return this.http.post(`${this.apiUrl}/create/shipment`, payload);
  }
    
  getWeeklyStats() : Observable<WeeklyDocumentStatsDto> {
    return this.http.get<WeeklyDocumentStatsDto>(`${this.apiUrl}/weekly-stats`);
  }
}