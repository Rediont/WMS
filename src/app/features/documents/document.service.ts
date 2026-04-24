import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root' 
})
export class DocumentService {
    private http = inject(HttpClient)
    private apiUrl = `${environment.apiUrl}/documents`;
}