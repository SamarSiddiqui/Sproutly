import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { weatherService, mapWeatherCode } from '../weatherService';

describe('weatherService - mapWeatherCode', () => {
  test('maps Clear Sky correctly', () => {
    const result = mapWeatherCode(0);
    expect(result).toEqual({ text: 'Clear Sky', icon: '☀️' });
  });

  test('maps Partly Cloudy correctly', () => {
    const result = mapWeatherCode(2);
    expect(result).toEqual({ text: 'Partly Cloudy', icon: '⛅' });
  });

  test('maps Rainy correctly', () => {
    const result = mapWeatherCode(61);
    expect(result).toEqual({ text: 'Rainy', icon: '🌧️' });
  });

  test('maps Thunderstorm correctly', () => {
    const result = mapWeatherCode(95);
    expect(result).toEqual({ text: 'Thunderstorm', icon: '⛈️' });
  });

  test('fallback maps to Cloudy', () => {
    const result = mapWeatherCode(999);
    expect(result).toEqual({ text: 'Cloudy', icon: '☁️' });
  });
});

describe('weatherService - API methods', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('geocodeCity resolves name to latitude and longitude coordinates', async () => {
    const mockResponse = {
      results: [
        {
          name: 'Mumbai',
          latitude: 19.076,
          longitude: 72.877
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await weatherService.geocodeCity('Mumbai');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://geocoding-api.open-meteo.com/v1/search?name=Mumbai')
    );
    expect(result).toEqual({
      latitude: 19.076,
      longitude: 72.877,
      name: 'Mumbai'
    });
  });

  test('geocodeCity returns null for blank queries', async () => {
    const result = await weatherService.geocodeCity('   ');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('geocodeCity returns null when API response has no results', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] })
    });

    const result = await weatherService.geocodeCity('UnknownCity');
    expect(result).toBeNull();
  });

  test('getWeather fetches forecasts and structures WeatherReport', async () => {
    const mockResponse = {
      current_weather: {
        temperature: 28.5,
        weathercode: 3
      },
      daily: {
        precipitation_probability_max: [80],
        temperature_2m_max: [31.5]
      }
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await weatherService.getWeather(19.076, 72.877, 'Mumbai');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.877')
    );
    expect(result).toEqual({
      temp: 28.5,
      text: 'Partly Cloudy',
      icon: '⛅',
      rainProbability: 80,
      maxTemp: 31.5,
      cityName: 'Mumbai'
    });
  });

  test('getWeather returns null on fetch fail', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    const result = await weatherService.getWeather(19.076, 72.877, 'Mumbai');
    expect(result).toBeNull();
  });
});
