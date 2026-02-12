import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/layout/header/header.component";
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./core/layout/sidebar/sidebar.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, CommonModule, HeaderComponent, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'WMS';
}
