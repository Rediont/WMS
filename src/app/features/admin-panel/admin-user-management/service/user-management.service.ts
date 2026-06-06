import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private http = inject(HttpClient);
  
  // Заміни на свій реальний контролер
  private apiUrl = `${environment.apiUrl}`; 

  registerUser(data: any): Observable<string> {
    // Формуємо об'єкт так, як очікує бекенд (RegisterDto)
    const payload = {
      Email: data.email,
      Password: data.password,
      Role: data.role
    };

    // Вказуємо responseType: 'text', бо бекенд повертає звичайний рядок (Ok("Користувач..."))
    return this.http.post(`${this.apiUrl}/Admin/register`, payload, { responseType: 'text' });
  }

  // Заглушка для завантаження списку
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Admin/all`);
  }
}