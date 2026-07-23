export type Category = 'Indoor' | 'Semi-Shade' | 'Direct Sun';
export type GrowthStage = 'Seedling' | 'Growing' | 'Mature' | 'Flowering';
export type PottingStatus = 'nursery' | 'own';
export type HealthStatus =
'healthy' |
'needs-water' |
'needs-pruning' |
'needs-fertilizer';

export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  category: Category;
  growthStage: GrowthStage;
  lastWatered: string; // ISO date string
  nextWatering: string; // ISO date string
  waterInterval: number; // in days
  fertilizerCycle: number; // in days
  lastFertilized: string; // ISO date string
  pruningSeasons: string[];
  pottingStatus: PottingStatus;
  healthStatus: HealthStatus;
  potSize: string;
  location: string;
  isPetFriendly: boolean;
  notes: string;
}

export const initialPlants: Plant[] = [];
