import { Component, inject, signal } from '@angular/core';
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from './dialog-form/user-form-dialog.component';
import { UserManagementService } from './service/user-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormConfig } from '../../../shared/dynamic-form/models/dynamic-form.model';
import { Validators } from '@angular/forms';
import { DynamicFormDialogComponent } from '../../../shared/dynamic-form/dynamic-form-component/dynamic-form-dialog.component';

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
    { key: 'id', label: 'ID користувача' },
    { key: 'email', label: 'Пошта' },
    { key: 'role', label: 'Роль' }
  ];

  rowIdKeyForUsers = 'id';

  userFormConfig: FormConfig = {
    title: 'Додати нового користувача',
    submitText: 'Зберегти',
    fields: [
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email]
      },
      {
        key: 'role',
        label: 'Роль',
        type: 'select', // Вказуємо тип select для випадаючого списку
        options: [      // Передаємо масив варіантів
          { value: 'Admin', label: 'Адмін' },
          { value: 'Worker', label: 'Працівник' },
          { value: 'Client', label: 'Клієнт' }
        ],
        validators: [Validators.required]
      },
      {
        key: 'password',
        label: 'Пароль',
        type: 'password',
        validators: [Validators.required, Validators.minLength(6)]
      }
    ]
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }


  onRowSelect(user: any) {
    this.selectedUser.set(this.selectedUser()?.id === user.id ? null : user);
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(DynamicFormDialogComponent, {
      width: '500px',
      data: this.userFormConfig,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // result міститиме { email: '...', role: '...', password: '...' }
      if (result) {
        console.log('Дані з форми:', result);
        
        // Викликаємо сервіс (заміни userService на свій реальний сервіс)
        this.userService.registerUser(result).subscribe({
          next: (createdUser) => {
            this.users = [...this.users, createdUser];
            console.log('Користувача успішно створено');
          },
          error: (err) => {
            console.error('Помилка при створенні користувача:', err);
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
