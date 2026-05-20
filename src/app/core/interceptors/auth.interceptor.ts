import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login')) {
        console.warn('Токен недійсний або протермінований. Перенаправлення на логін...');
        localStorage.removeItem('token'); 
        router.navigate(['/login']); 
      }

      return throwError(() => error);
    })
  );
};