import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './table-config.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th *ngFor="let col of columns">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" 
              (click)="rowClicked.emit(row)" 
              style="cursor: pointer">
            
            <td *ngFor="let col of columns">
              
              @if (col.key === 'index') {
                 {{ i + 1 }}
              } @else {
                 {{ row[col.key] }}
              }
              
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="data.length === 0" class="no-data">
        No records found.
      </div>
    </div>
  `,
  styles: [`
    thead th {
        position: sticky;
        top: 0;
        background-color: #f8f9fa;
        z-index: 1;
        border-bottom: 2px solid #dee2e6;
        padding: 12px;
        text-align: left;
    }

    table { 
        width: 100%; 
        border-collapse: collapse; 
    }
    
    th, td { 
        padding: 12px; 
        border-bottom: 1px solid #ddd; 
        text-align: left; 
    }
    
    tr:hover { 
        background-color: #f5f5f5; 
    }
  `]
})
export class GenericTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Output() rowClicked = new EventEmitter<any>();
}