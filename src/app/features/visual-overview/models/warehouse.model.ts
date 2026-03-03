export interface Alley {
  id: number;
  name: string;
  occupancy: number; // Заповненість у відсотках (0 - 100)
}

export interface RackCell {
  id: string;
  level: number;     // Ярус (0 - підлога, 1, 2...)
  section: number;   // Секція по горизонталі (1, 2, 3...)
  status: 'empty' | 'full' | 'blocked';
  palletId?: string;
}