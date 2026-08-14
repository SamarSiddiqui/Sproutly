-- ==============================================================================
-- ADD IS_FEATURED FIELD TO ARTICLES TABLE
-- Run this in your Supabase SQL Editor to support Featured Articles
-- ==============================================================================

-- 1. Add column is_featured to articles if it doesn't exist
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 2. Mark the watering mistakes guide as the featured article
UPDATE public.articles
SET is_featured = TRUE
WHERE slug = '5-fatal-watering-mistakes-and-fixes';
