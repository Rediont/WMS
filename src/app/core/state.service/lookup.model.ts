// lookup.model.ts
export interface LookupItem {
  id: number;
  name: string; // Або title/description, залежно від того, як ти назвав у C#
}

export interface WarehouseSettingsLookup {
  numberOfAlleys: number;
  numberOfAlleyFloors: number;
  numberOfCellsInAlley: number;
  numberOfCellsInAlleyFloor: number;
  numberOfCells: number;
}

export interface GlobalLookup {
  clients: LookupItem[];
  contracts: LookupItem[];
  palletTypes: LookupItem[];
  warehouseSettings: WarehouseSettingsLookup;
}