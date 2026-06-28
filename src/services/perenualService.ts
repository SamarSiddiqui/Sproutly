export interface NormalizedPlantSpecies {
  id: string | number;
  common_name: string;
  scientific_name: string;
  image_url: string;
}

const API_KEY = import.meta.env.VITE_PERENUAL_API_KEY || 'sk-qyct6a40bc826256918455';
const BASE_URL = 'https://perenual.com/api/species-list';

// A high-quality Unsplash image to use if no regular_url is provided
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800';

/**
 * Normalizes a raw item from the Perenual API response.
 * Handles both the official response ('common_name', 'scientific_name')
 * and the user's custom prompt response structure ('name', 'scientific_name' as string).
 */
export const normalizeSpecies = (item: any): NormalizedPlantSpecies => {
  if (!item) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      common_name: 'Unknown Plant',
      scientific_name: 'Unknown Species',
      image_url: DEFAULT_FALLBACK_IMAGE
    };
  }

  // Determine common name (maps to name or common_name)
  const commonName = item.common_name || item.name || 'Unknown Plant';

  // Determine scientific name (can be string or array of strings)
  let scientificName = 'Unknown Species';
  if (Array.isArray(item.scientific_name) && item.scientific_name.length > 0) {
    scientificName = item.scientific_name[0];
  } else if (typeof item.scientific_name === 'string') {
    scientificName = item.scientific_name;
  } else if (item.scientific_name) {
    scientificName = String(item.scientific_name);
  }

  // Determine image URL
  let imageUrl = DEFAULT_FALLBACK_IMAGE;
  if (item.default_image && typeof item.default_image === 'object') {
    const candidateUrl = item.default_image.regular_url || 
                         item.default_image.medium_url || 
                         item.default_image.original_url || 
                         item.default_image.thumbnail;

    // Check if the image points to the premium upgrade placeholder image
    if (candidateUrl && !candidateUrl.includes('upgrade_access.jpg')) {
      imageUrl = candidateUrl;
    }
  }

  return {
    id: item.id || Math.random().toString(36).substring(2, 9),
    common_name: commonName,
    scientific_name: scientificName,
    image_url: imageUrl
  };
};

export const perenualService = {
  /**
   * Search for plant species in the Perenual database
   * @param query Search query keyword
   */
  searchSpecies: async (query: string): Promise<NormalizedPlantSpecies[]> => {
    if (!query || query.trim() === '') {
      return [];
    }

    try {
      const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API request failed with status: ${response.status}`);
      }
      
      const json = await response.json();
      
      // Support standard API format (`data`) and search formats matching (`results`)
      const list = json.data || json.results;
      if (!Array.isArray(list)) {
        return [];
      }

      return list.map(normalizeSpecies);
    } catch (error) {
      console.error('Error fetching plant search results:', error);
      return [];
    }
  },

  /**
   * Get default/featured species listings
   */
  getFeaturedSpecies: async (): Promise<NormalizedPlantSpecies[]> => {
    try {
      const url = `${BASE_URL}?key=${API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Perenual API request failed with status: ${response.status}`);
      }

      const json = await response.json();
      const list = json.data || json.results;
      if (!Array.isArray(list)) {
        return [];
      }

      return list.map(normalizeSpecies);
    } catch (error) {
      console.error('Error fetching featured plant species:', error);
      return [];
    }
  }
};
