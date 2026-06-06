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
import { PalletTypesComponent } from './features/admin-panel/pallet-types/component/pallet-types.component';
import { AdminTabComponent } from './core/layout/tab-components/admin-tab-component/admin-tab.component';
import { WarehouseManagementTabComponent } from './core/layout/tab-components/warehouse-management-tab/warehouse-management-tab.component';
import { WorkflowTabComponent } from './core/layout/tab-components/workflow-tab/workflow-tab.component';
import { WarehouseRemainsComponent } from './features/warehouse-remains-page/warehouse-remains/warehouse-remains.component';
import { PaymentsPageComponent } from './features/payment-system/payments-page/payments-page.component';
import { BillPageComponent } from './features/payment-system/bill-page/bill-page.component';
import { PalletBindingMainComponent } from './features/pallet-binding/components/pallet-binding-main/pallet-binding-main.component';
import { PalletBindingComponent } from './features/pallet-binding/components/pallet-binding/pallet-binding.component';

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
      { path: 'dashboard', component: DashboardComponent },
      { path: 'history', component: DashboardComponent },

      {
         path: 'admin',
        component: AdminTabComponent,
        canActivate: [adminGuard],
        children: 
        [
          { path: '', redirectTo: 'user-management', pathMatch: 'full' },
          { path: 'user-management', component: AdminUserManagementComponent },
          { path: 'warehouse-settings', component: WarehouseSettingsComponent },
          { path: 'pallet-types', component: PalletTypesComponent }
        ]
      },

      { 
        path: 'warehouse',
        component: WarehouseManagementTabComponent,
        children: [
          { path: '', redirectTo: 'visual-overview', pathMatch: 'full'},
          { path: 'inventory', component: InventoryComponent },
          { path: 'visual-overview', component: WarehouseMapComponent },
          { path: 'visual-overview/alley/:id', component: AlleyOverviewComponent },
          { path: 'remains', component: WarehouseRemainsComponent },
          { path: 'pallet-binding', component: PalletBindingMainComponent },
          { path: 'pallet-binding/:documentId', component: PalletBindingComponent }
        ]
      },

      {
        path: 'workflow',
        component: WorkflowTabComponent,
        children: [
          { path: '', redirectTo: 'contracts', pathMatch: 'full'},
          { path: 'clients', component: ClientsComponent },
          { path: 'contracts', component: ContractsComponent },
          { path: 'contracts/details/:id', component: ContractDetailsPageComponent },
          { path: 'documents', component: DocumentManagementComponent },
          { path: 'documents/new', component: DocumentCreateComponent },
          { path: 'payments', component: PaymentsPageComponent},
          { path: 'payments/add-bill', component: BillPageComponent}
        ]
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];