export interface DocumentObject {
  id: string;
  type: string;
  client: string;
  contract: string;
  createdDate: Date;
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