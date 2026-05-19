
export interface ActivePalletsPerDocumentDto {
    documentId: number;
    activePalletsCount: Record<number, number>;
    totalActivePallets: number;
}

export interface PalletAssignmentDto
{
    palletId: number;
    palletTypeId: number;
}