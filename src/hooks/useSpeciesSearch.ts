import { useQuery } from '@tanstack/react-query';
import { plantSearchService, PaginatedSpeciesResponse } from '../services/plantSearchService';

export function useSpeciesSearch(query: string, page = 1) {
  return useQuery<PaginatedSpeciesResponse>({
    queryKey: ['speciesSearch', query, page],
    queryFn: async () => {
      if (!query || query.trim() === '') {
        return await plantSearchService.getFeaturedSpecies(page);
      }
      return await plantSearchService.searchSpecies(query, page);
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });
}
