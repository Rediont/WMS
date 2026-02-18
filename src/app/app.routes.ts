import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/components/client-main-component/clients.component';
import { InventoryComponent } from './features/inventory/components/inventory-main/inventory.component';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'clients', component: ClientsComponent},
    {path: 'inventory', component: InventoryComponent},
];
