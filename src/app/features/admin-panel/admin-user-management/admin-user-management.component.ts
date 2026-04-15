import { Component } from '@angular/core';
import { GenericTableComponent } from "../../../shared/generic-table/app-table.component";
import { TableColumn } from '../../../shared/generic-table/table-config.model';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-admin-user-management',
  imports: [GenericTableComponent, MatButton],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss'
})
export class AdminUserManagementComponent {

  users = []

  userManagementColumns: TableColumn[] = [
    { key: 'index', label: '№' },
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  rowIdKeyForUsers = 'id';

}
