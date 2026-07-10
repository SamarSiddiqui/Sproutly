import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { plantSearchService } from '../plantSearchService';

describe('plantSearchService - AI Database methods', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('searchSpecies fetches from /api/plant-search successfully', async () => {
    const mockResponse = {
      currentPage: 1,
      lastPage: 1,
      total: 1,
      data: [
        {
          id: 'test-id-1',
          common_name: 'Tomato',
          scientific_name: 'Solanum lycopersicum',
          image_url: 'placeholder.jpg'
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const results = await plantSearchService.searchSpecies('tomato');
    
    // Verify it called our local API route with POST
    expect(global.fetch).toHaveBeenCalledWith('/api/plant-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'tomato', featured: false })
    });
    
    expect(results.data).toHaveLength(1);
    expect(results.data[0].common_name).toBe('Tomato');
  });

  test('searchSpecies returns empty structure if response is not ok', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    const results = await plantSearchService.searchSpecies('test');
    expect(results).toEqual({ data: [], currentPage: 1, lastPage: 1, total: 0 });
  });

  test('searchSpecies returns empty structure for blank queries without making API call', async () => {
    const results = await plantSearchService.searchSpecies('   ');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(results).toEqual({ data: [], currentPage: 1, lastPage: 1, total: 0 });
  });

  test('getFeaturedSpecies fetches from /api/plant-search with featured flag', async () => {
    const mockResponse = {
      currentPage: 1,
      lastPage: 1,
      total: 1,
      data: [
        {
          id: 'feat-1',
          common_name: 'Monstera',
          scientific_name: 'Monstera deliciosa',
          image_url: 'placeholder.jpg'
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const results = await plantSearchService.getFeaturedSpecies();
    
    expect(global.fetch).toHaveBeenCalledWith('/api/plant-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '', featured: true })
    });
    
    expect(results.data).toHaveLength(1);
    expect(results.data[0].common_name).toBe('Monstera');
  });
});
