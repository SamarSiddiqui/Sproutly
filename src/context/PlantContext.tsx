import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Plant, initialPlants } from '../data/plants';
import { supabase } from '../utils/supabaseClient';

interface PlantContextType {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Omit<Plant, 'id'>) => Promise<void>;
  updatePlant: (id: string, plant: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  replacePlants: (plants: Plant[]) => Promise<void>;
  resetPlants: () => void;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiContext: string;
  setAiContext: (context: string) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

// Helper to translate database rows (which might be snake_case/camelCase or use image/image_url) to Plant type
const mapDbRowToPlant = (row: any): Plant => {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    image: row.image || row.image_url || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    category: row.category,
    growthStage: row.growth_stage || row.growthStage || 'Growing',
    lastWatered: row.last_watered || row.lastWatered || new Date().toISOString(),
    nextWatering: row.next_watering || row.nextWatering || new Date().toISOString(),
    fertilizerCycle: row.fertilizer_cycle || row.fertilizerCycle || 30,
    lastFertilized: row.last_fertilized || row.lastFertilized || new Date().toISOString(),
    pruningSeasons: Array.isArray(row.pruning_seasons) ? row.pruning_seasons : (row.pruningSeasons || ['Spring']),
    pottingStatus: row.potting_status || row.pottingStatus || 'own',
    healthStatus: row.health_status || row.healthStatus || 'healthy',
    notes: row.notes || ''
  };
};

// Helper to translate Plant object to database row format (supports both snake_case and camelCase columns)
const mapPlantToDbRow = (plant: Partial<Plant>, userId?: string): any => {
  const row: any = {};
  if (userId) row.user_id = userId;
  if (plant.name !== undefined) row.name = plant.name;
  if (plant.species !== undefined) row.species = plant.species;
  if (plant.image !== undefined) {
    row.image = plant.image;
    row.image_url = plant.image;
  }
  if (plant.category !== undefined) row.category = plant.category;
  if (plant.growthStage !== undefined) {
    row.growth_stage = plant.growthStage;
    row.growthStage = plant.growthStage;
  }
  if (plant.lastWatered !== undefined) {
    row.last_watered = plant.lastWatered;
    row.lastWatered = plant.lastWatered;
  }
  if (plant.nextWatering !== undefined) {
    row.next_watering = plant.nextWatering;
    row.nextWatering = plant.nextWatering;
  }
  if (plant.fertilizerCycle !== undefined) {
    row.fertilizer_cycle = plant.fertilizerCycle;
    row.fertilizerCycle = plant.fertilizerCycle;
  }
  if (plant.lastFertilized !== undefined) {
    row.last_fertilized = plant.lastFertilized;
    row.lastFertilized = plant.lastFertilized;
  }
  if (plant.pruningSeasons !== undefined) {
    row.pruning_seasons = plant.pruningSeasons;
    row.pruningSeasons = plant.pruningSeasons;
  }
  if (plant.pottingStatus !== undefined) {
    row.potting_status = plant.pottingStatus;
    row.pottingStatus = plant.pottingStatus;
  }
  if (plant.healthStatus !== undefined) {
    row.health_status = plant.healthStatus;
    row.healthStatus = plant.healthStatus;
  }
  if (plant.notes !== undefined) row.notes = plant.notes;
  return row;
};

export const PlantProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [aiContext, setAiContext] = useState<string>('');

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPlants([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // Seeding initial demo plants into Supabase for new user
        console.log('Seeding initial demo plants into Supabase for user:', user.id);
        const seededPlants = initialPlants.map(p => {
          const row = mapPlantToDbRow(p, user.id);
          // remove id so database generates a new UUID
          delete row.id;
          return row;
        });

        const { data: insertedData, error: insertError } = await supabase
          .from('plants')
          .insert(seededPlants)
          .select('*');

        if (insertError) {
          console.error('Error seeding initial plants into Supabase:', insertError);
          // fallback to local seed data
          setPlants(initialPlants);
        } else if (insertedData) {
          setPlants(insertedData.map(mapDbRowToPlant));
        }
      } else {
        setPlants(data.map(mapDbRowToPlant));
      }
    } catch (err) {
      console.error('Error loading plants from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const addPlant = async (newPlantData: Omit<Plant, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dbRow = mapPlantToDbRow(newPlantData, user.id);
      const { data, error } = await supabase
        .from('plants')
        .insert([dbRow])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setPlants((prev) => [...prev, mapDbRowToPlant(data)]);
      }
    } catch (err) {
      console.error('Error adding plant to Supabase:', err);
    }
  };

  const updatePlant = async (id: string, updatedData: Partial<Plant>) => {
    try {
      const dbRow = mapPlantToDbRow(updatedData);
      const { data, error } = await supabase
        .from('plants')
        .update(dbRow)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setPlants((prev) =>
          prev.map((plant) => (plant.id === id ? mapDbRowToPlant(data) : plant))
        );
      }
    } catch (err) {
      console.error('Error updating plant in Supabase:', err);
    }
  };

  const deletePlant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPlants((prev) => prev.filter((plant) => plant.id !== id));
      if (selectedPlantId === id) {
        setSelectedPlantId(null);
      }
    } catch (err) {
      console.error('Error deleting plant in Supabase:', err);
    }
  };

  const replacePlants = async (nextPlants: Plant[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);

      // 1. Delete all existing plants
      const { error: deleteError } = await supabase
        .from('plants')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // 2. Insert new list
      if (nextPlants.length > 0) {
        const rows = nextPlants.map((p) => {
          const row = mapPlantToDbRow(p, user.id);
          delete row.id; // let DB generate UUID
          return row;
        });

        const { data, error: insertError } = await supabase
          .from('plants')
          .insert(rows)
          .select('*');

        if (insertError) {
          throw insertError;
        }

        if (data) {
          setPlants(data.map(mapDbRowToPlant));
        }
      } else {
        setPlants([]);
      }

      setSelectedPlantId(null);
    } catch (err) {
      console.error('Error replacing plants list in Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetPlants = () => {
    replacePlants(initialPlants);
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        loading,
        addPlant,
        updatePlant,
        deletePlant,
        replacePlants,
        resetPlants,
        selectedPlantId,
        setSelectedPlantId,
        activeTab,
        setActiveTab,
        aiContext,
        setAiContext
      }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};
