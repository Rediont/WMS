export interface DocumentObject {
  id: number;
  type: string;
  clientId: number;
  clientName: string;
  contractId: number;
  contractName: string;
  creationDate: string;
}

export interface DocumentItemForm {
  palletTypeId: number;
  expectedAmount: number;
}

export interface NewDocumentForm {
  documentTypeId: number;
  clientId: number;
  contractId: number;
  items: DocumentItemForm[];
}

