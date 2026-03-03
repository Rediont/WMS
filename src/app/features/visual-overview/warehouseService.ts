import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alley } from './models/warehouse.model'; // Вкажіть ваш шлях

@Injectable({
  providedIn: 'root' // Робить сервіс доступним у всьому додатку (Singleton)
})
export class WarehouseService {

  // 1. Початкові Mock-дані (заглушка, поки немає реального бекенду)
  private mockAlleys: Alley[] = [
    { id: 1, name: 'Alley A', occupancy: 20 },
    { id: 2, name: 'Alley B', occupancy: 85 },
    { id: 3, name: 'Alley C', occupancy: 45 },
    { id: 4, name: 'Alley D', occupancy: 98 }
  ];

  // 2. Стан сервісу: BehaviorSubject зберігає актуальні дані
  private alleysSubject = new BehaviorSubject<Alley[]>(this.mockAlleys);

  // 3. Публічний Observable, на який будуть підписуватися компоненти
  public alleys$ = this.alleysSubject.asObservable();

  constructor() { }

  /**
   * Метод для симуляції завантаження даних (на майбутнє для HttpClient)
   */
  loadAlleysFromApi(): void {
    // Тут в майбутньому буде:
    // this.http.get<Alley[]>('api/alleys').subscribe(data => this.alleysSubject.next(data));
  }

  getAlleys(): Alley[] {
    return this.alleysSubject.getValue();
  }

  getAlleyById(id: number): Alley | undefined {
    return this.alleysSubject.getValue().find(alley => alley.id === id);
  }

  updateAlleyOccupancy(id: number, newOccupancy: number): void {
    const currentAlleys = this.alleysSubject.getValue();
    
    // Створюємо новий масив з оновленою алеєю
    const updatedAlleys = currentAlleys.map(alley => 
      alley.id === id ? { ...alley, occupancy: newOccupancy } : alley
    );
    
    // Відправляємо нові дані в потік. Всі компоненти миттєво оновляться!
    this.alleysSubject.next(updatedAlleys);
  }
}