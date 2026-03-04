import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/components/client-main-component/clients.component';
import { InventoryComponent } from './features/inventory/components/inventory-main/inventory.component';
import { ContractsComponent } from './features/contracts/components/contracts.component';
import { ReceiptComponent} from './features/receipts/receipt-component/receipt-component.component';
import { ShipmentsComponent } from './features/shipments/shipments-component/shipments-component.component';
import { WarehouseMapComponent } from './features/visual-overview/warehouse-map-component/warehouse-map-component.component';
import { AlleyOverviewComponent } from './features/visual-overview/alley-overview-component/alley-overview-component.component';

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'contracts', component: ContractsComponent},
    {path: 'receipts', component: ReceiptComponent},
    {path: 'shipments', component: ShipmentsComponent},
    {path: 'clients', component: ClientsComponent},
    {path: 'inventory', component: InventoryComponent},
    {path: 'history', component: DashboardComponent},
    {path: 'visual-overview', component: WarehouseMapComponent},
    {path: 'alleys/:id', component: AlleyOverviewComponent}
];
