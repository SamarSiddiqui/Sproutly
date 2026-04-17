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
  fertilizerCycle: number; // in days
  lastFertilized: string; // ISO date string
  pruningSeasons: string[];
  pottingStatus: PottingStatus;
  healthStatus: HealthStatus;
  notes: string;
}

export const initialPlants: Plant[] = [
{
  id: '1',
  name: 'Monstera Deliciosa',
  species: 'Monstera deliciosa',
  image:
  'https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&q=80&w=800',
  category: 'Indoor',
  growthStage: 'Growing',
  lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 30,
  lastFertilized: new Date(
    Date.now() - 15 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Spring', 'Summer'],
  pottingStatus: 'own',
  healthStatus: 'healthy',
  notes: 'Doing well in the living room corner.'
},
{
  id: '2',
  name: 'Balcony Bougainvillea',
  species: 'Bougainvillea glabra',
  image:
  'https://images.unsplash.com/photo-1596061358980-811c7e923180?auto=format&fit=crop&q=80&w=800',
  category: 'Direct Sun',
  growthStage: 'Flowering',
  lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 15,
  lastFertilized: new Date(
    Date.now() - 20 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Winter', 'Early Spring'],
  pottingStatus: 'own',
  healthStatus: 'needs-water',
  notes: 'Needs more frequent watering during bloom.'
},
{
  id: '3',
  name: 'Kitchen Basil',
  species: 'Ocimum basilicum',
  image:
  'https://images.unsplash.com/photo-1620014761405-72816f1165a6?auto=format&fit=crop&q=80&w=800',
  category: 'Semi-Shade',
  growthStage: 'Mature',
  lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 14,
  lastFertilized: new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['All Year'],
  pottingStatus: 'nursery',
  healthStatus: 'healthy',
  notes: 'Pinch off flowers to keep leaves sweet.'
},
{
  id: '4',
  name: 'Fiddle Leaf Fig',
  species: 'Ficus lyrata',
  image:
  'https://images.unsplash.com/photo-1597055181300-e3633a017419?auto=format&fit=crop&q=80&w=800',
  category: 'Indoor',
  growthStage: 'Growing',
  lastWatered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 30,
  lastFertilized: new Date(
    Date.now() - 40 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Spring'],
  pottingStatus: 'own',
  healthStatus: 'needs-fertilizer',
  notes: 'Leaves looking a bit pale.'
},
{
  id: '5',
  name: 'Jade Plant',
  species: 'Crassula ovata',
  image:
  'https://images.unsplash.com/photo-1599598425947-3300262939fa?auto=format&fit=crop&q=80&w=800',
  category: 'Semi-Shade',
  growthStage: 'Mature',
  lastWatered: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 60,
  lastFertilized: new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Spring', 'Summer'],
  pottingStatus: 'own',
  healthStatus: 'healthy',
  notes: 'Very low maintenance.'
},
{
  id: '6',
  name: 'Money Plant',
  species: 'Epipremnum aureum',
  image:
  'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=800',
  category: 'Indoor',
  growthStage: 'Growing',
  lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 30,
  lastFertilized: new Date(
    Date.now() - 10 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['All Year'],
  pottingStatus: 'nursery',
  healthStatus: 'needs-pruning',
  notes: 'Getting too leggy, needs a trim.'
},
{
  id: '7',
  name: 'Terrace Tomato',
  species: 'Solanum lycopersicum',
  image:
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800',
  category: 'Direct Sun',
  growthStage: 'Seedling',
  lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 14,
  lastFertilized: new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Summer'],
  pottingStatus: 'nursery',
  healthStatus: 'healthy',
  notes: 'Just sprouted!'
},
{
  id: '8',
  name: 'Snake Plant',
  species: 'Sansevieria trifasciata',
  image:
  'https://images.unsplash.com/photo-1593482892290-f54927ae1b7e?auto=format&fit=crop&q=80&w=800',
  category: 'Indoor',
  growthStage: 'Mature',
  lastWatered: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  nextWatering: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  fertilizerCycle: 60,
  lastFertilized: new Date(
    Date.now() - 50 * 24 * 60 * 60 * 1000
  ).toISOString(),
  pruningSeasons: ['Spring'],
  pottingStatus: 'own',
  healthStatus: 'healthy',
  notes: 'Thriving on neglect.'
}];