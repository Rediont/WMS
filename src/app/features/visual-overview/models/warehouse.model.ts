export interface Cell {
  id: number;
  position: string; // Наприклад: "A1-01"
  isOccupied: boolean;
  occupancyPercentage: number;
}

export interface Alley {
  id: number;
  name: string;
  occupancy: number;
  cells: Cell[];
}

export interface AlleyOccupancy {
  alleyId: number;
  occupancyPercentage: number;
}

export interface CellOccupancyDto {
  cellIndex: number;
  freeCapacity: number;
}

export interface AlleyCellOccupancyMapDto {
  alleyIndex: number;
  floorIndex: number;
  cellOccupancies: CellOccupancyDto[];
}