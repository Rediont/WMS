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
    // 2. Декодуємо JWT токен. 
    // Токен має формат Header.Payload.Signature. Нам потрібна середня частина (Payload [1])
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 3. Дістаємо ролі. 
    // У C# Identity ClaimTypes.Role за замовчуванням генерує ось такий довгий ключ:
    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const roles = payload[roleKey] || payload['role'] || [];

    // 4. Перевіряємо, чи є "Admin" серед ролей 
    // (враховуємо, що змінна може бути рядком, якщо роль лише одна, або масивом, якщо декілька)
    const isAdmin = typeof roles === 'string' ? roles === 'Admin' : roles.includes('Admin');

    if (isAdmin) {
      return true; // Пропускаємо в адмінку!
    }

    // 5. Якщо токен є, але він не адмін — не пускаємо і кидаємо на звичайний дашборд
    console.warn('Доступ заборонено: у вас немає прав адміністратора.');
    return router.parseUrl('/dashboard'); 

  } catch (error) {
    // Якщо токен пошкоджений або його неможливо розпарсити
    console.error('Помилка валідації токена', error);
    localStorage.removeItem('token');
    return router.parseUrl('/login');
  }
};