import { useQuery } from '@tanstack/react-query';
import { perenualService, PaginatedSpeciesResponse } from '../services/perenualService';

export function useSpeciesSearch(query: string, page = 1) {
  return useQuery<PaginatedSpeciesResponse>({
    queryKey: ['speciesSearch', query, page],
    queryFn: async () => {
      if (!query || query.trim() === '') {
        return await perenualService.getFeaturedSpecies(page);
      }
      return await perenualService.searchSpecies(query, page);
    },
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });
}
