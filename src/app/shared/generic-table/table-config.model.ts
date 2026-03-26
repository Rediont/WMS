export interface TableColumn {
  key: string;      // Назва поля в об'єкті даних (наприклад, 'palletId')
  label: string;    // Що писати в шапці таблиці (наприклад, 'Pallet ID')
  format?: string;  // Опціонально: тип форматування ('date', 'currency', 'text')
}