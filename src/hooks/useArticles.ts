import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';
import { Article, ARTICLES as fallbackArticles } from '../data/articles';

export const articlesQueryKey = ['articles'];

export function mapDbRowToArticle(row: any): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    readTime: row.read_time,
    publishedAt: row.published_at ? new Date(row.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
    author: {
      name: row.author_name || 'Sproutly Team',
      role: row.author_role || 'Botanical Editorial',
      avatar: (!row.author_avatar || row.author_avatar.startsWith('data:image/svg')) ? '/favicon.svg' : row.author_avatar,
    },
    image: row.image_url,
    takeaways: typeof row.takeaways === 'string' ? JSON.parse(row.takeaways) : row.takeaways || undefined,
    content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content || { intro: '', sections: [], conclusion: '' },
  };
}

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: articlesQueryKey,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error || !data || data.length === 0) {
          console.warn('Supabase articles fetch fallback to local data:', error?.message);
          return fallbackArticles;
        }

        return data.map(mapDbRowToArticle);
      } catch (err) {
        console.warn('Supabase articles query error fallback to local data:', err);
        return fallbackArticles;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useArticle(slug: string) {
  return useQuery<Article | undefined>({
    queryKey: ['article', slug],
    queryFn: async () => {
      if (!slug) return undefined;

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          // Fallback to local array
          return fallbackArticles.find((a) => a.slug === slug);
        }

        return mapDbRowToArticle(data);
      } catch (err) {
        return fallbackArticles.find((a) => a.slug === slug);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
