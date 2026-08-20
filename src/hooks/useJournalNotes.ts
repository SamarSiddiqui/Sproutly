import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';

export interface JournalNote {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export const journalNotesQueryKey = ['journal_notes'];

export function useJournalNotes() {
  const queryClient = useQueryClient();

  const notesQuery = useQuery<JournalNote[]>({
    queryKey: journalNotesQueryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('garden_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { data, error } = await supabase
        .from('garden_notes')
        .insert([{ user_id: user.id, content }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalNotesQueryKey });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('garden_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      return noteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalNotesQueryKey });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      const { data, error } = await supabase
        .from('garden_notes')
        .update({ content })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalNotesQueryKey });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    addNote: addNoteMutation.mutateAsync,
    isAdding: addNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutateAsync,
    isDeleting: deleteNoteMutation.isPending,
    updateNote: updateNoteMutation.mutateAsync,
    isUpdating: updateNoteMutation.isPending,
  };
}
