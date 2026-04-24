import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

// --- Імпорти сторінок ---
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/components/client-main-component/clients.component';
import { InventoryComponent } from './features/inventory/components/inventory-main/inventory.component';
import { ContractsComponent } from './features/contracts/components/contracts.component';
import { WarehouseMapComponent } from './features/visual-overview/warehouse-map-component/warehouse-map-component.component';
import { AlleyOverviewComponent } from './features/visual-overview/alley-overview-component/alley-overview-component.component';

// --- Імпорти ОБОЛОНОК (Тобі потрібно буде їх створити) ---
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { AdminUserManagementComponent } from './features/admin-panel/admin-user-management/admin-user-management.component';
import { WarehouseSettingsComponent } from './features/admin-panel/warehouse-settings/warehouse-settings.component';
import { adminGuard } from './core/interceptors/admin-guard.interceptor';
import { ContractDetailsPageComponent } from './features/contracts/components/details/contracts-details-page.component';
import { DocumentManagementComponent } from './features/documents/document-management/document-management.component';
import { DocumentCreateComponent } from './features/documents/document-create/document-create.component';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true; 
  }
  
  return router.parseUrl('/login'); 
};

export const routes: Routes = [
  // 1. ВІДКРИТА СТОРІНКА (Без хедера і сайдбара)
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // 2. ОСНОВНА ОБОЛОНКА (Для працівників)
  {
    path: '',
    component: MainLayoutComponent, // Містить звичайний сайдбар і хедер
    canActivate: [authGuard],       // Захищає ВСІ маршрути всередині children
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'clients', component: ClientsComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contracts', component: ContractsComponent },
      { path: 'contracts/details/:id', component: ContractDetailsPageComponent },
      { path: 'documents', component: DocumentManagementComponent },
      { path: 'documents/new', component: DocumentCreateComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'history', component: DashboardComponent },
      { path: 'visual-overview', component: WarehouseMapComponent },
      { path: 'alleys/:id', component: AlleyOverviewComponent }
    ]
  },

  // 3. АДМІНСЬКА ОБОЛОНКА (Окрема робоча зона)
  {
    path: 'admin',
    component: AdminLayoutComponent, // Містить адмінський сайдбар/меню
    canActivate: [authGuard, adminGuard],        // Сюди потім можна додати adminGuard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'users', component: AdminUserManagementComponent },
      { path: 'warehouse-settings', component: WarehouseSettingsComponent }
    ]
  },

  // 4. ПЕРЕНАПРАВЛЕННЯ (Якщо ввели неіснуючий URL)
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];