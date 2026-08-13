-- ==============================================================================
-- SPROUTLY BOTANICAL GUIDES & ARTICLES TABLE MIGRATION
-- ==============================================================================

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  image_url TEXT NOT NULL,
  takeaways JSONB DEFAULT '{}'::jsonb,
  content JSONB NOT NULL,
  is_published BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create index on slug for ultrafast lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policy for Public Read Access
CREATE POLICY "Allow public read access to published articles"
  ON public.articles
  FOR SELECT
  USING (is_published = TRUE);

-- ==============================================================================
-- 5. SEED DATA: 5 PUBLISHED BOTANICAL GUIDES
-- ==============================================================================

INSERT INTO public.articles (slug, title, excerpt, category, read_time, published_at, author_name, author_role, author_avatar, image_url, takeaways, content, is_published)
VALUES
(
  'monstera-deliciosa-ultimate-care-guide',
  'The Ultimate Monstera Deliciosa Care Guide: From Yellowing Leaves to Giant Fenestrations',
  'Learn how to master light levels, moss pole staking, and proper watering to turn your Monstera into a thriving indoor jungle centerpiece.',
  'Indoor Plants',
  '6 min read',
  NOW() - INTERVAL '15 days',
  'Sproutly Team',
  'Botanical Editorial',
  '/favicon.svg',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Bright, indirect light (avoid harsh midday rays)", "water": "Allow top 2-3 inches of soil to dry completely", "humidity": "50% - 70% ideal (tolerates average household level)", "difficulty": "Beginner to Intermediate"}'::jsonb,
  '{
    "intro": "Monstera Deliciosa, often known as the Swiss Cheese Plant, is beloved for its iconic split leaves (fenestrations) and rapid tropical growth. While Monsteras are resilient, achieving large, split leaves requires specific environmental conditions.",
    "sections": [
      {
        "heading": "1. Mastering Light: How to Trigger Fenestrations",
        "body": "Monstera leaves only split when the plant receives adequate energy. If your Monstera is producing small, solid leaves without holes, it is almost certainly starved for light. Place it within 3-5 feet of an east or south-facing window with sheer curtains.",
        "tip": "Rotate your pot 90 degrees every two weeks so the plant grows evenly rather than leaning heavily toward the window."
      },
      {
        "heading": "2. Watering & Soil Drainage",
        "body": "Root rot is the number one killer of indoor Monsteras. Use a well-draining chunky aroid mix containing potting soil, orchid bark, perlite, and peat moss. Never water on a strict calendar schedule; always test the soil moisture first.",
        "bullets": [
          "Stick your finger 2-3 inches into the soil. If it feels cool and damp, wait 3-4 days before checking again.",
          "Always empty drainage saucers 15 minutes after watering so the roots do not sit in stagnant water.",
          "Reduce watering frequency by 40% during late autumn and winter when growth slows down."
        ]
      },
      {
        "heading": "3. Staking with a Moss Pole",
        "body": "In the wild, Monsteras are climbing epiphytes that use aerial roots to scale rainforest trees. Providing a sturdy moss or coco coir pole encourages bigger foliage and prevents the plant from flopping over wide spaces."
      }
    ],
    "conclusion": "With adequate indirect sunlight, deep soaking when dry, and a strong climbing pole, your Monstera Deliciosa will reward you with massive, glossy green leaves for years to come."
  }'::jsonb,
  TRUE
),
(
  '5-fatal-watering-mistakes-and-fixes',
  '5 Fatal Watering Mistakes Every Plant Parent Makes (And How to Fix Them)',
  'Is it overwatered or underwatered? Discover the warning signs of root rot vs crisping leaves and master the soak-and-dry method.',
  'Watering & Soil',
  '5 min read',
  NOW() - INTERVAL '10 days',
  'Marcus Vance',
  'Horticulturalist',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Varies by plant species", "water": "Bottom watering & moisture meter checks", "humidity": "Prevents crispy brown edges", "difficulty": "Essential for all plant owners"}'::jsonb,
  '{
    "intro": "Watering seems simple: plant looks thirsty, give it water. Yet improper watering accounts for over 80% of houseplant deaths! Here are the 5 classic mistakes and how to avoid them.",
    "sections": [
      {
        "heading": "Mistake #1: Watering on a Rigid Weekly Calendar",
        "body": "Evaporation rates change constantly based on humidity, temperature, pot material, and seasonal growth cycles. A schedule that works in July will drown your plant in November. Always test soil moisture manually or use Sproutly reminders."
      },
      {
        "heading": "Mistake #2: Confusing Yellowing Leaves for Dryness",
        "body": "Both overwatering and underwatering cause yellowing leaves, but their texture is vastly different. Overwatered leaves turn soft, limp, and dark yellow; underwatered leaves turn crisp, dry, and pale yellow at the edges.",
        "bullets": [
          "Soft, mushy stems = Root rot from overwatering.",
          "Crispy, brittle lower leaves = Dehydration.",
          "Foul odor coming from pot = Anaerobic bacteria from soggy soil."
        ]
      },
      {
        "heading": "Mistake #3: Pots Without Drainage Holes",
        "body": "Decorative pots without drainage trap excess water at the bottom, rotting roots invisibly. Keep plants in nursery plastic pots and drop them inside decorative cache pots."
      }
    ],
    "conclusion": "Mastering soil check routines and bottom-watering will transform your garden success overnight. Always inspect the soil before picking up your watering can!"
  }'::jsonb,
  TRUE
),
(
  'pothos-propagation-101-water-guide',
  'Pothos Propagation 101: How to Turn One Vine into Ten New Plants',
  'Step-by-step water propagation guide for Marble Queen, Golden Pothos, and Philodendrons with 100% root growth success.',
  'Propagation',
  '4 min read',
  NOW() - INTERVAL '7 days',
  'Sproutly Team',
  'Botanical Editorial',
  '/favicon.svg',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Bright, indirect light for fast root growth", "water": "Clean tap or filtered water changed weekly", "humidity": "High ambient humidity accelerates roots", "difficulty": "Easy (Great for beginners)"}'::jsonb,
  '{
    "intro": "Pothos (Epipremnum aureum) is one of the easiest house plants to propagate. With just a pair of shears and a glass of clean water, you can turn a leggy stem into a full, bushy pot in a few weeks.",
    "sections": [
      {
        "heading": "Step 1: Identifying Node Locations",
        "body": "The node is the small brown bump or joint along the vine where leaves and aerial roots emerge. Roots will ONLY grow from nodes, not bare stem tissue. Ensure your cutting includes at least one healthy node."
      },
      {
        "heading": "Step 2: Making the Cut",
        "body": "Using sterilized shears, cut 1/4 inch below a node. Remove the bottom-most leaf so it does not sit underwater and rot."
      },
      {
        "heading": "Step 3: Water Jar Placement & Care",
        "body": "Submerge the node in a clear glass of room-temperature water. Place in bright, indirect light and refresh the water every 5-7 days to replace oxygen."
      }
    ],
    "conclusion": "Once roots reach 2-3 inches in length (usually in 3-4 weeks), your new plant is ready to be potted into moist soil!"
  }'::jsonb,
  TRUE
),
(
  'balcony-terrace-gardening-direct-sun',
  'Balcony & Terrace Gardening: Best Sun-Loving Plants & Heat Protection',
  'Transform hot, sun-baked outdoor balconies into lush sanctuaries with drought-tolerant bougainvillea, succulents, and shade cloth hacks.',
  'Balcony & Outdoor',
  '7 min read',
  NOW() - INTERVAL '4 days',
  'Sproutly Team',
  'Botanical Editorial',
  '/favicon.svg',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Direct Full Sun (6+ hours per day)", "water": "Daily deep watering in peak summer", "humidity": "Low to Moderate", "difficulty": "Intermediate"}'::jsonb,
  '{
    "intro": "Gardening on a balcony presents unique microclimate challenges: harsh winds, intense direct heat, and rapid soil drying. Selecting the right drought-tolerant species is key to a thriving balcony space.",
    "sections": [
      {
        "heading": "Top Sun-Loving Champion Plants",
        "body": "Bougainvillea, Oleander, Adenium (Desert Rose), Jasmine, and Succulents thrive in high-heat outdoor environments where typical indoor plants would scorch."
      },
      {
        "heading": "Protecting Pots from Heat Stress",
        "body": "Black plastic pots absorb extreme heat, scorching delicate roots. Switch to terracotta, ceramic, or light-colored fabric grow bags."
      }
    ],
    "conclusion": "With proper pot choices and deep morning watering routines, your balcony will stay vibrant and blooming all summer long."
  }'::jsonb,
  TRUE
),
(
  'snake-plant-sansevieria-masterclass',
  'Snake Plant (Sansevieria) Masterclass: The Ultimate Low-Light Air Purifier',
  'Discover why Snake Plants thrive on neglect, how to prevent yellow mushy leaves, and the secret to getting them to bloom.',
  'Indoor Plants',
  '5 min read',
  NOW() - INTERVAL '1 day',
  'Sproutly Team',
  'Botanical Editorial',
  '/favicon.svg',
  'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=1200&q=80',
  '{"light": "Tolerates low light to bright indirect sun", "water": "Water every 2-4 weeks (allow soil to dry 100%)", "humidity": "Low / Average household humidity", "difficulty": "Super Easy (Beginner Friendly)"}'::jsonb,
  '{
    "intro": "Snake Plants (Sansevieria / Dracaena trifasciata) are indestructible succulent plants famous for purifying indoor air and thriving in dim corners where other plants struggle.",
    "sections": [
      {
        "heading": "1. Light & Placement Versatility",
        "body": "While famous for surviving in dim offices, Snake Plants grow much faster and produce bolder yellow stripes when placed in bright indirect sunlight."
      },
      {
        "heading": "2. The Golden Rule: Water Rarely",
        "body": "Snake Plants store water inside their thick, leathery leaves. Watering them too frequently causes the rhizomes to turn to mush.",
        "bullets": [
          "In Spring/Summer: Water once every 2 to 3 weeks.",
          "In Winter: Water once every 4 to 6 weeks.",
          "If in doubt, wait another week before watering!"
        ]
      },
      {
        "heading": "3. Soil & Potting Requirements",
        "body": "Use a porous cactus/succulent soil mix diluted with perlite or coarse sand to ensure water drains out immediately."
      }
    ],
    "conclusion": "If you want a striking, air-purifying plant that demands almost no attention, the Snake Plant is your ultimate garden companion."
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
