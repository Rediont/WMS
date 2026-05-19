
export interface PalletType {
    id: number;
    name: string;
    size: number;
    cost: number;
}

export interface PalletCreateRequestObject {
    name: string;
    size: number;
    cost: number;
}