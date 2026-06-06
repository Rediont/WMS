import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { PaymentService } from '../payment-system/payment.service';
import { AppStateService } from '../../core/state.service/state.service';
import { BillRecordDto } from '../payment-system/models/bill.model';
import { AlleyOccupancy } from '../visual-overview/models/warehouse.model';
import { WarehouseService } from '../visual-overview/warehouseService';
import { CellStatsDto } from './model/dashboard.model';
import { WeeklyDocumentStatsDto } from '../documents/model/document.model';
import { DocumentService } from '../documents/document.service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('capacityChart') capacityChart!: ChartComponent;
  @ViewChild('throughputChart') throughputChart!: ChartComponent;

  private stateService = inject(AppStateService);
  private paymentService = inject(PaymentService);
  private warehouseService = inject(WarehouseService);
  private documentService = inject(DocumentService);

  public capacityChartOptions: Partial<ApexOptions> = {};
  public throughputChartOptions: Partial<ApexOptions> = {};

  unpaidBills: BillRecordDto[] = [];
  systemStats = {
    clients: 0,
    contracts: 0,
  };

  alleysCapacity : AlleyOccupancy[] = [];

  cellStats: CellStatsDto = {
    freeCells: 0,
    occupiedCells: 0,
    blockedCells: 0,
    totalCells: 0
  };

  ngOnInit() {
    this.initCapacityChart();
    this.initThroughputChart();
    this.loadAlleyOccupancy();
    this.loadCellStats();
    this.loadSystemStats();
    this.loadUnpaidBills();
    this.loadWeeklyStatsData();
  }

  private initCapacityChart() {
    this.capacityChartOptions = {
      series: [this.cellStats.occupiedCells, this.cellStats.freeCells, this.cellStats.blockedCells], // Хардкод для тесту: Зайнято, Вільно, Заблоковано
      chart: {
        type: 'donut',
        height: 220,
        background: 'transparent',
        fontFamily: 'inherit'
      },
      labels: ['Зайняті комірки', 'Вільні комірки', 'Заблоковані'],
      colors: ['#3b82f6', '#10b981', '#ef4444'], // Синій, Зелений, Червоний
      theme: { mode: 'dark' },
      stroke: {
        show: true,
        colors: ['#212121'], // Колір фону твоєї картки (--bg-card), щоб розділити секції
        width: 2
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        labels: { colors: '#ffffff' }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: { show: true, color: '#aaaaaa' },
              value: { show: true, color: '#ffffff', fontSize: '24px', fontWeight: 600 },
              total: {
                show: true,
                showAlways: true,
                label: 'Всього місць',
                color: '#aaaaaa',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                }
              }
            }
          }
        }
      }
    };
  }

  private initThroughputChart() {
    this.throughputChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 220,
        background: 'transparent',
        toolbar: { show: false }, // Ховаємо зайві інструменти графіка
        fontFamily: 'inherit'
      },
      colors: ['#38bdf8', '#fbbf24'], // Блакитний та Жовтий для контрасту
      theme: { mode: 'dark' },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '75%',
          borderRadius: 3
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: {
        tickPlacement: 'between',
        categories: [], 
        labels: { 
          style: { colors: '#aaaaaa' },
          rotate: -45, // 🔴 Нахиляє дати під кутом, щоб вони ніколи не злипалися
          rotateAlways: false,
          offsetY: 5 // 🔴 Трохи відсуває дати від самих стовпчиків вниз
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        title: { text: 'Кількість палет', style: { color: '#aaaaaa' } },
        labels: { style: { colors: '#aaaaaa' } }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } }
      },
      fill: { opacity: 1 },
      tooltip: {
        theme: 'dark',
        y: { formatter: function (val) { return val + ' шт'; } }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#ffffff' }
      }
    };
  }

  loadAlleyOccupancy() {
    this.warehouseService.getAllAlleysOccupancy().subscribe({
      next: (data: AlleyOccupancy[]) => {
        this.alleysCapacity = data;
      },
      error: (err) => {
        console.error('Помилка завантаження даних про заповненість алей:', err);
      }
    });
  }

  loadCellStats() {
    this.stateService.getCellStats().subscribe({
      next: (stats: CellStatsDto) => {
        this.cellStats = stats;
        this.initCapacityChart();
      },
      error: (err) => {
        console.error('Помилка завантаження статистики комірок:', err);
      }
    });
  }

  private loadWeeklyStatsData() {
    this.documentService.getWeeklyStats().subscribe({
      next: (data: WeeklyDocumentStatsDto) => {
        
        this.throughputChartOptions.series = [
          { name: 'Прибуло (палет)', data: data.arrivals },
          { name: 'Відвантажено (палет)', data: data.departures }
        ];

        this.throughputChartOptions.xaxis = {
          ...this.throughputChartOptions.xaxis,
          categories: data.dates
        };

      },
      error: (err) => {
        console.error('Помилка завантаження статистики руху палет:', err);
      }
    });
  }

  private loadSystemStats() {
    const lookups = this.stateService.lookups;
    if (lookups) {
      this.systemStats = {
        clients: lookups.clients?.length || 0,
        contracts: lookups.contracts?.length || 0,
      };
    }
  }

  private loadUnpaidBills() {
    // Завантажуємо першу сторінку платежів
    this.paymentService.loadPayments().subscribe({
      next: (bills: BillRecordDto[]) => {
        // Залишаємо тільки неоплачені і беремо максимум 4 для дашборду
        this.unpaidBills = bills
          .filter(bill => !bill.isPaid)
          .slice(0, 4); 
      },
      error: (err) => {
        console.error('Помилка завантаження рахунків для дашборду:', err);
      }
    });
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 90) return 'danger';   // Червоний (майже повно)
    if (percentage >= 75) return 'warning';  // Жовтий (заповнюється)
    return 'success';                        // Синій/Зелений (багато місця)
  }

}
