export interface WeatherReport {
  temp: number;
  text: string;
  icon: string;
  rainProbability: number;
  maxTemp: number;
  cityName: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
}

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const mapWeatherCode = (code: number): { text: string; icon: string } => {
  if (code === 0) return { text: 'Clear Sky', icon: '☀️' };
  if ([1, 2, 3].includes(code)) return { text: 'Partly Cloudy', icon: '⛅' };
  if ([45, 48].includes(code)) return { text: 'Foggy', icon: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { text: 'Rainy', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: 'Snowy', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { text: 'Thunderstorm', icon: '⛈️' };
  return { text: 'Cloudy', icon: '☁️' };
};

export const weatherService = {
  /**
   * Translates a city name string into coordinates using the Open-Meteo Geocoding API
   * @param city City name query (e.g. "Mumbai")
   */
  geocodeCity: async (city: string): Promise<GeocodeResult | null> => {
    if (!city || city.trim() === '') {
      return null;
    }

    try {
      const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(city.trim())}&count=1&format=json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding request failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (!json.results || !Array.isArray(json.results) || json.results.length === 0) {
        return null;
      }

      const first = json.results[0];
      return {
        latitude: first.latitude,
        longitude: first.longitude,
        name: first.name
      };
    } catch (error) {
      console.error('Error geocoding city:', error);
      return null;
    }
  },

  /**
   * Fetches weather metrics for the given coordinates from the Open-Meteo Forecast API
   */
  getWeather: async (latitude: number, longitude: number, cityName: string): Promise<WeatherReport | null> => {
    try {
      const url = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=precipitation_probability_max,temperature_2m_max&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather request failed with status: ${response.status}`);
      }

      const json = await response.json();
      const current = json.current_weather;
      if (!current) {
        return null;
      }

      const mapped = mapWeatherCode(current.weathercode);
      
      // Determine today's daily parameters (first element in the daily lists)
      const rainProbability = json.daily?.precipitation_probability_max?.[0] ?? 0;
      const maxTemp = json.daily?.temperature_2m_max?.[0] ?? current.temperature;

      return {
        temp: current.temperature,
        text: mapped.text,
        icon: mapped.icon,
        rainProbability,
        maxTemp,
        cityName
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }
};
