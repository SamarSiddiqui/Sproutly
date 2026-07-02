import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';

export const profileQueryKey = ['profile'];

export interface UserProfile {
  id: string;
  displayName: string;
  location: string;
  reminders: {
    enableCareReminders: boolean;
    reminderTime: string;
    weeklyDigest: boolean;
  };
  preferences: {
    environmentView: 'chart' | 'bars';
    aiTone: 'gentle' | 'direct';
    reduceMotion: boolean;
    latitude?: number;
    longitude?: number;
  };
}

const defaultProfile = (): Omit<UserProfile, 'id'> => ({
  displayName: '',
  location: '',
  reminders: {
    enableCareReminders: true,
    reminderTime: '09:00',
    weeklyDigest: false,
  },
  preferences: {
    environmentView: 'chart',
    aiTone: 'gentle',
    reduceMotion: false,
  },
});

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return {
          id: user.id,
          ...defaultProfile(),
        };
      }

      return {
        id: data.id,
        displayName: data.display_name || '',
        location: data.location || '',
        reminders: {
          enableCareReminders: data.reminders?.enableCareReminders ?? true,
          reminderTime: data.reminders?.reminderTime ?? '09:00',
          weeklyDigest: data.reminders?.weeklyDigest ?? false,
        },
        preferences: {
          environmentView: data.preferences?.environmentView ?? 'chart',
          aiTone: data.preferences?.aiTone ?? 'gentle',
          reduceMotion: data.preferences?.reduceMotion ?? false,
          latitude: data.preferences?.latitude,
          longitude: data.preferences?.longitude,
        },
      };
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedFields: Partial<Omit<UserProfile, 'id'>>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // Fetch existing profile to merge properly
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const dbRow: any = {
        id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (updatedFields.displayName !== undefined) {
        dbRow.display_name = updatedFields.displayName;
      }
      if (updatedFields.location !== undefined) {
        dbRow.location = updatedFields.location;
      }
      if (updatedFields.reminders !== undefined) {
        dbRow.reminders = {
          ...(existing?.reminders || {}),
          ...updatedFields.reminders,
        };
      }
      if (updatedFields.preferences !== undefined) {
        dbRow.preferences = {
          ...(existing?.preferences || {}),
          ...updatedFields.preferences,
        };
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(dbRow)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });

  return {
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    updateProfile: async (fields: Partial<Omit<UserProfile, 'id'>>) => {
      await updateProfileMutation.mutateAsync(fields);
    },
  };
}
