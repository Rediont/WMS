export interface ReceiptObject {
  id: number;
  date: string; // Можна використовувати тип Date, якщо потрібно
  supplierId: number;
  status: string;
}