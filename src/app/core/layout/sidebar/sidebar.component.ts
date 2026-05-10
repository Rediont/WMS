import { Component } from '@angular/core';
import { AuthService } from '../../authentification/auth.service';

@Component({
    selector: 'app-sidebar',
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    user = this.authService.currentUser; 
  
  isAdmin(): boolean {
    const currentRole = this.authService.role;
    // console.log('Поточна роль для перевірки:', currentRole);
    return currentRole === 'Admin';
  }

  constructor(private authService: AuthService) {}
}
