// lookup.model.ts
export interface LookupItem {
  id: number;
  name: string; // Або title/description, залежно від того, як ти назвав у C#
}

export interface GlobalLookup {
  clients: LookupItem[];
  contracts: LookupItem[];
  palletTypes: LookupItem[];
}