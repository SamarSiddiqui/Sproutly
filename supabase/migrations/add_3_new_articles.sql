-- ==============================================================================
-- ADD 3 NEW BOTANICAL GUIDES TO SPROUTLY SUPABASE DATABASE
-- Copy and paste this script directly into Supabase SQL Editor -> Run
-- ==============================================================================

INSERT INTO public.articles (slug, title, excerpt, category, read_time, published_at, author_name, author_role, author_avatar, image_url, takeaways, content, is_published)
VALUES
(
  'the-secret-to-perfect-soil-aeration',
  'The Secret to Perfect Aeration: Why Your Plant Roots Need to Breathe Air (Not Just Water)',
  'Discover why dense potting soil suffocates roots and how a simple 3-ingredient chunky aroid mix gives your indoor plants oxygen-rich super-powers.',
  'Watering & Soil',
  '8 min read',
  NOW() - INTERVAL '12 hours',
  'Sproutly Team',
  'Botanical Editorial',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
  'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Improves root energy under all light levels", "water": "Flushes out excess moisture 3x faster", "humidity": "Prevents soil surface mold", "difficulty": "Easy (Mix & Pot)"}'::jsonb,
  '{
    "intro": "Did you know that roots do not just absorb water—they actually need oxygen to breathe? When potting soil turns into a dense, muddy sponge, roots drown in stagnant water. Understanding aeration is the single biggest leap from beginner gardener to master plant parent.",
    "sections": [
      {
        "heading": "1. What is Soil Compaction & Why Roots Suffocate",
        "body": "Standard store-bought potting soil is made of ultra-fine peat moss. Over time, as you water your plant, gravity compresses these fine particles together like wet cement. Without oxygen pockets, roots cannot respire, turning black and mushy.",
        "tip": "If your soil stays wet for longer than 10 days after watering, your mix lacks essential aeration materials."
      },
      {
        "heading": "2. The Magic 3-Ingredient Chunky Mix Recipe",
        "body": "To create a soil mix that stays light, fluffy, and full of air pockets, combine these three simple ingredients in equal parts:",
        "bullets": [
          "1 Part Standard Potting Soil: Retains baseline moisture and organic nutrients.",
          "1 Part Chunky Orchid Bark: Creates large, permanent air gaps for roots to crawl through.",
          "1 Part Coarse Perlite or Pumice: White volcanic glass that resists compaction and drains instantly."
        ]
      },
      {
        "heading": "3. Chopstick Aeration Maintenance",
        "body": "Every 2 to 3 months, gently poke a wooden chopstick 2 inches deep into the soil around your pot. This breaks up compacted clumps and allows fresh oxygen to reach deeper root zones without harming the plant."
      }
    ],
    "conclusion": "Give your roots room to breathe! Switch to a chunky, airy mix and watch your Monsteras, Pothos, and Ficus explode with vibrant new leaf growth."
  }'::jsonb,
  TRUE
),
(
  'organic-neem-oil-spray-guide-pest-defense',
  'The Ultimate Organic Neem Oil Spray Guide: Banishing Pests Without Chemical Toxins',
  'How to safely mix cold-pressed neem oil, Castile soap, and water to wipe out spider mites, fungus gnats, and mealybugs without harming your home.',
  'Troubleshooting',
  '8 min read',
  NOW() - INTERVAL '6 hours',
  'Sproutly Team',
  'Botanical Editorial',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Never spray in direct sun (causes leaf burn)", "water": "Apply spray once every 7 days during outbreaks", "humidity": "Allow leaves to dry thoroughly after misting", "difficulty": "Beginner Friendly"}'::jsonb,
  '{
    "intro": "Discovering tiny webs on your Calathea or white cottony spots on your Jade plant can feel heartbreaking. But before reaching for harsh chemical pesticides, turn to nature: cold-pressed Neem Oil is an organic, non-toxic remedy that disrupts pest life cycles safely.",
    "sections": [
      {
        "heading": "1. How Neem Oil Works (The Insect Hormone Secret)",
        "body": "Neem oil contains an active compound called Azadirachtin. Unlike chemical poisons that kill instantly, Azadirachtin disrupts the hormonal balance of chewing and sucking insects (spider mites, mealybugs, thrips, aphids), preventing them from feeding and reproducing."
      },
      {
        "heading": "2. The Golden Emulsion Recipe",
        "body": "Oil and water do not mix on their own! You need a natural emulsifier like pure peppermint or unscented Castile soap to break down the oil drops:",
        "bullets": [
          "1 Liter of Warm Water (Not hot, not cold).",
          "1 Teaspoon Pure Cold-Pressed Organic Neem Oil.",
          "1/2 Teaspoon Liquid Castile Soap (e.g., Dr. Bronner’s).",
          "Shake vigorously in a spray bottle before every application!"
        ],
        "tip": "Always test your spray on 1 leaf first and wait 24 hours to ensure your plant species is not sensitive to oils."
      },
      {
        "heading": "3. Application Rules: Prevent Leaf Scorch",
        "body": "Oil coats the leaf surface. If you spray a plant and immediately place it under bright midday sun or strong grow lights, the oil will act like a magnifying glass and burn your leaves! Spray only during early evening or move plants to a shaded spot while drying."
      }
    ],
    "conclusion": "With weekly neem oil treatments and a thorough leaf wipe down, you can banish unwanted invaders organically while keeping your home toxin-free."
  }'::jsonb,
  TRUE
),
(
  'busting-the-pebble-drainage-myth',
  'Busting the Pebble Drainage Myth: Why Adding Rocks to the Bottom of Pots Actually Kills Plants',
  'Think putting gravel in the bottom of a pot creates drainage? Physics proves it actually moves stagnant water closer to your roots!',
  'Watering & Soil',
  '9 min read',
  NOW() - INTERVAL '1 hour',
  'Sproutly Team',
  'Botanical Editorial',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
  'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Any light level", "water": "Always use pots with functional drainage holes", "humidity": "Any level", "difficulty": "Essential Gardening Myth-Buster"}'::jsonb,
  '{
    "intro": "For generations, gardeners passed down a piece of advice: \"If your pot has no drainage holes, just put an inch of pebbles or gravel at the bottom.\" It sounds logical, right? Unfortunately, physics proves that adding rocks to the bottom of a pot actually raises the water table, soaking root systems faster!",
    "sections": [
      {
        "heading": "1. The Physics of the \"Perched Water Table\"",
        "body": "Water prefers to stick to fine soil particles (via capillary action) rather than dripping freely into open gravel. This boundary between fine soil and coarse pebbles creates a \"perched water table\"—a saturated layer of soggy mud that rests right above the rock layer.",
        "tip": "By filling the bottom 2 inches of a pot with rocks, you bring that soggy water table 2 inches closer to your plant roots!"
      },
      {
        "heading": "2. What Really Happens Inside a Pot Without Drainage",
        "body": "Without an open drainage hole at the bottom, water has nowhere to leave. Salts, minerals from tap water, and stagnant moisture accumulate at the base. Over time, bacteria multiply and rot root tips invisibly from below."
      },
      {
        "heading": "3. The Only True Solution for Healthy Roots",
        "body": "Skip the rocks and follow these two proven rules instead:",
        "bullets": [
          "Rule #1: Always plant in nursery pots with true bottom drainage holes.",
          "Rule #2: Mix perlite and orchid bark throughout the ENTIRE soil volume, rather than layering rocks at the bottom."
        ]
      }
    ],
    "conclusion": "Bust the myth! Ditch the bottom rocks, use well-draining soil mixes, and give your plants nursery pots with true drainage holes for happy, rot-free roots."
  }'::jsonb,
  TRUE
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  read_time = EXCLUDED.read_time,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_avatar = EXCLUDED.author_avatar,
  image_url = EXCLUDED.image_url,
  takeaways = EXCLUDED.takeaways,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published;
