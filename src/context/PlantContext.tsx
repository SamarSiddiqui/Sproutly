import React, { useState, createContext, useContext } from 'react';
import { Plant, initialPlants } from '../data/plants';
interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiContext: string;
  setAiContext: (context: string) => void;
}
const PlantContext = createContext<PlantContextType | undefined>(undefined);
export const PlantProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [aiContext, setAiContext] = useState<string>('');
  const addPlant = (newPlantData: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...newPlantData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPlants((prev) => [...prev, newPlant]);
  };
  const updatePlant = (id: string, updatedData: Partial<Plant>) => {
    setPlants((prev) =>
    prev.map((plant) =>
    plant.id === id ?
    {
      ...plant,
      ...updatedData
    } :
    plant
    )
    );
  };
  const deletePlant = (id: string) => {
    setPlants((prev) => prev.filter((plant) => plant.id !== id));
    if (selectedPlantId === id) {
      setSelectedPlantId(null);
    }
  };
  return (
    <PlantContext.Provider
      value={{
        plants,
        addPlant,
        updatePlant,
        deletePlant,
        selectedPlantId,
        setSelectedPlantId,
        activeTab,
        setActiveTab,
        aiContext,
        setAiContext
      }}>
      
      {children}
    </PlantContext.Provider>);

};
export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};