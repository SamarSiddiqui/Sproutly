import { useQuery } from '@tanstack/react-query';
import { Plant } from '../data/plants';
import { WeatherReport } from '../services/weatherService';

export interface AICareInsights {
  dailyVibe: string;
  growthInsights: string;
  coreCareTips: { title: string; tip: string; }[];
  fertilizerRecommendations: string;
}

export function useAICareInsights(plant: Plant | null | undefined, weather: WeatherReport | null | undefined) {
  return useQuery<AICareInsights | null>({
    queryKey: ['ai-care-insights', plant?.id],
    queryFn: async () => {
      if (!plant) return null;

      const response = await fetch('/api/ai-care-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant, weather })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI care insights');
      }

      return await response.json();
    },
    enabled: !!plant,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
