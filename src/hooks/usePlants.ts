import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import { Plant, initialPlants } from '../data/plants';
import { mapDbRowToPlant, mapPlantToDbRow } from '../utils/plantMapper';

export const plantsQueryKey = ['plants'];

export function usePlants() {
  const queryClient = useQueryClient();

  const plantsQuery = useQuery<Plant[]>({
    queryKey: plantsQueryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(mapDbRowToPlant);
    },
  });

  const addPlantMutation = useMutation({
    mutationFn: async (newPlantData: Omit<Plant, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // Enforce 10-plant limit for Free Tier
      const { count, error: countError } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!countError && count !== null && count >= 10) {
        throw new Error('MAX_PLANTS_REACHED');
      }

      const dbRow = mapPlantToDbRow(newPlantData, user.id);
      const { data, error } = await supabase
        .from('plants')
        .insert([dbRow])
        .select('*')
        .single();

      if (error) throw error;
      return mapDbRowToPlant(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantsQueryKey });
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Plant> }) => {
      const dbRow = mapPlantToDbRow(updatedData);
      const { data, error } = await supabase
        .from('plants')
        .update(dbRow)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return mapDbRowToPlant(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantsQueryKey });
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantsQueryKey });
    },
  });

  const replacePlantsMutation = useMutation({
    mutationFn: async (nextPlants: Plant[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // 1. Delete all existing plants
      const { error: deleteError } = await supabase
        .from('plants')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // 2. Insert new list
      if (nextPlants.length > 0) {
        const rows = nextPlants.map((p) => {
          const row = mapPlantToDbRow(p, user.id);
          delete row.id; // DB generates UUID
          return row;
        });

        const { data, error: insertError } = await supabase
          .from('plants')
          .insert(rows)
          .select('*');

        if (insertError) throw insertError;
        return data ? data.map(mapDbRowToPlant) : [];
      }

      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantsQueryKey });
    },
  });

  return {
    plants: plantsQuery.data || [],
    loading: plantsQuery.isLoading,
    isError: plantsQuery.isError,
    error: plantsQuery.error,
    addPlant: async (p: Omit<Plant, 'id'>) => {
      await addPlantMutation.mutateAsync(p);
    },
    updatePlant: async (id: string, p: Partial<Plant>) => {
      await updatePlantMutation.mutateAsync({ id, updatedData: p });
    },
    deletePlant: async (id: string) => {
      await deletePlantMutation.mutateAsync(id);
    },
    replacePlants: async (next: Plant[]) => {
      await replacePlantsMutation.mutateAsync(next);
    },
    resetPlants: async () => {
      await replacePlantsMutation.mutateAsync(initialPlants);
    },
  };
}
