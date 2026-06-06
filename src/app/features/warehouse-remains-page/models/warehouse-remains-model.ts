export interface WarehouseRemainsObject {
  clientId: number | null;
  clientName: string | null;
  contractId: number | null;
  contractName: string | null;
  palletTypeId: number | null;
  palletTypeName: string | null;
  
  transactionDate: string; 
  
  amount: number;
}