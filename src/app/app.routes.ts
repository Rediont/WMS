import { Router, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/components/client-main-component/clients.component';
import { InventoryComponent } from './features/inventory/components/inventory-main/inventory.component';
import { ContractsComponent } from './features/contracts/components/contracts.component';
import { ReceiptComponent} from './features/receipts/receipt-component/receipt-component.component';
import { ShipmentsComponent } from './features/shipments/shipments-component/shipments-component.component';
import { WarehouseMapComponent } from './features/visual-overview/warehouse-map-component/warehouse-map-component.component';
import { AlleyOverviewComponent } from './features/visual-overview/alley-overview-component/alley-overview-component.component';
import { inject } from '@angular/core';
import { LoginComponent } from './features/login/login.component';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true; // Токен є, пропускаємо користувача на сторінку
  }
  
  // Токена немає, примусово перекидаємо на сторінку логіну
  return router.parseUrl('/login'); 
};

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'contracts', component: ContractsComponent, canActivate: [authGuard]},
    {path: 'receipts', component: ReceiptComponent, canActivate: [authGuard]},
    {path: 'shipments', component: ShipmentsComponent, canActivate: [authGuard]},
    {path: 'clients', component: ClientsComponent, canActivate: [authGuard]},
    {path: 'inventory', component: InventoryComponent, canActivate: [authGuard]},
    {path: 'history', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'visual-overview', component: WarehouseMapComponent, canActivate: [authGuard]},
    {path: 'alleys/:id', component: AlleyOverviewComponent, canActivate: [authGuard]}
];
