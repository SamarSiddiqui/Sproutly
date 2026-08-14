export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Indoor Plants' | 'Watering & Soil' | 'Troubleshooting' | 'Propagation' | 'Balcony & Outdoor';
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  takeaways?: {
    light?: string;
    water?: string;
    humidity?: string;
    difficulty?: string;
  };
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      bullets?: string[];
      tip?: string;
    }[];
    conclusion: string;
  };
  isFeatured?: boolean;
}

export const ARTICLES: Article[] = [
  {
    slug: 'monstera-deliciosa-ultimate-care-guide',
    title: 'The Ultimate Monstera Deliciosa Care Guide: From Yellowing Leaves to Giant Fenestrations',
    excerpt: 'Learn how to master light levels, moss pole staking, and proper watering to turn your Monstera into a thriving indoor jungle centerpiece.',
    category: 'Indoor Plants',
    readTime: '6 min read',
    publishedAt: 'March 15, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Bright, indirect light (avoid harsh midday rays)',
      water: 'Allow top 2-3 inches of soil to dry completely',
      humidity: '50% - 70% ideal (tolerates average household level)',
      difficulty: 'Beginner to Intermediate',
    },
    content: {
      intro: 'Monstera Deliciosa, often known as the Swiss Cheese Plant, is beloved for its iconic split leaves (fenestrations) and rapid tropical growth. While Monsteras are resilient, achieving large, split leaves requires specific environmental conditions.',
      sections: [
        {
          heading: '1. Mastering Light: How to Trigger Fenestrations',
          body: 'Monstera leaves only split when the plant receives adequate energy. If your Monstera is producing small, solid leaves without holes, it is almost certainly starved for light. Place it within 3-5 feet of an east or south-facing window with sheer curtains.',
          tip: 'Rotate your pot 90 degrees every two weeks so the plant grows evenly rather than leaning heavily toward the window.',
        },
        {
          heading: '2. Watering & Soil Drainage',
          body: 'Root rot is the number one killer of indoor Monsteras. Use a well-draining chunky aroid mix containing potting soil, orchid bark, perlite, and peat moss. Never water on a strict calendar schedule; always test the soil moisture first.',
          bullets: [
            'Stick your finger 2-3 inches into the soil. If it feels cool and damp, wait 3-4 days before checking again.',
            'Always empty drainage saucers 15 minutes after watering so the roots do not sit in stagnant water.',
            'Reduce watering frequency by 40% during late autumn and winter when growth slows down.',
          ],
        },
        {
          heading: '3. Staking with a Moss Pole',
          body: 'In the wild, Monsteras are climbing epiphytes that use aerial roots to scale rainforest trees. Providing a sturdy moss or coco coir pole encourages bigger foliage and prevents the plant from flopping over wide spaces.',
        },
      ],
      conclusion: 'With adequate indirect sunlight, deep soaking when dry, and a strong climbing pole, your Monstera Deliciosa will reward you with massive, glossy green leaves for years to come.',
    },
  },
  {
    slug: '5-fatal-watering-mistakes-and-fixes',
    title: '5 Fatal Watering Mistakes Every Plant Parent Makes (And How to Fix Them)',
    excerpt: 'Is it overwatered or underwatered? Discover the warning signs of root rot vs crisping leaves and master the soak-and-dry method.',
    category: 'Watering & Soil',
    readTime: '5 min read',
    publishedAt: 'March 28, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Varies by plant species',
      water: 'Bottom watering & moisture meter checks',
      humidity: 'Prevents crispy brown edges',
      difficulty: 'Essential for all plant owners',
    },
    isFeatured: true,
    content: {
      intro: 'Watering seems simple: plant looks thirsty, give it water. Yet improper watering accounts for over 80% of houseplant deaths! Here are the 5 classic mistakes and how to avoid them.',
      sections: [
        {
          heading: 'Mistake #1: Watering on a Rigid Weekly Calendar',
          body: 'Evaporation rates change constantly based on humidity, temperature, pot material, and seasonal growth cycles. A schedule that works in July will drown your plant in November. Always test soil moisture manually or use Sproutly reminders.',
        },
        {
          heading: 'Mistake #2: Confusing Yellowing Leaves for Dryness',
          body: 'Both overwatering and underwatering cause yellowing leaves, but their texture is vastly different. Overwatered leaves turn soft, limp, and dark yellow; underwatered leaves turn crisp, dry, and pale yellow at the edges.',
          bullets: [
            'Soft, mushy stems = Root rot from overwatering.',
            'Crispy, brittle lower leaves = Dehydration.',
            'Foul odor coming from pot = Anaerobic bacteria from soggy soil.',
          ],
        },
        {
          heading: 'Mistake #3: Pots Without Drainage Holes',
          body: 'Decorative pots without drainage trap excess water at the bottom, rotting roots invisibly. Keep plants in nursery plastic pots and drop them inside decorative cache pots.',
        },
      ],
      conclusion: 'Mastering soil check routines and bottom-watering will transform your garden success overnight. Always inspect the soil before picking up your watering can!',
    },
  },
  {
    slug: 'pothos-propagation-101-water-guide',
    title: 'Pothos Propagation 101: How to Turn One Vine into Ten New Plants',
    excerpt: 'Step-by-step water propagation guide for Marble Queen, Golden Pothos, and Philodendrons with 100% root growth success.',
    category: 'Propagation',
    readTime: '4 min read',
    publishedAt: 'April 02, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Bright, indirect light for fast root growth',
      water: 'Clean tap or filtered water changed weekly',
      humidity: 'High ambient humidity accelerates roots',
      difficulty: 'Easy (Great for beginners)',
    },
    content: {
      intro: 'Pothos (Epipremnum aureum) is one of the easiest house plants to propagate. With just pair of shears and a glass of clean water, you can turn a leggy stem into a full, bushy pot in a few weeks.',
      sections: [
        {
          heading: 'Step 1: Identifying Node Locations',
          body: 'The node is the small brown bump or joint along the vine where leaves and aerial roots emerge. Roots will ONLY grow from nodes, not bare stem tissue. Ensure your cutting includes at least one healthy node.',
        },
        {
          heading: 'Step 2: Making the Cut',
          body: 'Using sterilized shears, cut 1/4 inch below a node. Remove the bottom-most leaf so it does not sit underwater and rot.',
        },
        {
          heading: 'Step 3: Water Jar Placement & Care',
          body: 'Submerge the node in a clear glass of room-temperature water. Place in bright, indirect light and refresh the water every 5-7 days to replace oxygen.',
        },
      ],
      conclusion: 'Once roots reach 2-3 inches in length (usually in 3-4 weeks), your new plant is ready to be potted into moist soil!',
    },
  },
  {
    slug: 'balcony-terrace-gardening-direct-sun',
    title: 'Balcony & Terrace Gardening: Best Sun-Loving Plants & Heat Protection',
    excerpt: 'Transform hot, sun-baked outdoor balconies into lush sanctuaries with drought-tolerant bougainvillea, succulents, and shade cloth hacks.',
    category: 'Balcony & Outdoor',
    readTime: '7 min read',
    publishedAt: 'April 10, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Direct Full Sun (6+ hours per day)',
      water: 'Daily deep watering in peak summer',
      humidity: 'Low to Moderate',
      difficulty: 'Intermediate',
    },
    content: {
      intro: 'Gardening on a balcony presents unique microclimate challenges: harsh winds, intense direct heat, and rapid soil drying. Selecting the right drought-tolerant species is key to a thriving balcony space.',
      sections: [
        {
          heading: 'Top Sun-Loving Champion Plants',
          body: 'Bougainvillea, Oleander, Adenium (Desert Rose), Jasmine, and Succulents thrive in high-heat outdoor environments where typical indoor plants would scorch.',
        },
        {
          heading: 'Protecting Pots from Heat Stress',
          body: 'Black plastic pots absorb extreme heat, scorching delicate roots. Switch to terracotta, ceramic, or light-colored fabric grow bags.',
        },
      ],
      conclusion: 'With proper pot choices and deep morning watering routines, your balcony will stay vibrant and blooming all summer long.',
    },
  },
  {
    slug: 'the-secret-to-perfect-soil-aeration',
    title: 'The Secret to Perfect Aeration: Why Your Plant Roots Need to Breathe Air (Not Just Water)',
    excerpt: 'Discover why dense potting soil suffocates roots and how a simple 3-ingredient chunky aroid mix gives your indoor plants oxygen-rich super-powers.',
    category: 'Watering & Soil',
    readTime: '8 min read',
    publishedAt: 'May 02, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Improves root energy under all light levels',
      water: 'Flushes out excess moisture 3x faster',
      humidity: 'Prevents soil surface mold',
      difficulty: 'Easy (Mix & Pot)',
    },
    content: {
      intro: 'Did you know that roots do not just absorb water—they actually need oxygen to breathe? When potting soil turns into a dense, muddy sponge, roots drown in stagnant water. Understanding aeration is the single biggest leap from beginner gardener to master plant parent.',
      sections: [
        {
          heading: '1. What is Soil Compaction & Why Roots Suffocate',
          body: 'Standard store-bought potting soil is made of ultra-fine peat moss. Over time, as you water your plant, gravity compresses these fine particles together like wet cement. Without oxygen pockets, roots cannot respire, turning black and mushy.',
          tip: 'If your soil stays wet for longer than 10 days after watering, your mix lacks essential aeration materials.',
        },
        {
          heading: '2. The Magic 3-Ingredient Chunky Mix Recipe',
          body: 'To create a soil mix that stays light, fluffy, and full of air pockets, combine these three simple ingredients in equal parts:',
          bullets: [
            '1 Part Standard Potting Soil: Retains baseline moisture and organic nutrients.',
            '1 Part Chunky Orchid Bark: Creates large, permanent air gaps for roots to crawl through.',
            '1 Part Coarse Perlite or Pumice: White volcanic glass that resists compaction and drains instantly.',
          ],
        },
        {
          heading: '3. Chopstick Aeration Maintenance',
          body: 'Every 2 to 3 months, gently poke a wooden chopstick 2 inches deep into the soil around your pot. This breaks up compacted clumps and allows fresh oxygen to reach deeper root zones without harming the plant.',
        },
      ],
      conclusion: 'Give your roots room to breathe! Switch to a chunky, airy mix and watch your Monsteras, Pothos, and Ficus explode with vibrant new leaf growth.',
    },
  },
  {
    slug: 'organic-neem-oil-spray-guide-pest-defense',
    title: 'The Ultimate Organic Neem Oil Spray Guide: Banishing Pests Without Chemical Toxins',
    excerpt: 'How to safely mix cold-pressed neem oil, Castile soap, and water to wipe out spider mites, fungus gnats, and mealybugs without harming your home.',
    category: 'Troubleshooting',
    readTime: '8 min read',
    publishedAt: 'May 12, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Never spray in direct sun (causes leaf burn)',
      water: 'Apply spray once every 7 days during outbreaks',
      humidity: 'Allow leaves to dry thoroughly after misting',
      difficulty: 'Beginner Friendly',
    },
    content: {
      intro: 'Discovering tiny webs on your Calathea or white cottony spots on your Jade plant can feel heartbreaking. But before reaching for harsh chemical pesticides, turn to nature: cold-pressed Neem Oil is an organic, non-toxic remedy that disrupts pest life cycles safely.',
      sections: [
        {
          heading: '1. How Neem Oil Works (The Insect Hormone Secret)',
          body: 'Neem oil contains an active compound called Azadirachtin. Unlike chemical poisons that kill instantly, Azadirachtin disrupts the hormonal balance of chewing and sucking insects (spider mites, mealybugs, thrips, aphids), preventing them from feeding and reproducing.',
        },
        {
          heading: '2. The Golden Emulsion Recipe',
          body: 'Oil and water do not mix on their own! You need a natural emulsifier like pure peppermint or unscented Castile soap to break down the oil drops:',
          bullets: [
            '1 Liter of Warm Water (Not hot, not cold).',
            '1 Teaspoon Pure Cold-Pressed Organic Neem Oil.',
            '1/2 Teaspoon Liquid Castile Soap (e.g., Dr. Bronner’s).',
            'Shake vigorously in a spray bottle before every application!',
          ],
          tip: 'Always test your spray on 1 leaf first and wait 24 hours to ensure your plant species is not sensitive to oils.',
        },
        {
          heading: '3. Application Rules: Prevent Leaf Scorch',
          body: 'Oil coats the leaf surface. If you spray a plant and immediately place it under bright midday sun or strong grow lights, the oil will act like a magnifying glass and burn your leaves! Spray only during early evening or move plants to a shaded spot while drying.',
        },
      ],
      conclusion: 'With weekly neem oil treatments and a thorough leaf wipe down, you can banish unwanted invaders organically while keeping your home toxin-free.',
    },
  },
  {
    slug: 'busting-the-pebble-drainage-myth',
    title: 'Busting the Pebble Drainage Myth: Why Adding Rocks to the Bottom of Pots Actually Kills Plants',
    excerpt: 'Think putting gravel in the bottom of a pot creates drainage? Physics proves it actually moves stagnant water closer to your roots!',
    category: 'Watering & Soil',
    readTime: '9 min read',
    publishedAt: 'May 20, 2026',
    author: {
      name: 'Sproutly Team',
      role: 'Botanical Editorial',
      avatar: '/favicon.svg',
    },
    image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=80',
    takeaways: {
      light: 'Any light level',
      water: 'Always use pots with functional drainage holes',
      humidity: 'Any level',
      difficulty: 'Essential Gardening Myth-Buster',
    },
    content: {
      intro: 'For generations, gardeners passed down a piece of advice: "If your pot has no drainage holes, just put an inch of pebbles or gravel at the bottom." It sounds logical, right? Unfortunately, physics proves that adding rocks to the bottom of a pot actually raises the water table, soaking root systems faster!',
      sections: [
        {
          heading: '1. The Physics of the "Perched Water Table"',
          body: 'Water prefers to stick to fine soil particles (via capillary action) rather than dripping freely into open gravel. This boundary between fine soil and coarse pebbles creates a "perched water table"—a saturated layer of soggy mud that rests right above the rock layer.',
          tip: 'By filling the bottom 2 inches of a pot with rocks, you bring that soggy water table 2 inches closer to your plant roots!',
        },
        {
          heading: '2. What Really Happens Inside a Pot Without Drainage',
          body: 'Without an open drainage hole at the bottom, water has nowhere to leave. Salts, minerals from tap water, and stagnant moisture accumulate at the base. Over time, bacteria multiply and rot root tips invisibly from below.',
        },
        {
          heading: '3. The Only True Solution for Healthy Roots',
          body: 'Skip the rocks and follow these two proven rules instead:',
          bullets: [
            'Rule #1: Always plant in nursery pots with true bottom drainage holes.',
            'Rule #2: Mix perlite and orchid bark throughout the ENTIRE soil volume, rather than layering rocks at the bottom.',
          ],
        },
      ],
      conclusion: 'Bust the myth! Ditch the bottom rocks, use well-draining soil mixes, and give your plants nursery pots with true drainage holes for happy, rot-free roots.',
    },
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
