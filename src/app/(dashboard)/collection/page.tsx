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
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchWatering, setIsBatchWatering] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterChips = [
    { id: 'All', label: 'All Plants', icon: '🌿' },
    { id: 'Thirsty', label: 'Thirsty', icon: '💧' },
    { id: 'Nursery', label: 'Nursery Pots', icon: '🪴' },
    { id: 'Seedling', label: 'Seedlings', icon: '🌱' },
    { id: 'DirectSun', label: 'Direct Sun', icon: '☀️' },
    { id: 'NeedsPruning', label: 'Needs Pruning', icon: '✂️' },
  ];

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
  ).filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Thirsty') return p.healthStatus === 'needs-water' || new Date(p.nextWatering).getTime() <= Date.now() + 86400000; // Due within 24h
    if (activeFilter === 'Nursery') return p.pottingStatus === 'nursery';
    if (activeFilter === 'Seedling') return p.growthStage === 'Seedling';
    if (activeFilter === 'DirectSun') return p.category === 'Direct Sun';
    if (activeFilter === 'NeedsPruning') return p.healthStatus === 'needs-pruning';
    return true;
  }).sort((a, b) => {
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

  // Clear selection when switching to Grid view
  React.useEffect(() => {
    if (viewMode === 'grid') {
      setSelectedIds(new Set());
    }
  }, [viewMode]);

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

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchWater = async () => {
    if (selectedIds.size === 0) return;
    setIsBatchWatering(true);
    
    const now = new Date().toISOString();
    
    try {
      const updates = Array.from(selectedIds).map(async (id) => {
        const plant = plants.find(p => p.id === id);
        if (!plant) return;
        const nextWatering = new Date(Date.now() + plant.waterInterval * 24 * 60 * 60 * 1000).toISOString();
        await updatePlant(id, { lastWatered: now, nextWatering });
      });
      
      await Promise.all(updates);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to batch water:', err);
    } finally {
      setIsBatchWatering(false);
    }
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
      <header className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 ${plants.length === 0 ? 'hidden lg:flex opacity-0 pointer-events-none' : ''}`}>
        <h1 className="text-3xl font-bold text-sproutly-primary whitespace-nowrap">
          My Collection
        </h1>

        <div className="flex items-center gap-3 flex-1 lg:ml-auto w-full">
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
          
          {/* Custom Sort Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
              className="bg-white rounded-xl px-4 py-3 shadow-sm text-sm font-semibold text-sproutly-primary hover:bg-sproutly-bg transition-colors flex items-center gap-2 border border-sproutly-light/20 min-w-[170px] justify-between"
            >
              <span className="truncate">
                {sortBy === 'newest' ? 'Newest First' : sortBy === 'water_soonest' ? 'Needs Water Soonest' : 'Alphabetical (A-Z)'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-sproutly-light/20 overflow-hidden z-50"
                >
                  <div className="p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => { setSortBy('newest'); setIsSortOpen(false); }}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${sortBy === 'newest' ? 'bg-sproutly-primary/10 text-sproutly-primary' : 'text-sproutly-secondary hover:bg-sproutly-bg hover:text-sproutly-primary'}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => { setSortBy('water_soonest'); setIsSortOpen(false); }}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${sortBy === 'water_soonest' ? 'bg-sproutly-primary/10 text-sproutly-primary' : 'text-sproutly-secondary hover:bg-sproutly-bg hover:text-sproutly-primary'}`}
                    >
                      Needs Water Soonest
                    </button>
                    <button
                      onClick={() => { setSortBy('name'); setIsSortOpen(false); }}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${sortBy === 'name' ? 'bg-sproutly-primary/10 text-sproutly-primary' : 'text-sproutly-secondary hover:bg-sproutly-bg hover:text-sproutly-primary'}`}
                    >
                      Alphabetical (A-Z)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center shrink-0">
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

      {plants.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 lg:py-32 text-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-sproutly-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="text-8xl relative z-10 hover:scale-110 transition-transform duration-500 cursor-default">
              🪴
            </div>
          </div>
          <h2 className="text-4xl font-bold text-sproutly-primary mb-4 tracking-tight">
            Your jungle awaits!
          </h2>
          <p className="text-lg text-sproutly-secondary font-medium max-w-md mx-auto mb-10 leading-relaxed">
            Your digital greenhouse is currently empty. Let's plant your very first seed and start growing together!
          </p>
          <button
            onClick={() => {
              setEditingPlant(null);
              setIsFormOpen(true);
            }}
            className="bg-sproutly-primary text-white px-8 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(42,107,63,0.5)] hover:bg-sproutly-secondary hover:shadow-[0_15px_50px_-10px_rgba(42,107,63,0.6)] hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center gap-3 group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Your First Plant
          </button>
        </motion.div>
      ) : (
        <>
          {/* Smart Filter Chips */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide snap-x">
            {filterChips.map(chip => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-300 snap-start shrink-0 ${
                  activeFilter === chip.id 
                    ? 'bg-sproutly-primary text-white shadow-md scale-105' 
                    : 'bg-white text-sproutly-secondary hover:bg-sproutly-bg border border-sproutly-light/30'
                }`}
              >
                <span className="text-base">{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>

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
          {filteredPlants.length === 0 && !isSearchingAI && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center flex flex-col items-center justify-center"
            >
              <div className="text-5xl mb-4">
                {filterMode === 'ai' ? '🕵️‍♀️🌱' : '🪴🔍'}
              </div>
              <h3 className="text-2xl font-bold text-sproutly-primary mb-2">
                {filterMode === 'ai' ? 'Hmm, no plants matched that!' : 'Nothing found!'}
              </h3>
              <p className="text-sm font-semibold text-sproutly-secondary max-w-sm mx-auto">
                {filterMode === 'ai' 
                  ? "Sproutly AI looked under every leaf, but couldn't find anything matching your request in your jungle. Try asking something else!"
                  : "We couldn't find any plants matching your current search or filters. Try adjusting them!"}
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
              {viewMode === 'list' && (
                <button
                  type="button"
                  onClick={(e) => toggleSelection(e, plant.id)}
                  className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selectedIds.has(plant.id) 
                      ? 'bg-sproutly-primary border-sproutly-primary text-white' 
                      : 'border-sproutly-secondary/30 hover:border-sproutly-primary'
                  }`}
                >
                  {selectedIds.has(plant.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </button>
              )}
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
        </>
      )}

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-sproutly-light/30 p-4 flex items-center gap-6 min-w-[320px]"
          >
            <div className="flex-1">
              <p className="font-bold text-sproutly-primary text-lg">{selectedIds.size} selected</p>
              <p className="text-sm font-semibold text-sproutly-secondary">Ready for chores!</p>
            </div>
            
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sproutly-secondary hover:text-sproutly-primary font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleBatchWater}
              disabled={isBatchWatering}
              className="bg-sproutly-primary text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-sproutly-secondary hover:shadow-lg transition-all duration-300 font-bold flex items-center gap-2"
            >
              {isBatchWatering ? <Loader2 size={18} className="animate-spin" /> : '💦 Water Selected'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
