import { Plant } from '../data/plants';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'care' | 'collection' | 'ai' | 'milestone';
  iconName: 'Droplets' | 'Leaf' | 'Sparkles' | 'Sun' | 'Scissors' | 'Trophy' | 'Award' | 'ShieldCheck';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface GardenerStats {
  totalPlants: number;
  healthyPlants: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  currentXp: number;
  badges: AchievementBadge[];
}

export function calculateGardenerStats(plants: Plant[]): GardenerStats {
  const totalPlants = plants.length;
  const healthyPlants = plants.filter((p) => p.healthStatus === 'healthy').length;

  // Compute XP based on plant count and healthy plants
  const currentXp = totalPlants * 25 + healthyPlants * 15;
  const level = Math.max(1, Math.floor(currentXp / 50) + 1);
  const nextLevelXp = level * 50;

  let levelTitle = 'Sprout Seedling';
  if (level >= 5) {
    levelTitle = 'Master Botanist & Sproutly Legend 👑';
  } else if (level >= 4) {
    levelTitle = 'Green Thumb Guardian 🛡️';
  } else if (level >= 3) {
    levelTitle = 'Urban Jungle Architect 🪴';
  } else if (level >= 2) {
    levelTitle = 'Leaf Explorer 🌿';
  }

  const badges: AchievementBadge[] = [
    {
      id: 'first_seed',
      title: 'First Seed',
      description: 'Added your very first plant to your digital garden collection.',
      category: 'collection',
      iconName: 'Leaf',
      unlocked: totalPlants >= 1,
      progress: Math.min(totalPlants, 1),
      maxProgress: 1,
    },
    {
      id: 'jungle_founder',
      title: 'Jungle Founder',
      description: 'Cultivate and manage 5 or more living plants in Sproutly.',
      category: 'collection',
      iconName: 'Trophy',
      unlocked: totalPlants >= 5,
      progress: Math.min(totalPlants, 5),
      maxProgress: 5,
    },
    {
      id: 'hydration_champion',
      title: 'Hydration Champion',
      description: 'Keep 3 or more plants in 100% optimal healthy condition.',
      category: 'care',
      iconName: 'Droplets',
      unlocked: healthyPlants >= 3,
      progress: Math.min(healthyPlants, 3),
      maxProgress: 3,
    },
    {
      id: 'sun_explorer',
      title: 'Sun Explorer',
      description: 'Care for plants across indoor, semi-shade, and direct sun categories.',
      category: 'milestone',
      iconName: 'Sun',
      unlocked: new Set(plants.map((p) => p.category)).size >= 2,
      progress: Math.min(new Set(plants.map((p) => p.category)).size, 2),
      maxProgress: 2,
    },
    {
      id: 'plant_doctor',
      title: 'Plant Doctor',
      description: 'Consult Sproutly AI to diagnose symptoms or get botanical tips.',
      category: 'ai',
      iconName: 'Sparkles',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'green_thumb_guardian',
      title: 'Green Thumb Guardian',
      description: 'Reach Gardener Rank Level 3 or higher.',
      category: 'milestone',
      iconName: 'ShieldCheck',
      unlocked: level >= 3,
      progress: Math.min(level, 3),
      maxProgress: 3,
    },
  ];

  return {
    totalPlants,
    healthyPlants,
    level,
    levelTitle,
    nextLevelXp,
    currentXp,
    badges,
  };
}
