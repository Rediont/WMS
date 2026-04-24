export interface ContractObject {
    contractId: number;
    contractName: string;
    clientId: number;
    clientName: string;
    statusDisplay: string;
}

export interface ApiContractObject {
    name: string;
    clientId: number;
    currentStatus: number; 
}
