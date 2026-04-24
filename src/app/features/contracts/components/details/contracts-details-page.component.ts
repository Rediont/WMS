import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../contract.service';
import { DetailsConfig } from '../../../../shared/dynamic-details/models/detail-config.model';
import { DynamicDetailsComponent } from '../../../../shared/dynamic-details/dynamic-details/dynamic-details.component';

@Component({
  selector: 'app-contract-details-page',
  imports: [DynamicDetailsComponent],
  template: `
    @if (isLoading) {
    <div>Завантаження...</div>
    } @else if (contractData) {
    <app-dynamic-details 
        [config]="contractDetailsConfig" 
        [data]="contractData"
        [extraData]="inboundsList"
        (actionClicked)="handleAction($event)">
        
        <div class="extra-section">
        <h3>Прибуття за цим контрактом</h3>
        </div>

    </app-dynamic-details>
    }
  `
})
export class ContractDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);

  isLoading = true;
  contractData: any;
  inboundsList: any[] = []; // Ті самі додаткові дані

  // КОНФІГУРАЦІЯ ДЛЯ КОНТРАКТУ
  contractDetailsConfig: DetailsConfig = {
    title: 'Картка Контракту',
    fields: [
      { key: 'id', label: 'ID Контракту' },
      { key: 'name', label: 'Назва' },
      { key: 'startDate', label: 'Дата початку', type: 'date' },
      { key: 'statusDisplay', label: 'Статус', type: 'badge' }
    ],
    actions: [
      { actionId: 'edit', label: 'Редагувати', color: 'accent' },
      { actionId: 'terminate', label: 'Розірвати', color: 'warn' },
      { actionId: 'back', label: 'Повернутись', color: 'primary' }
    ]
  };

  ngOnInit() {
    // 1. Беремо ID з URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFullContractInfo(Number(id));
    }
  }

  // 2. ВАНТАЖИМО БАГАТО ДАНИХ (саме те, що ти просив)
  loadFullContractInfo(id: number) {
    this.isLoading = true;
    
    // Тут можна використати forkJoin, щоб завантажити контракт і додаткові дані паралельно
    this.contractService.getContractById(id).subscribe(contract => {
      this.contractData = contract;
      
    //   this.contractService.getInboundsForContract(id).subscribe(inbounds => {
    //     this.inboundsList = inbounds;
    //     this.isLoading = false;
    //   });
    });
  }

  // 3. Обробляємо кліки по кнопках
  handleAction(actionId: string) {
    switch (actionId) {
      case 'back':
        this.router.navigate(['/contracts']);
        break;
      case 'edit':
        // Відкрити діалог редагування
        console.log('Редагуємо', this.contractData.id);
        break;
      case 'terminate':
        // Виклик API для зміни статусу
        console.log('Розірвання контракту!');
        break;
    }
  }
}