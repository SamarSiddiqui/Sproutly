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
    isFeatured: row.is_featured,
  };
}

export interface UseArticlesOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featuredOnly?: boolean;
}

export interface UseArticlesResult {
  articles: Article[];
  totalCount: number;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category, search, page = 1, limit = 6, featuredOnly } = options;

  return useQuery<UseArticlesResult>({
    queryKey: ['articles', { category, search, page, limit, featuredOnly }],
    queryFn: async () => {
      try {
        let query = supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('is_published', true);

        if (featuredOnly !== undefined) {
          query = query.eq('is_featured', featuredOnly);
        }

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        if (search) {
          query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        // Apply pagination
        if (!featuredOnly) {
          const from = (page - 1) * limit;
          const to = from + limit - 1;
          query = query.range(from, to);
        }

        // Sort by publication date
        query = query.order('published_at', { ascending: false });

        const { data, error, count } = await query;

        if (error || !data || data.length === 0) {
          // Filter local backup list if Supabase fails
          let fallback = fallbackArticles;
          if (featuredOnly) {
            fallback = fallback.filter(a => a.isFeatured);
          } else {
            if (category && category !== 'All') {
              fallback = fallback.filter(a => a.category === category);
            }
            if (search) {
              const term = search.toLowerCase();
              fallback = fallback.filter(a => 
                a.title.toLowerCase().includes(term) || a.excerpt.toLowerCase().includes(term)
              );
            }
            // Paginate fallback
            const from = (page - 1) * limit;
            fallback = fallback.slice(from, from + limit);
          }

          return {
            articles: fallback,
            totalCount: featuredOnly ? fallback.length : fallbackArticles.length,
          };
        }

        return {
          articles: data.map(mapDbRowToArticle),
          totalCount: count || data.length,
        };
      } catch (err) {
        console.warn('Fallback to local array due to query failure:', err);
        return {
          articles: fallbackArticles.slice(0, limit),
          totalCount: fallbackArticles.length,
        };
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
