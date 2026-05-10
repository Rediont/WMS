import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Використовуємо Signal для реактивності
  currentUser = signal<any | null>(this.decodeToken());

  private decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token); // Поверне об'єкт, наприклад { sub: 'admin', role: 'Admin' }
    } catch {
      return null;
    }
  }

  get role(): string | null {
    const user = this.currentUser(); // Отримуємо дані з сигналу
    if (!user) return null;

    // Шукаємо роль за повним XML-ключем Microsoft
    return user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  // Викликайте цей метод при логіні та логауті
  updateUser() {
    this.currentUser.set(this.decodeToken());
    console.log('Поточний користувач:', this.currentUser());
  }
}