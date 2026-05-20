import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  currentUser = signal<any | null>(this.decodeToken());

  private decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  get role(): string | null {
    const user = this.currentUser(); // Отримуємо дані з сигналу
    if (!user) return null;

    return user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  updateUser() {
    this.currentUser.set(this.decodeToken());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}