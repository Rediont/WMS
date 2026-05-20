export interface BillRecordDto
{
    id : number;
    clientId : number;
    clientName : string;
    contractId : number;
    contractName : string;
    creationDate : Date;
    total : number;
    isPaid : boolean;
}