export interface PalletInfo {
  id: number;
  arrivalDocumentId: number;
  arrivalDate: string; 
  palletTypeId: number;
  palletTypeName: string;
  alleyIndex: number | null; 
  cellIndex: number | null;  
  palletStatus: number;
  palletStatusName?: string;
  index?: number;
}

