import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { inject, Injectable } from "@angular/core";
import { ActivePalletsPerDocumentDto } from "../models/pallet-binding.models";


@Injectable({
  providedIn: 'root'
})
export class PalletBindingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/pallet-binding`;
    
    public getUnboundPalletsByDocument(documentId: number, palletTypeId?: number) {
        const url = palletTypeId 
            ? `${this.apiUrl}/unbound-pallets/${documentId}?palletTypeId=${palletTypeId}`
            : `${this.apiUrl}/unbound-pallets/${documentId}`;
        return this.http.get<any[]>(url);
    }

    public loadUnboundPalletStatistics() {
        return this.http.get<ActivePalletsPerDocumentDto[]>(`${this.apiUrl}/unbound-pallets/stats`);
    }

    public bindMultiplePallets(cellPalletDict: { [key: number]: number[] }, alleyIndex: number) {
        return this.http.post(`${this.apiUrl}/bind-multiple`, { cellPalletDict, alleyIndex });
    }

}

