import { Component } from '@angular/core';
import { HeaderComponent } from "../../../core/layout/header/header.component";
import { SidebarComponent } from "../../../core/layout/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-main',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

}
