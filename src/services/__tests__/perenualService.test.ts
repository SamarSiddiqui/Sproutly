import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { perenualService, normalizeSpecies } from '../perenualService';

describe('perenualService - normalizeSpecies', () => {
  const fallbackImage = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800';

  test('normalizes standard API response object', () => {
    const rawItem = {
      id: 101,
      common_name: 'Swiss Cheese Plant',
      scientific_name: ['Monstera deliciosa'],
      default_image: {
        regular_url: 'https://perenual.com/monstera.jpg'
      }
    };

    const result = normalizeSpecies(rawItem);
    expect(result).toEqual({
      id: 101,
      common_name: 'Swiss Cheese Plant',
      scientific_name: 'Monstera deliciosa',
      image_url: 'https://perenual.com/monstera.jpg'
    });
  });

  test('normalizes prompt custom format (name and scientific_name as string)', () => {
    const rawItem = {
      id: 'custom-202',
      name: 'Ficus lyrata',
      scientific_name: 'Ficus lyrata',
      default_image: {
        regular_url: 'https://perenual.com/ficus.jpg'
      }
    };

    const result = normalizeSpecies(rawItem);
    expect(result).toEqual({
      id: 'custom-202',
      common_name: 'Ficus lyrata',
      scientific_name: 'Ficus lyrata',
      image_url: 'https://perenual.com/ficus.jpg'
    });
  });

  test('substitutes premium upgrade placeholder image with Unsplash fallback', () => {
    const rawItem = {
      id: 5,
      common_name: 'Premium Plant',
      scientific_name: ['Planta grandis'],
      default_image: {
        regular_url: 'https://s3.us-central-1.wasabisys.com/perenual/image/upgrade_access.jpg?X-Amz-Expires=86400'
      }
    };

    const result = normalizeSpecies(rawItem);
    expect(result.image_url).toBe(fallbackImage);
  });

  test('gracefully handles missing image, common_name, or scientific_name', () => {
    const rawItem = {
      id: 303
    };

    const result = normalizeSpecies(rawItem);
    expect(result).toEqual({
      id: 303,
      common_name: 'Unknown Plant',
      scientific_name: 'Unknown Species',
      image_url: fallbackImage
    });
  });

  test('gracefully handles null or undefined input', () => {
    const result1 = normalizeSpecies(null);
    expect(result1.common_name).toBe('Unknown Plant');
    expect(result1.scientific_name).toBe('Unknown Species');
    expect(result1.image_url).toBe(fallbackImage);

    const result2 = normalizeSpecies(undefined);
    expect(result2.common_name).toBe('Unknown Plant');
  });
});

describe('perenualService - API methods', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('searchSpecies fetches and maps query results successfully (standard "data" envelope)', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          common_name: 'Fern',
          scientific_name: ['Polypodiopsida'],
          default_image: { regular_url: 'https://perenual.com/fern.jpg' }
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const results = await perenualService.searchSpecies('fern');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://perenual.com/api/species-list?key=sk-qyct6a40bc826256918455&q=fern')
    );
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      id: 1,
      common_name: 'Fern',
      scientific_name: 'Polypodiopsida',
      image_url: 'https://perenual.com/fern.jpg'
    });
  });

  test('searchSpecies fetches and maps query results successfully (custom "results" envelope)', async () => {
    const mockResponse = {
      results: [
        {
          id: 2963,
          name: 'Ficus lyrata',
          scientific_name: 'Ficus lyrata',
          default_image: { regular_url: 'https://perenual.com/ficus.jpg' }
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const results = await perenualService.searchSpecies('Ficus');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      id: 2963,
      common_name: 'Ficus lyrata',
      scientific_name: 'Ficus lyrata',
      image_url: 'https://perenual.com/ficus.jpg'
    });
  });

  test('searchSpecies returns empty array if response is not ok', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    const results = await perenualService.searchSpecies('test');
    expect(results).toEqual([]);
  });

  test('searchSpecies returns empty array for blank queries without making API call', async () => {
    const results = await perenualService.searchSpecies('   ');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(results).toEqual([]);
  });

  test('getFeaturedSpecies fetches and normalizes default species listing', async () => {
    const mockResponse = {
      data: [
        {
          id: 5,
          common_name: 'Rose',
          scientific_name: ['Rosa'],
          default_image: null
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const results = await perenualService.getFeaturedSpecies();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://perenual.com/api/species-list?key=sk-qyct6a40bc826256918455'
    );
    expect(results).toHaveLength(1);
    expect(results[0].common_name).toBe('Rose');
    expect(results[0].scientific_name).toBe('Rosa');
  });
});
