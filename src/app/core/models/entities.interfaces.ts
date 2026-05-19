export interface Client {
    id: number;
    name: string;
}

export interface Contract {
    id: number;
    name: string;
    clientId: number;
}