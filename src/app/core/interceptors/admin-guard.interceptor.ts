import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  // 1. Якщо токена взагалі немає — відправляємо на логін
  if (!token) {
    return router.parseUrl('/login'); 
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const roles = payload[roleKey] || payload['role'] || [];

    const isAdmin = typeof roles === 'string' ? roles === 'Admin' : roles.includes('Admin');

    if (isAdmin) {
      return true; // Пропускаємо в адмінку!
    }

    console.warn('Доступ заборонено: у вас немає прав адміністратора.');
    return router.parseUrl('/dashboard'); 

  } catch (error) {
    console.error('Помилка валідації токена', error);
    localStorage.removeItem('token');
    return router.parseUrl('/login');
  }
};