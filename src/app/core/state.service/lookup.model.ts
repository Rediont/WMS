// lookup.model.ts
export interface LookupItem {
  id: number;
  name: string; 
}

export interface ContractLookupItem {
  id: number;
  contractName: string;
  clientId: number;
  clientName: string;
  status: number; 
}

export interface PalletTypeLookupItem extends LookupItem {
  size: string;
  cost: number;
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
  contracts: ContractLookupItem[];
  palletTypes: PalletTypeLookupItem[];
  warehouseSettings: WarehouseSettingsLookup;
  documentTypes: LookupItem[];
}