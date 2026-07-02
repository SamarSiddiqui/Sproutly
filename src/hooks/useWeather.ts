import { useQuery } from '@tanstack/react-query';
import { weatherService, WeatherReport } from '../services/weatherService';

export function useWeather(latitude?: number, longitude?: number, locationName?: string) {
  return useQuery<WeatherReport | null>({
    queryKey: ['weather', latitude, longitude, locationName],
    queryFn: async () => {
      if (latitude === undefined || longitude === undefined) {
        if (!locationName || locationName.trim() === '') {
          return null;
        }

        // Geocode city string to coordinates first
        const geo = await weatherService.geocodeCity(locationName);
        if (!geo) return null;

        // Query weather
        return await weatherService.getWeather(geo.latitude, geo.longitude, geo.name);
      }

      // Query weather directly with GPS coords
      return await weatherService.getWeather(latitude, longitude, locationName || 'GPS Location');
    },
    enabled: !!(latitude !== undefined && longitude !== undefined) || !!(locationName && locationName.trim() !== ''),
    staleTime: 15 * 60 * 1000, // Cache weather for 15 minutes to prevent redundant API calls
  });
}
