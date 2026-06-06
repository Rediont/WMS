import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BillDto } from "../../core/models/payment.interfaces";
import { map, Observable } from "rxjs";
import { BillRecordDto } from "./models/bill.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(http: HttpClient) {}

  loadPayments(page?: number): Observable<BillRecordDto[]> {
    const params = new HttpParams().set('page', page?.toString() || '0');
    return this.http.get<BillRecordDto[]>(`${this.apiUrl}/all`, { params });
  }

  CalculateContractBillForClient(
    clientId: number, 
    contractId: number, 
    periodStart: Date, 
    periodEnd: Date
  ): Observable<BillDto> {
    
    // Створюємо простий об'єкт (Body)
    const body = {
      ClientId: clientId,
      ContractId: contractId,
      PeriodStart: periodStart.toISOString(),
      PeriodEnd: periodEnd.toISOString()
    };

    return this.http.post<BillDto>(`${this.apiUrl}/calculate`, body);
  }

  save(bill: BillDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, bill);
  }


}