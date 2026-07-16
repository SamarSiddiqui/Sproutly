import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';

export interface FertilizerLog {
  id: string;
  user_id: string;
  plant_id: string;
  log_date: string;
  fertilizer_type: string;
  notes: string;
  created_at: string;
}

export function useFertilizerLogs(plantId?: string) {
  const queryClient = useQueryClient();

  const logsQuery = useQuery<FertilizerLog[]>({
    queryKey: ['fertilizer_logs', plantId],
    queryFn: async () => {
      if (!plantId) return [];
      
      const { data, error } = await supabase
        .from('fertilizer_logs')
        .select('*')
        .eq('plant_id', plantId)
        .order('log_date', { ascending: false });

      if (error) throw error;
      return data as FertilizerLog[];
    },
    enabled: !!plantId,
  });

  const addLogMutation = useMutation({
    mutationFn: async (newLog: Omit<FertilizerLog, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { data, error } = await supabase
        .from('fertilizer_logs')
        .insert({
          user_id: user.id,
          plant_id: newLog.plant_id,
          log_date: newLog.log_date,
          fertilizer_type: newLog.fertilizer_type,
          notes: newLog.notes
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fertilizer_logs', plantId] });
      // Invalidate plants to force schedule update if needed
      queryClient.invalidateQueries({ queryKey: ['plants'] });
    },
  });

  return {
    logs: logsQuery.data || [],
    loading: logsQuery.isLoading,
    addLog: async (log: Omit<FertilizerLog, 'id' | 'user_id' | 'created_at'>) => {
      await addLogMutation.mutateAsync(log);
    }
  };
}
