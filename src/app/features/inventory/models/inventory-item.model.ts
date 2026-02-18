export interface InventoryItem {
  id?: number; // Може не бути при створенні
  palletId: number;
  name: string;
  alley: string;
  type?: string; // Необов'язкове поле, може бути визначене пізніше

}