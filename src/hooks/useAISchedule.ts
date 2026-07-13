import { useQuery } from '@tanstack/react-query';
import { Plant } from '../data/plants';
import { DailyForecast } from '../services/weatherService';

export interface AIScheduleAdjustment {
  adjusted: boolean;
  daysOff: number;
  reason: string;
}

export function useAISchedule(plant: Plant | null | undefined, forecast: DailyForecast[] | undefined) {
  return useQuery<AIScheduleAdjustment | null>({
    queryKey: ['ai-schedule', plant?.id, forecast?.[0]?.date],
    queryFn: async () => {
      if (!plant || !forecast || forecast.length === 0) return null;

      const response = await fetch('/api/ai-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant, forecast })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI schedule');
      }

      return await response.json();
    },
    enabled: !!plant && !!forecast && forecast.length > 0,
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours to save API costs
  });
}
