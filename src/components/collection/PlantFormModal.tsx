'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  X,
  Database,
  PenSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import type { NormalizedPlantSpecies } from '../../services/plantSearchService';
import { useSpeciesSearch } from '../../hooks/useSpeciesSearch';
import { Plant } from '../../data/plants';

const plantFormSchema = z.object({
  name: z.string().min(1, 'Plant nickname is required'),
  species: z.string().min(1, 'Species/Scientific name is required'),
  category: z.enum(['Indoor', 'Semi-Shade', 'Direct Sun']),
  pottingStatus: z.enum(['own', 'nursery', 'ground']),
  growthStage: z.enum(['Seedling', 'Growing', 'Mature', 'Flowering']),
  waterInterval: z.coerce.number().min(1, 'Water interval must be at least 1 day').max(90),
  fertilizerCycle: z.coerce.number().min(1, 'Fertilizer cycle must be at least 1 day').max(180),
  potSize: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  isPetFriendly: z.boolean(),
  image: z.string().optional(),
  notes: z.string().optional(),
});

type PlantFormInputs = z.infer<typeof plantFormSchema>;

interface PlantFormModalProps {
  plant: Plant | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function PlantFormModal({ plant, onClose, onSave }: PlantFormModalProps) {
  const [searchMode, setSearchMode] = useState<'search' | 'custom'>(plant ? 'custom' : 'search');
  const [step, setStep] = useState<'select' | 'customize'>(plant ? 'customize' : 'select');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMagicFilling, setIsMagicFilling] = useState(false);
  
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [debouncedImageSearch, setDebouncedImageSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedImageSearch(imageSearchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [imageSearchQuery]);

  const { data: imageResults, isLoading: isSearchingImages } = useSpeciesSearch(debouncedImageSearch, 1);

  // Debounce search query to prevent hitting API on every keypress
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Use React Query for Perenual API search
  const { data: dbData, isLoading: isSearching, isError: searchError } = useSpeciesSearch(
    debouncedSearchQuery,
    currentPage
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlantFormInputs>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: plant?.name || '',
      species: plant?.species || '',
      category: plant?.category || 'Indoor',
      pottingStatus: plant?.pottingStatus || 'own',
      growthStage: plant?.growthStage || 'Growing',
      waterInterval: plant?.waterInterval || 7,
      fertilizerCycle: plant?.fertilizerCycle || 30,
      potSize: plant?.potSize || '6"',
      location: plant?.location || 'Living Room',
      isPetFriendly: plant?.isPetFriendly ?? false,
      image: plant?.image || '',
      notes: plant?.notes || '',
    },
  });

  const formImage = watch('image');
  const formName = watch('name');
  const formSpecies = watch('species');
  const formPottingStatus = watch('pottingStatus');

  const handleMagicFill = async () => {
    if (!formName || formName.trim().length < 3) return;
    setIsMagicFilling(true);
    try {
      const res = await fetch('/api/ai-magic-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantName: formName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.species) setValue('species', data.species, { shouldValidate: true });
        if (data.category) setValue('category', data.category as any, { shouldValidate: true });
        if (data.waterInterval) setValue('waterInterval', data.waterInterval, { shouldValidate: true });
        if (data.isPetFriendly !== undefined) setValue('isPetFriendly', data.isPetFriendly, { shouldValidate: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMagicFilling(false);
    }
  };

  const handleSelectDbPlant = (dbPlant: NormalizedPlantSpecies) => {
    setValue('name', dbPlant.common_name);
    setValue('species', dbPlant.scientific_name);
    setValue('image', dbPlant.image_url);
    setStep('customize');
  };

  const handleSave = (data: PlantFormInputs) => {
    let finalPotSize = data.potSize?.trim();
    if (finalPotSize && !finalPotSize.endsWith('"') && !isNaN(Number(finalPotSize))) {
      finalPotSize += '"';
    }

    const finalImage = data.image || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800';
    
    // Compute last/next watering dates based on interval
    const lastWatered = plant?.lastWatered || new Date().toISOString();
    const nextWatering = new Date(Date.now() + data.waterInterval * 24 * 60 * 60 * 1000).toISOString();
    
    onSave({
      ...data,
      potSize: finalPotSize,
      image: finalImage,
      lastWatered,
      nextWatering,
      lastFertilized: plant?.lastFertilized || new Date().toISOString(),
      pruningSeasons: plant?.pruningSeasons || ['Spring'],
      healthStatus: plant?.healthStatus || 'healthy',
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-sproutly-primary/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-sproutly-bg w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-sproutly-secondary/10 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            {step === 'customize' && searchMode === 'search' && !plant && (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="p-2 -ml-2 text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-bg rounded-full transition-all"
                title="Back to search"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-sproutly-primary">
              {plant ? 'Edit Plant' : step === 'customize' ? 'Customize Plant' : 'Add New Plant'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-sproutly-secondary hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Selector */}
        {!plant && step === 'select' && (
          <div className="px-6 pt-4 bg-white border-b border-sproutly-secondary/10 flex gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setSearchMode('search')}
              className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                searchMode === 'search'
                  ? 'border-sproutly-primary text-sproutly-primary'
                  : 'border-transparent text-sproutly-secondary hover:text-sproutly-primary'
              }`}
            >
              <Database size={16} />
              Search Database
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchMode('custom');
                setStep('customize');
              }}
              className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                searchMode === 'custom'
                  ? 'border-sproutly-primary text-sproutly-primary'
                  : 'border-transparent text-sproutly-secondary hover:text-sproutly-primary'
              }`}
            >
              <PenSquare size={16} />
              Custom Details
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* STEP 1: SELECT PLANT FROM DATABASE */}
          {step === 'select' && searchMode === 'search' && (
            <div className="space-y-5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-secondary/50" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search plant database (e.g. Fern, Rose, Monstera)..."
                  className="w-full bg-white rounded-xl py-3 pl-10 pr-4 shadow-sm border border-sproutly-secondary/20 focus:outline-none focus:ring-2 focus:ring-sproutly-light text-sproutly-primary font-semibold"
                />
              </div>

              {/* Error message */}
              {searchError && (
                <div className="text-center py-4 text-sproutly-urgent font-semibold bg-sproutly-urgent/10 rounded-2xl">
                  Failed to load plant list. Please check your internet connection.
                </div>
              )}

              {/* Results grid */}
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-sproutly-primary" size={32} />
                  <p className="text-sm font-semibold text-sproutly-secondary">Searching Perenual database...</p>
                </div>
              ) : !dbData?.data || dbData.data.length === 0 ? (
                <div className="text-center py-16 text-sproutly-secondary font-medium">
                  No plant species found. Try searching for something else or add a custom plant!
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider">
                      {debouncedSearchQuery ? 'Search Results' : 'Suggested Plants (Perenual API)'}
                    </h3>
                    {dbData.total > 0 && (
                      <span className="text-xs font-semibold text-sproutly-secondary bg-white px-2 py-1 rounded-lg border border-sproutly-secondary/10">
                        {dbData.total} items found
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dbData.data.map((dbPlant) => (
                      <div
                        key={dbPlant.id}
                        onClick={() => handleSelectDbPlant(dbPlant)}
                        className="bg-white p-3 rounded-2xl border border-sproutly-secondary/15 flex items-center gap-3 cursor-pointer hover:border-sproutly-light hover:shadow-sm transition-all group"
                      >
                        <img
                          src={dbPlant.image_url}
                          alt={dbPlant.common_name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-sproutly-bg"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sproutly-primary text-sm truncate group-hover:text-sproutly-secondary transition-colors font-semibold">
                            {dbPlant.common_name}
                          </h4>
                          <p className="text-xs text-sproutly-secondary italic truncate">
                            {dbPlant.scientific_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controller */}
                  {dbData.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-1.5 border-t border-sproutly-secondary/10 pt-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-xl border border-sproutly-secondary/20 text-sproutly-secondary hover:text-sproutly-primary hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                        title="Previous Page"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      
                      <span className="text-xs font-bold text-sproutly-primary bg-white px-3 py-2 rounded-xl border border-sproutly-secondary/20 select-none">
                        Page {currentPage} of {dbData.lastPage}
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(dbData.lastPage, prev + 1))}
                        disabled={currentPage === dbData.lastPage}
                        className="p-2.5 rounded-xl border border-sproutly-secondary/20 text-sproutly-secondary hover:text-sproutly-primary hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                        title="Next Page"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CUSTOMIZE PLANT DETAILS */}
          {step === 'customize' && (
            <form id="plant-form" onSubmit={handleSubmit(handleSave)} className="space-y-5">
              {/* Database Plant Preview banner */}
              {searchMode === 'search' && !plant && formImage && (
                <div className="bg-sproutly-light/10 border border-sproutly-light/20 p-4 rounded-2xl flex items-center gap-4">
                  <img
                    src={formImage}
                    alt={formName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-sproutly-bg shadow-sm"
                  />
                  <div>
                    <div className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider font-semibold">Selected Species</div>
                    <h3 className="font-bold text-sproutly-primary text-lg leading-tight">{formName}</h3>
                    <p className="text-xs text-sproutly-secondary italic">{formSpecies}</p>
                  </div>
                </div>
              )}

              {/* Form Input fields */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="form-name" className="block text-sm font-semibold text-sproutly-secondary">
                    Plant Nickname
                  </label>
                  <button
                    type="button"
                    onClick={handleMagicFill}
                    disabled={isMagicFilling || !formName || formName.trim().length < 3}
                    className="text-xs font-bold text-sproutly-primary bg-sproutly-primary/10 hover:bg-sproutly-primary/20 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Type a nickname first, then let AI guess the botanical details!"
                  >
                    {isMagicFilling ? <Loader2 size={14} className="animate-spin" /> : '✨'} 
                    {isMagicFilling ? 'Thinking...' : 'Magic Fill'}
                  </button>
                </div>
                <input
                  type="text"
                  id="form-name"
                  {...register('name')}
                  placeholder="e.g. My Bedroom Monstera, Leafy"
                  className={`w-full p-3.5 rounded-xl border ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-secondary/20 focus:ring-sproutly-light'
                  } focus:outline-none focus:ring-1 bg-white text-sproutly-primary font-semibold`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-semibold mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="form-species" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Species / Scientific Name
                </label>
                <input
                  type="text"
                  id="form-species"
                  {...register('species')}
                  placeholder="e.g. Monstera deliciosa"
                  className={`w-full p-3.5 rounded-xl border ${
                    errors.species ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-secondary/20 focus:ring-sproutly-light'
                  } focus:outline-none focus:ring-1 bg-white text-sproutly-primary font-semibold`}
                />
                {errors.species && (
                  <p className="text-red-500 text-xs font-semibold mt-1">{errors.species.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="form-category" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Light Requirement
                  </label>
                  <select
                    id="form-category"
                    {...register('category')}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Semi-Shade">Semi-Shade</option>
                    <option value="Direct Sun">Direct Sun</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="form-potting" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Potting Status
                  </label>
                  <select
                    id="form-potting"
                    {...register('pottingStatus')}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option value="own">Own Pot</option>
                    <option value="nursery">Nursery Pot</option>
                    <option value="ground">In Ground</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="form-growth" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Growth Stage
                  </label>
                  <select
                    id="form-growth"
                    {...register('growthStage')}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Growing">Growing</option>
                    <option value="Mature">Mature</option>
                    <option value="Flowering">Flowering</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="form-cycle" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Water Interval (days)
                  </label>
                  <input
                    type="number"
                    id="form-cycle"
                    {...register('waterInterval')}
                    className={`w-full p-3.5 rounded-xl border ${
                      errors.waterInterval ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-secondary/20 focus:ring-sproutly-light'
                    } focus:outline-none focus:ring-1 bg-white text-sproutly-primary font-semibold`}
                  />
                  {errors.waterInterval && (
                    <p className="text-red-500 text-xs font-semibold mt-1">{errors.waterInterval.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="form-fert-cycle" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Fertilizer Cycle (days)
                  </label>
                  <input
                    type="number"
                    id="form-fert-cycle"
                    {...register('fertilizerCycle')}
                    placeholder="e.g. 30"
                    className={`w-full p-3.5 rounded-xl border ${
                      errors.fertilizerCycle ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-secondary/20 focus:ring-sproutly-light'
                    } focus:outline-none focus:ring-1 bg-white text-sproutly-primary font-semibold`}
                  />
                  {errors.fertilizerCycle && (
                    <p className="text-red-500 text-xs font-semibold mt-1">{errors.fertilizerCycle.message}</p>
                  )}
                </div>
                {formPottingStatus !== 'ground' && (
                  <div>
                    <label htmlFor="form-pot-size" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                      Pot Size
                    </label>
                    <input
                      type="text"
                      id="form-pot-size"
                      {...register('potSize')}
                      onBlur={(e) => {
                        register('potSize').onBlur(e);
                        const val = e.target.value.trim();
                        if (val && !val.endsWith('"') && !isNaN(Number(val))) {
                          setValue('potSize', val + '"', { shouldValidate: true });
                        }
                      }}
                      placeholder="e.g. 14, 16"
                      className={`w-full p-3.5 rounded-xl border ${
                        errors.potSize ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-secondary/20 focus:ring-sproutly-light'
                      } focus:outline-none focus:ring-1 bg-white text-sproutly-primary font-semibold`}
                    />
                    {errors.potSize && (
                      <p className="text-red-500 text-xs font-semibold mt-1">{errors.potSize.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5 items-end">
                <div>
                  <label htmlFor="form-location" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Location
                  </label>
                  <select
                    id="form-location"
                    {...register('location')}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Office">Office</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Patio">Patio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3.5 border border-sproutly-secondary/20 rounded-xl cursor-pointer hover:bg-sproutly-bg transition-colors">
                    <input
                      type="checkbox"
                      {...register('isPetFriendly')}
                      className="w-5 h-5 rounded border-sproutly-secondary/30 text-sproutly-primary focus:ring-sproutly-light"
                    />
                    <span className="text-sm font-semibold text-sproutly-primary">Pet Friendly? 🐾</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sproutly-secondary mb-3">
                  Choose a Cover Photo
                </label>
                
                {/* Selected Image Preview & URL Input */}
                <div className="flex gap-4 items-start mb-4 bg-sproutly-bg p-3 rounded-2xl border border-sproutly-secondary/10">
                  <div className="w-16 h-16 rounded-xl bg-white shrink-0 overflow-hidden shadow-sm border border-sproutly-secondary/20">
                    {formImage ? (
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sproutly-secondary/50">
                        <Database size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      id="form-image"
                      {...register('image')}
                      placeholder="Paste any image URL here..."
                      className="w-full p-2.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary text-xs font-mono mb-1"
                    />
                    <p className="text-xs text-sproutly-secondary italic">Or select one from our curated Unsplash gallery below!</p>
                  </div>
                </div>

                {/* Dynamic Image Search Gallery */}
                <div className="bg-sproutly-bg p-4 rounded-2xl border border-sproutly-secondary/10">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-secondary/50" size={16} />
                    <input
                      type="text"
                      value={imageSearchQuery}
                      onChange={(e) => setImageSearchQuery(e.target.value)}
                      placeholder="Search database for a photo (e.g. Fern)..."
                      className="w-full bg-white rounded-xl py-2.5 pl-9 pr-4 shadow-sm border border-sproutly-secondary/20 focus:outline-none focus:ring-2 focus:ring-sproutly-light text-sproutly-primary text-sm font-semibold"
                    />
                  </div>
                  
                  {isSearchingImages ? (
                    <div className="flex justify-center py-6"><Loader2 className="animate-spin text-sproutly-primary" size={24} /></div>
                  ) : imageResults?.data && imageResults.data.filter(p => p.image_url && !p.image_url.includes('upgrade_access.jpg')).length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[140px] overflow-y-auto scrollbar-hide p-1">
                      {imageResults.data
                        .filter(p => p.image_url && !p.image_url.includes('upgrade_access.jpg'))
                        .map((dbPlant) => (
                        <button
                          key={`img-${dbPlant.id}`}
                          type="button"
                          onClick={() => setValue('image', dbPlant.image_url, { shouldValidate: true })}
                          className={`relative aspect-square rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${formImage === dbPlant.image_url ? 'ring-2 ring-sproutly-primary ring-offset-2 scale-105' : 'border border-sproutly-secondary/20'}`}
                        >
                          <img src={dbPlant.image_url} alt={dbPlant.common_name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-center text-sproutly-secondary py-6 font-semibold">No images found. Try a different search term!</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="form-notes" className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Notes
                </label>
                <textarea
                  id="form-notes"
                  {...register('notes')}
                  placeholder="Add care tips, location, or general observation notes..."
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-sproutly-secondary/10 bg-white shrink-0 flex gap-3">
          {searchMode === 'search' && step === 'select' ? (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-sproutly-primary py-3.5 rounded-xl font-bold border border-sproutly-secondary/20 hover:bg-sproutly-bg transition-colors"
            >
              Cancel
            </button>
          ) : (
            <>
              {searchMode === 'search' && !plant && (
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 bg-white text-sproutly-primary py-3.5 rounded-xl font-bold border border-sproutly-secondary/20 hover:bg-sproutly-bg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Search Again
                </button>
              )}
              <button
                type="submit"
                form="plant-form"
                className="flex-1 bg-sproutly-primary text-white py-3.5 rounded-xl font-bold hover:bg-sproutly-secondary transition-colors"
              >
                {plant ? 'Save Changes' : 'Add to Collection'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
