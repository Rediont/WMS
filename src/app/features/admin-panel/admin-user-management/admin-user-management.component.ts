import { Component, inject, signal } from '@angular/core';
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from './dialog-form/user-form-dialog.component';
import { UserManagementService } from './service/user-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-user-management',
  imports: [GenericTableComponent, MatButton],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss'
})
export class AdminUserManagementComponent {
  private dialog = inject(MatDialog);
  private userService = inject(UserManagementService);
  private snackBar = inject(MatSnackBar);

  // Використовуємо сигнал для обраного користувача
  selectedUser = signal<any | null>(null);


  users : any[] = []

  userManagementColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'User ID' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  rowIdKeyForUsers = 'id';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Тут ти маєш тягнути список користувачів з бекенду
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }


  onRowSelect(user: any) {
    this.selectedUser.set(this.selectedUser()?.id === user.id ? null : user);
  }

onAddUser() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: null 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result містить дані з форми (email, password, role)
        this.userService.registerUser(result).subscribe({
          next: (successMessage) => {
            // Показуємо успішне повідомлення від бекенду
            this.snackBar.open(successMessage, 'OK', { duration: 3000 });
            
            // Оновлюємо таблицю, щоб новий користувач з'явився у списку
            this.loadUsers();
          },
          error: (err) => {
            // Identity повертає BadRequest, Angular ховає текст помилки в err.error
            console.error('Помилка реєстрації:', err);
            const errorMessage = typeof err.error === 'string' 
                ? err.error 
                : 'Не вдалося створити користувача. Перевірте вимоги до пароля.';
                
            this.snackBar.open(errorMessage, 'Закрити', { duration: 5000 });
          }
        });
      }
    });
  }

  // --- ЛОГІКА РЕДАГУВАННЯ ---
  onEditUser() {
    const userToEdit = this.selectedUser();
    if (!userToEdit) return;

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      data: { ...userToEdit } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = this.users.map(u => u.id === result.id ? result : u);
        this.selectedUser.set(result);
      }
    });
  }

  // --- ЛОГІКА ВИДАЛЕННЯ ---
  onDeleteUser() {
    const userToDelete = this.selectedUser();
    if (!userToDelete) return;

    const confirmed = confirm(`Ви впевнені, що хочете видалити користувача ${userToDelete.name}?`);
    
    if (confirmed) {
      this.users = this.users.filter(u => u.id !== userToDelete.id);
      this.selectedUser.set(null); 
    }
  }


}
