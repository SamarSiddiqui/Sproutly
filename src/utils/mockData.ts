import { Category } from '../data/plants';

export interface PlantSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: Category;
  defaultImage: string;
  wateringFrequencyDays: number;
  fertilizerFrequencyDays: number;
  lightRequirements: string;
  careInstructions: string;
}

export const plantDatabase: PlantSpecies[] = [
  {
    id: 'db-1',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'Direct Sun',
    defaultImage: 'https://images.unsplash.com/photo-1596547609652-9fc5d8d42e61?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 14,
    fertilizerFrequencyDays: 60,
    lightRequirements: 'Bright, direct sunlight',
    careInstructions: 'Allow soil to dry completely between waterings. Prone to root rot if overwatered.'
  },
  {
    id: 'db-2',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 7,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Bright, indirect light',
    careInstructions: 'Keep soil slightly moist but not soggy. Great for air purification.'
  },
  {
    id: 'db-3',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 7,
    fertilizerFrequencyDays: 45,
    lightRequirements: 'Low to medium indirect light',
    careInstructions: 'Leaves will droop when it needs water. Toxic to pets.'
  },
  {
    id: 'db-4',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 21,
    fertilizerFrequencyDays: 90,
    lightRequirements: 'Low to bright indirect light',
    careInstructions: 'Extremely drought tolerant. Only water when soil is fully dry.'
  },
  {
    id: 'db-5',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 10,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Low to bright indirect light',
    careInstructions: 'Very forgiving plant. Trim vines to encourage bushy growth.'
  },
  {
    id: 'db-6',
    name: 'Calathea',
    scientificName: 'Calathea makoyana',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1620127682443-1b91eb040c5c?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 7,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Medium indirect light',
    careInstructions: 'Requires high humidity. Use filtered water to prevent brown tips.'
  },
  {
    id: 'db-7',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    category: 'Direct Sun',
    defaultImage: 'https://images.unsplash.com/photo-1616843414595-5ee661858c9b?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 10,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Bright indirect to direct light',
    careInstructions: 'Needs plenty of space to grow. Wipe leaves regularly to remove dust.'
  },
  {
    id: 'db-8',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    category: 'Semi-Shade',
    defaultImage: 'https://images.unsplash.com/photo-1629837944031-6284617dfeb3?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 5,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Bright indirect light',
    careInstructions: 'Requires constantly moist soil and high humidity.'
  },
  {
    id: 'db-9',
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    category: 'Indoor',
    defaultImage: 'https://images.unsplash.com/photo-1604168612704-8b6528d227b9?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 10,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Bright indirect light',
    careInstructions: 'Keep away from cold drafts. Wipe leaves with a damp cloth.'
  },
  {
    id: 'db-10',
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    category: 'Semi-Shade',
    defaultImage: 'https://images.unsplash.com/photo-1596784869818-dfb91176b6b7?auto=format&fit=crop&q=80&w=800',
    wateringFrequencyDays: 7,
    fertilizerFrequencyDays: 30,
    lightRequirements: 'Medium to bright indirect light',
    careInstructions: 'Great trailing plant. Can be susceptible to spider mites.'
  }
];
