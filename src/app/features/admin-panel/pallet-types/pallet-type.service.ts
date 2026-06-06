import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { PalletCreateRequestObject } from "./pallet-type.model";

@Injectable({
    providedIn: 'root'
})
export class PalletTypeService 
{
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/PalletType`; // Замініть на реальний URL вашого бекенду
    
    getPalletTypes() {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    getPalletTypeById(id: number) {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createPalletType(data: PalletCreateRequestObject) {
        return this.http.post<any>(`${this.apiUrl}/add`, data);
    }

    updatePalletType(id: number, updatedData: any) {
        return this.http.put<any>(`${this.apiUrl}/${id}`, updatedData);
    }

    deletePalletType(id: number) {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}