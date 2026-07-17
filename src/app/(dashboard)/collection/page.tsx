'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { Plant } from '../../../data/plants';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantFormModal } from '../../../components/collection/PlantFormModal';
import { TransitionChecklistModal } from '../../../components/collection/TransitionChecklistModal';

export default function CollectionPage() {
  const router = useRouter();
  const { plants, loading, addPlant, updatePlant, deletePlant } = usePlants();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);

  // AI Search States
  const [filterMode, setFilterMode] = useState<'standard' | 'ai'>('standard');
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const filteredPlants = filterMode === 'ai' && aiFilteredIds !== null
    ? plants.filter(p => aiFilteredIds.includes(p.id))
    : plants.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.species.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (filterMode === 'ai') {
      setFilterMode('standard');
      setAiFilteredIds(null);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setFilterMode('ai');
    setIsSearchingAI(true);
    try {
      const simplifiedPlants = plants.map(p => ({
        id: p.id,
        name: p.name,
        species: p.species,
        category: p.category,
        growthStage: p.growthStage,
        lastWatered: p.lastWatered,
        nextWatering: p.nextWatering,
      }));

      const res = await fetch('/api/ai-collection-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, plants: simplifiedPlants })
      });
      const data = await res.json();
      setAiFilteredIds(data.matchingIds || []);
    } catch (err) {
      console.error("AI search failed", err);
      setAiFilteredIds([]);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    setEditingPlant(plant);
    setIsFormOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deletePlant(id);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/care?plantId=${id}`);
  };

  const openChecklist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveChecklist(id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-sproutly-primary" size={32} />
        <p className="text-sm font-semibold text-sproutly-secondary">Loading your plant collection...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto min-h-full">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-sproutly-primary">
          My Collection
        </h1>

        <div className="flex items-center gap-3 flex-1 lg:max-w-xl lg:ml-auto">
          <div className={`relative flex-1 rounded-xl transition-all duration-300 ${filterMode === 'ai' ? 'ring-2 ring-sproutly-primary shadow-[0_0_15px_rgba(42,107,63,0.3)]' : ''}`}>
            {isSearchingAI ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-primary animate-spin" size={20} />
            ) : filterMode === 'ai' ? (
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-primary animate-pulse" size={20} />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-secondary/50" size={20} />
            )}
            
            <input
              type="text"
              placeholder="Search or ask AI (e.g., Which plants need water?)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAISearch();
              }}
              className="w-full bg-white rounded-xl py-3 pl-10 pr-12 shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-sproutly-light text-sproutly-primary font-semibold"
            />

            {searchQuery && (
              <button
                onClick={filterMode === 'ai' ? () => { setSearchQuery(''); setFilterMode('standard'); setAiFilteredIds(null); } : handleAISearch}
                disabled={isSearchingAI}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                  filterMode === 'ai' 
                    ? 'text-sproutly-secondary hover:bg-black/5' 
                    : 'bg-sproutly-light/20 text-sproutly-primary hover:bg-sproutly-light/40'
                }`}
                title={filterMode === 'ai' ? 'Clear Search' : 'Ask AI'}
              >
                {filterMode === 'ai' ? <X size={16} /> : <Sparkles size={16} />}
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary/50'}`}
              title="Grid View"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary/50'}`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingPlant(null);
              setIsFormOpen(true);
            }}
            className="bg-sproutly-primary text-white p-3 rounded-xl shadow-md hover:bg-sproutly-secondary transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden lg:inline font-semibold">Add Plant</span>
          </button>
        </div>
      </header>

      <div
        className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}
      >
        <AnimatePresence mode="popLayout">
          {filteredPlants.length === 0 && filterMode === 'ai' && !isSearchingAI && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="col-span-full py-16 text-center"
            >
              <div className="inline-block p-4 bg-sproutly-light/10 rounded-full text-sproutly-primary mb-3">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-sproutly-primary mb-1">No matches found</h3>
              <p className="text-sm font-semibold text-sproutly-secondary">Try asking your garden something else!</p>
            </motion.div>
          )}

          {filteredPlants.map((plant) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={plant.id}
              onClick={() => handleCardClick(plant.id)}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow group relative ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4' : ''
              }`}
            >
              <div
                className={`relative shrink-0 ${
                  viewMode === 'grid' ? 'h-40 w-full' : 'h-24 w-24 sm:h-20 sm:w-20 rounded-xl overflow-hidden'
                }`}
              >
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {plant.healthStatus !== 'healthy' && (
                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-sproutly-urgent shadow-sm">
                      <AlertTriangle size={14} />
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex-1 min-w-0 ${viewMode === 'grid' ? 'p-4' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sproutly-primary text-lg truncate pr-2 font-semibold">
                    {plant.name}
                  </h3>
                  {viewMode === 'grid' && (
                    <div className="relative group/actions">
                      <button 
                        type="button"
                        onClick={(e) => e.stopPropagation()} 
                        className="text-sproutly-secondary/50 hover:text-sproutly-primary p-1"
                      >
                        <MoreVertical size={18} />
                      </button>
                      <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl py-1 hidden group-hover/actions:block z-10 w-28 border border-sproutly-bg">
                        <button
                          type="button"
                          onClick={(e) => handleEdit(e, plant)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-sproutly-bg flex items-center gap-2 text-sproutly-primary font-semibold"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, plant.id)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-sproutly-bg flex items-center gap-2 text-sproutly-urgent font-semibold"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-sproutly-secondary italic mb-3 truncate">
                  {plant.species}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sproutly-bg text-sproutly-primary">
                    {plant.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sproutly-light/20 text-sproutly-primary">
                    {plant.growthStage}
                  </span>
                </div>

                {plant.pottingStatus === 'nursery' && viewMode === 'grid' && (
                  <button
                    type="button"
                    onClick={(e) => openChecklist(e, plant.id)}
                    className="w-full mt-2 bg-sproutly-warning/20 text-sproutly-primary text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-sproutly-warning/30 transition-colors"
                  >
                    <AlertTriangle size={14} className="text-sproutly-warning" />
                    Transition Checklist
                  </button>
                )}
              </div>

              {/* List View Details & Actions */}
              {viewMode === 'list' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  {plant.pottingStatus === 'nursery' && (
                    <button
                      type="button"
                      onClick={(e) => openChecklist(e, plant.id)}
                      className="bg-sproutly-warning/20 text-sproutly-primary text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-sproutly-warning/30 transition-colors whitespace-nowrap"
                    >
                      <AlertTriangle size={14} className="text-sproutly-warning" />
                      Checklist
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={(e) => handleEdit(e, plant)}
                      className="p-2 text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-bg rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, plant.id)}
                      className="p-2 text-sproutly-secondary hover:text-sproutly-urgent hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <PlantFormModal
            plant={editingPlant}
            onClose={() => setIsFormOpen(false)}
            onSave={async (data) => {
              if (editingPlant) {
                await updatePlant(editingPlant.id, data);
              } else {
                await addPlant(data);
              }
              setIsFormOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Checklist Modal */}
      <AnimatePresence>
        {activeChecklist && (
          <TransitionChecklistModal
            plantId={activeChecklist}
            onClose={() => setActiveChecklist(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
