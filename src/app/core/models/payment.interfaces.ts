export interface BillItem {
    palletTypeId: number;
    palletTypeName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface BillDto {
    clientId: number;
    totalCost: number;
    items: BillItem[];
}