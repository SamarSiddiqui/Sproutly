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

  const [filterMode, setFilterMode] = useState<'standard' | 'ai'>('standard');
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'water_soonest' | 'name'>('newest');

  const isLikelySentence = searchQuery.trim().split(' ').length > 2 || searchQuery.length > 20;

  const filteredPlants = (filterMode === 'ai' && aiFilteredIds !== null
    ? plants.filter(p => aiFilteredIds.includes(p.id))
    : isLikelySentence 
      ? [...plants] 
      : plants.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.species.toLowerCase().includes(searchQuery.toLowerCase())
        )
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'water_soonest') return new Date(a.nextWatering).getTime() - new Date(b.nextWatering).getTime();
    return 0; // Default: rely on original array order from Supabase
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (filterMode === 'ai') {
      setFilterMode('standard');
      setAiFilteredIds(null);
    }
  };

  React.useEffect(() => {
    const isSentence = searchQuery.trim().split(' ').length > 2 || searchQuery.length > 20;
    
    if (isSentence && filterMode !== 'ai') {
      const handler = setTimeout(() => {
        handleAISearch();
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [searchQuery, filterMode]);

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
          <div className={`relative flex-1 rounded-2xl transition-all duration-500 overflow-hidden ${
            isSearchingAI 
              ? 'ring-2 ring-sproutly-primary/60 shadow-[0_0_30px_rgba(42,107,63,0.4)] scale-[1.02]' 
              : filterMode === 'ai' 
              ? 'ring-2 ring-sproutly-primary shadow-[0_0_15px_rgba(42,107,63,0.3)]' 
              : 'ring-1 ring-sproutly-primary/20 hover:ring-sproutly-primary/40 shadow-sm'
          }`}>
            
            {/* Animated Gradient Background during AI Search */}
            {isSearchingAI && (
              <div className="absolute inset-0 bg-gradient-to-r from-sproutly-primary/10 via-sproutly-light/20 to-sproutly-primary/10 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]" />
            )}

            <div className="relative z-10 flex items-center w-full">
              {isSearchingAI ? (
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sproutly-primary animate-[spin_3s_linear_infinite]" size={20} />
              ) : (
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sproutly-primary/60" size={20} />
              )}
              
              <input
                type="text"
                placeholder="Search or ask AI anything..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAISearch();
                }}
                className="w-full bg-transparent rounded-2xl py-3.5 pl-11 pr-14 border-none focus:outline-none text-sproutly-primary font-semibold placeholder:text-sproutly-secondary/60 placeholder:font-medium"
              />

              {searchQuery && (
                <button
                  onClick={filterMode === 'ai' ? () => { setSearchQuery(''); setFilterMode('standard'); setAiFilteredIds(null); } : handleAISearch}
                  disabled={isSearchingAI}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    filterMode === 'ai' 
                      ? 'text-sproutly-secondary hover:bg-black/5' 
                      : isLikelySentence
                      ? 'bg-sproutly-primary text-white shadow-md hover:bg-sproutly-secondary scale-105'
                      : 'bg-sproutly-light/20 text-sproutly-primary hover:bg-sproutly-light/40'
                  }`}
                  title={filterMode === 'ai' ? 'Clear Search' : 'Ask AI'}
                >
                  {filterMode === 'ai' ? <X size={18} /> : isSearchingAI ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className={isLikelySentence ? "animate-pulse" : ""} />}
                </button>
              )}
            </div>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white rounded-xl px-4 py-3 shadow-sm text-sm font-semibold text-sproutly-primary border-none focus:ring-2 focus:ring-sproutly-light focus:outline-none hidden sm:block appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232A6B3F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '1rem auto', paddingRight: '2.5rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="water_soonest">Needs Water Soonest</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>

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
        className={`grid gap-4 lg:gap-6 relative ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}
      >
        {/* Scanning Overlay Effect */}
        <AnimatePresence>
          {isSearchingAI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 pointer-events-none rounded-3xl overflow-hidden"
            >
              <div className="w-full h-full bg-sproutly-primary/10 backdrop-blur-[2px]" />
              <motion.div 
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-sproutly-primary/60 to-transparent shadow-[0_0_30px_rgba(42,107,63,0.4)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {filteredPlants.length === 0 && filterMode === 'ai' && !isSearchingAI && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center flex flex-col items-center justify-center"
            >
              <div className="text-5xl mb-4">
                🕵️‍♀️🌱
              </div>
              <h3 className="text-2xl font-bold text-sproutly-primary mb-2">Hmm, no plants matched that!</h3>
              <p className="text-sm font-semibold text-sproutly-secondary max-w-sm mx-auto">
                Sproutly AI looked under every leaf, but couldn't find anything matching your request in your jungle. Try asking something else!
              </p>
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
