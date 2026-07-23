import { Plant } from '../data/plants';

export const mapDbRowToPlant = (row: any): Plant => {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    image: row.image || row.image_url || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    category: row.category,
    growthStage: row.growth_stage || row.growthStage || 'Growing',
    lastWatered: row.last_watered || row.lastWatered || new Date().toISOString(),
    nextWatering: row.next_watering || row.nextWatering || new Date().toISOString(),
    waterInterval: row.water_interval || row.waterInterval || 7,
    fertilizerCycle: row.fertilizer_cycle || row.fertilizerCycle || 30,
    lastFertilized: row.last_fertilized || row.lastFertilized || new Date().toISOString(),
    pruningSeasons: Array.isArray(row.pruning_seasons) ? row.pruning_seasons : (row.pruningSeasons || ['Spring']),
    pottingStatus: row.potting_status || row.pottingStatus || 'own',
    healthStatus: row.health_status || row.healthStatus || 'healthy',
    potSize: row.pot_size || row.potSize || '6"',
    location: row.location || 'Living Room',
    isPetFriendly: row.is_pet_friendly ?? row.isPetFriendly ?? false,
    notes: row.notes || ''
  };
};

export const mapPlantToDbRow = (plant: Partial<Plant>, userId?: string): any => {
  const row: any = {};
  if (userId) row.user_id = userId;
  if (plant.name !== undefined) row.name = plant.name;
  if (plant.species !== undefined) row.species = plant.species;
  if (plant.image !== undefined) {
    row.image_url = plant.image;
  }
  if (plant.category !== undefined) row.category = plant.category;
  if (plant.growthStage !== undefined) {
    row.growth_stage = plant.growthStage;
  }
  if (plant.lastWatered !== undefined) {
    row.last_watered = plant.lastWatered;
  }
  if (plant.nextWatering !== undefined) {
    row.next_watering = plant.nextWatering;
  }
  if (plant.waterInterval !== undefined) {
    row.water_interval = plant.waterInterval;
  }
  if (plant.fertilizerCycle !== undefined) {
    row.fertilizer_cycle = plant.fertilizerCycle;
  }
  if (plant.lastFertilized !== undefined) {
    row.last_fertilized = plant.lastFertilized;
  }
  if (plant.pruningSeasons !== undefined) {
    row.pruning_seasons = plant.pruningSeasons;
  }
  if (plant.potSize !== undefined) {
    row.pot_size = plant.potSize;
  }
  if (plant.location !== undefined) {
    row.location = plant.location;
  }
  if (plant.isPetFriendly !== undefined) {
    row.is_pet_friendly = plant.isPetFriendly;
  }
  if (plant.pottingStatus !== undefined) {
    row.potting_status = plant.pottingStatus;
  }
  if (plant.healthStatus !== undefined) {
    row.health_status = plant.healthStatus;
  }
  if (plant.notes !== undefined) row.notes = plant.notes;
  return row;
};
