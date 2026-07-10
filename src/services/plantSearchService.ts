export interface NormalizedPlantSpecies {
  id: string | number;
  common_name: string;
  scientific_name: string;
  image_url: string;
}

export interface PaginatedSpeciesResponse {
  data: NormalizedPlantSpecies[];
  currentPage: number;
  lastPage: number;
  total: number;
}

export const plantSearchService = {
  /**
   * Search for plant species via our AI Database endpoint
   * @param query Search query keyword
   * @param page Page number to fetch (default: 1, mocked for AI)
   */
  searchSpecies: async (query: string, page = 1): Promise<PaginatedSpeciesResponse> => {
    if (!query || query.trim() === '') {
      return { data: [], currentPage: 1, lastPage: 1, total: 0 };
    }

    try {
      const response = await fetch('/api/plant-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, featured: false })
      });
      if (!response.ok) {
        throw new Error(`AI Search request failed with status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI plant search results:', error);
      return { data: [], currentPage: 1, lastPage: 1, total: 0 };
    }
  },

  /**
   * Get default/featured species listings
   * @param page Page number to fetch
   */
  getFeaturedSpecies: async (page = 1): Promise<PaginatedSpeciesResponse> => {
    try {
      const response = await fetch('/api/plant-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '', featured: true })
      });
      if (!response.ok) {
        throw new Error(`AI Featured search request failed with status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI featured plant species:', error);
      return { data: [], currentPage: 1, lastPage: 1, total: 0 };
    }
  }
};
