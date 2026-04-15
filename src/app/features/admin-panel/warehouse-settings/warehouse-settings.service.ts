import { HttpClient } from "@angular/common/http";
import { Injectable ,inject } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WarehouseSettingsService {    
  private http = inject(HttpClient);
  
  // URL вашого бекенду (замініть на реальний)
  private apiUrl = `${environment.apiUrl}/admin/update-warehouse-settings`; 

  constructor() { }

  public updateWarehouseSettings(settings: any) {
    return this.http.post(this.apiUrl, settings);
  }

}
