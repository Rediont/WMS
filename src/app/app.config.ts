import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppStateService } from './core/state.service/state.service';
import { of } from 'rxjs';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  // providers: [provideRouter(routes, withDebugTracing())]
  providers: [provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, tokenInterceptor])),
    provideAppInitializer(() => {
      const appState = inject(AppStateService);
      
      // Перевіряємо, чи зберігся токен з минулої сесії
      const token = localStorage.getItem('token'); // Назва ключа, під яким ти зберігатимеш JWT
      
      if (token) {
        // Токен є (наприклад, юзер натиснув F5) -> вантажимо словники
        return appState.loadGlobalLookups();
      } else {
        // Токена немає (новий юзер) -> ігноруємо словники, просто стартуємо додаток
        return of(null); 
      }
    })
  ]
};
