export interface Contract {
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
    StartDate: string; 
    EndDate: string;
}
