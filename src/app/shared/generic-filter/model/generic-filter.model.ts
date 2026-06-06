export type FilterType = 'text' | 'number' | 'select' | 'date' | 'date-range'; // Додано date-range

export interface FilterOption {
  value: any;
  display: string;
}

export interface FilterField {
  key: string;          // Назва поля в об'єкті (наприклад, 'name' або 'EDRPO')
  label: string;        // Те, що побачить користувач
  type: FilterType;     // Тип контрола
  options?: FilterOption[]; // Тільки для типу 'select'
}