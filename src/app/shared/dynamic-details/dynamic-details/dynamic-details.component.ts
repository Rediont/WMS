import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetailsConfig } from '../models/detail-config.model';
import { MatDivider } from "@angular/material/divider";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-details',
  standalone: true,
  imports: [MatDivider, CommonModule, MatButtonModule],
  templateUrl: './dynamic-details.component.html',
  styleUrl: './dynamic-details.component.scss'
})
export class DynamicDetailsComponent {
  // Конфігурація того, ЩО показувати
  @Input({ required: true }) config!: DetailsConfig;
  
  // Самі дані (об'єкт Контракту, Клієнта тощо)
  @Input({ required: true }) data: any = {};

  // Опціональні додаткові дані (наприклад, масив зв'язаних сутностей)
  @Input() extraData: any = null;

  // Випромінює подію, коли користувач натискає якусь кнопку
  @Output() actionClicked = new EventEmitter<string>();

  onActionClick(actionId: string) {
    this.actionClicked.emit(actionId);
  }

}
