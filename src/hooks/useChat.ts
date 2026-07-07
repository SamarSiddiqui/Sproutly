import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import { Plant } from '../data/plants';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt?: string;
}

export const chatMessagesQueryKey = ['chatMessages'];

export function useChat(plants: Plant[]) {
  const queryClient = useQueryClient();

  const chatQuery = useQuery<ChatMessage[]>({
    queryKey: chatMessagesQueryKey,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.created_at,
      }));
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      // 1. Save user message to database
      const { data: userMsgData, error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          sender: 'user',
          text: text,
        })
        .select('*')
        .single();

      if (userMsgError) throw userMsgError;

      const newUserMsg: ChatMessage = {
        id: userMsgData.id,
        sender: 'user',
        text: userMsgData.text,
        createdAt: userMsgData.created_at,
      };

      // Optimistically update query client cache with user message so it renders instantly
      queryClient.setQueryData<ChatMessage[]>(chatMessagesQueryKey, (old = []) => [
        ...old,
        newUserMsg,
      ]);

      // 2. Fetch the current history of messages for Mistral
      const currentMessages = queryClient.getQueryData<ChatMessage[]>(chatMessagesQueryKey) || [];

      // 3. Request Mistral completion from API route handler
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages,
          plants,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiReply = data.text || 'I encountered an issue.';

      // 4. Save AI reply to database
      const { data: aiMsgData, error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          sender: 'ai',
          text: aiReply,
        })
        .select('*')
        .single();

      if (aiMsgError) throw aiMsgError;

      return aiMsgData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(chatMessagesQueryKey, []);
    },
  });

  return {
    messages: chatQuery.data || [],
    loading: chatQuery.isLoading,
    isSending: sendMessageMutation.isPending,
    sendMessage: async (text: string) => {
      await sendMessageMutation.mutateAsync(text);
    },
    clearChat: async () => {
      await clearChatMutation.mutateAsync();
    },
  };
}
