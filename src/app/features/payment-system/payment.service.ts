import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BillDto } from "../../core/models/payment.interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(http: HttpClient) {}

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