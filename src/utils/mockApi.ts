import { plantDatabase, PlantSpecies } from './mockData';

// Simulate an API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * Search for plant species by name or scientific name
   * @param query Search string
   * @returns List of matching plant species
   */
  searchPlants: async (query: string): Promise<PlantSpecies[]> => {
    await delay(500); // simulate network latency
    
    if (!query || query.trim() === '') {
      return plantDatabase;
    }

    const lowerQuery = query.toLowerCase();
    return plantDatabase.filter(plant => 
      plant.name.toLowerCase().includes(lowerQuery) || 
      plant.scientificName.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get a specific plant species by its ID
   * @param id The ID of the plant species
   * @returns The plant species or undefined if not found
   */
  getPlantById: async (id: string): Promise<PlantSpecies | undefined> => {
    await delay(300); // simulate network latency
    return plantDatabase.find(plant => plant.id === id);
  },

  /**
   * Get plants by their category (e.g. Indoor, Direct Sun)
   * @param category The category to filter by
   * @returns List of matching plant species
   */
  getPlantsByCategory: async (category: string): Promise<PlantSpecies[]> => {
    await delay(400); // simulate network latency
    return plantDatabase.filter(plant => plant.category === category);
  }
};
