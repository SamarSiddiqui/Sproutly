import React, { useState, useEffect } from 'react';
import { usePlants } from '../context/PlantContext';
import { Plant, Category, GrowthStage, PottingStatus } from '../data/plants';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Droplets,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Database,
  ArrowLeft,
  PenSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { perenualService, NormalizedPlantSpecies } from '../services/perenualService';
export const Collection: React.FC = () => {
  const {
    plants,
    addPlant,
    updatePlant,
    deletePlant,
    setSelectedPlantId,
    setActiveTab
  } = usePlants();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
  const filteredPlants = plants.filter(
    (p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.species.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsFormOpen(true);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deletePlant(id);
    }
  };
  const handleCardClick = (id: string) => {
    setSelectedPlantId(id);
    setActiveTab('care');
  };
  const openChecklist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveChecklist(id);
  };
  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto min-h-full">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-sproutly-primary">
          My Collection
        </h1>

        <div className="flex items-center gap-3 flex-1 lg:max-w-xl lg:ml-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-secondary/50"
              size={20} />
            
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-sproutly-light text-sproutly-primary" />
            
          </div>
          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary/50'}`}>
              
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary/50'}`}>
              
              <List size={20} />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingPlant(null);
              setIsFormOpen(true);
            }}
            className="bg-sproutly-primary text-white p-3 rounded-xl shadow-md hover:bg-sproutly-secondary transition-colors flex items-center gap-2">
            
            <Plus size={20} />
            <span className="hidden lg:inline font-semibold">Add Plant</span>
          </button>
        </div>
      </header>

      <div
        className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
        
        <AnimatePresence>
          {filteredPlants.map((plant) =>
          <motion.div
            layout
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            key={plant.id}
            onClick={() => handleCardClick(plant.id)}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow group relative ${viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4' : ''}`}>
            
              <div
              className={`relative shrink-0 ${viewMode === 'grid' ? 'h-40 w-full' : 'h-24 w-24 sm:h-20 sm:w-20 rounded-xl overflow-hidden'}`}>
              
                <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover" />
              
                <div className="absolute top-2 right-2 flex gap-1">
                  {plant.healthStatus !== 'healthy' &&
                <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-sproutly-urgent shadow-sm">
                      <AlertTriangle size={14} />
                    </div>
                }
                </div>
              </div>

              <div
              className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'min-w-0'}`}>
              
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sproutly-primary text-lg truncate pr-2">
                    {plant.name}
                  </h3>
                  {viewMode === 'grid' &&
                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}>
                  
                      <button className="text-sproutly-secondary/50 hover:text-sproutly-primary p-1">
                        <MoreVertical size={18} />
                      </button>
                      <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl py-1 hidden group-hover:block z-10 w-28 border border-sproutly-bg">
                        <button
                      onClick={() => handleEdit(plant)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-sproutly-bg flex items-center gap-2 text-sproutly-primary">
                      
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                      onClick={() => handleDelete(plant.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-sproutly-bg flex items-center gap-2 text-sproutly-urgent">
                      
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                }
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

                {plant.pottingStatus === 'nursery' && viewMode === 'grid' &&
              <button
                onClick={(e) => openChecklist(e, plant.id)}
                className="w-full mt-2 bg-sproutly-warning/20 text-sproutly-primary text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-sproutly-warning/30 transition-colors">
                
                    <AlertTriangle size={14} className="text-sproutly-warning" />
                    Transition Checklist
                  </button>
              }
              </div>

              {/* List View Extra Details & Actions */}
              {viewMode === 'list' &&
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  {plant.pottingStatus === 'nursery' &&
              <button
                onClick={(e) => openChecklist(e, plant.id)}
                className="bg-sproutly-warning/20 text-sproutly-primary text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-sproutly-warning/30 transition-colors whitespace-nowrap">
                
                      <AlertTriangle
                  size={14}
                  className="text-sproutly-warning" />
                
                      Checklist
                    </button>
              }
                  <div
                className="flex items-center gap-2 ml-auto"
                onClick={(e) => e.stopPropagation()}>
                
                    <button
                  onClick={() => handleEdit(plant)}
                  className="p-2 text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-bg rounded-lg transition-colors">
                  
                      <Edit2 size={18} />
                    </button>
                    <button
                  onClick={() => handleDelete(plant.id)}
                  className="p-2 text-sproutly-secondary hover:text-sproutly-urgent hover:bg-red-50 rounded-lg transition-colors">
                  
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
            }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen &&
        <PlantFormModal
          plant={editingPlant}
          onClose={() => setIsFormOpen(false)}
          onSave={(data: any) => {
            if (editingPlant) updatePlant(editingPlant.id, data);else
            addPlant(data as any);
            setIsFormOpen(false);
          }} />

        }
      </AnimatePresence>

      {/* Checklist Modal */}
      <AnimatePresence>
        {activeChecklist &&
        <TransitionChecklistModal
          plantId={activeChecklist}
          onClose={() => setActiveChecklist(null)} />

        }
      </AnimatePresence>
    </div>);

};
// Sub-components for Modals
const PlantFormModal = ({ plant, onClose, onSave }: any) => {
  const [searchMode, setSearchMode] = useState<'search' | 'custom'>(plant ? 'custom' : 'search');
  const [step, setStep] = useState<'select' | 'customize'>(plant ? 'customize' : 'select');
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbResults, setDbResults] = useState<NormalizedPlantSpecies[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [formData, setFormData] = useState(
    plant || {
      name: '',
      species: '',
      category: 'Indoor',
      growthStage: 'Growing',
      fertilizerCycle: 30,
      pottingStatus: 'own',
      healthStatus: 'healthy',
      image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
      lastWatered: new Date().toISOString(),
      nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastFertilized: new Date().toISOString(),
      pruningSeasons: ['Spring'],
      notes: ''
    }
  );

  // Load featured species on mount or if query is cleared
  useEffect(() => {
    if (searchMode === 'search' && step === 'select' && dbSearchQuery.trim() === '') {
      setIsSearching(true);
      setSearchError('');
      perenualService.getFeaturedSpecies()
        .then((results) => {
          setDbResults(results);
        })
        .catch((err) => {
          console.error(err);
          setSearchError('Failed to load featured plants.');
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [searchMode, step]);

  const handleDbSearch = async () => {
    setIsSearching(true);
    setSearchError('');
    try {
      if (dbSearchQuery.trim() === '') {
        const results = await perenualService.getFeaturedSpecies();
        setDbResults(results);
      } else {
        const results = await perenualService.searchSpecies(dbSearchQuery);
        setDbResults(results);
      }
    } catch (err) {
      console.error(err);
      setSearchError('Error searching the database. Please check your network.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDbSearch();
    }
  };

  const handleSelectDbPlant = (dbPlant: NormalizedPlantSpecies) => {
    setFormData((prev: any) => ({
      ...prev,
      name: dbPlant.common_name,
      species: dbPlant.scientific_name,
      image: dbPlant.image_url
    }));
    setStep('customize');
  };

  return (
    <div className="fixed inset-0 bg-sproutly-primary/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
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
            onClick={onClose}
            className="p-2 text-sproutly-secondary hover:bg-black/5 rounded-full transition-colors"
          >
            <MoreVertical size={24} className="rotate-90" />
          </button>
        </div>

        {/* Tab Selector - Only shown when adding a plant and in select step */}
        {!plant && step === 'select' && (
          <div className="px-6 pt-4 bg-white border-b border-sproutly-secondary/10 flex gap-4 shrink-0">
            <button
              onClick={() => {
                setSearchMode('search');
                setSearchError('');
              }}
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sproutly-secondary/50" size={18} />
                  <input
                    type="text"
                    value={dbSearchQuery}
                    onChange={(e) => setDbSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search plant database (e.g. Fern, Rose, Monstera)..."
                    className="w-full bg-white rounded-xl py-3 pl-10 pr-4 shadow-sm border border-sproutly-secondary/20 focus:outline-none focus:ring-2 focus:ring-sproutly-light text-sproutly-primary"
                  />
                </div>
                <button
                  onClick={handleDbSearch}
                  disabled={isSearching}
                  className="bg-sproutly-primary text-white px-5 py-3 rounded-xl shadow-md hover:bg-sproutly-secondary transition-colors font-semibold"
                >
                  Search
                </button>
              </div>

              {/* Error messages */}
              {searchError && (
                <div className="text-center py-4 text-sproutly-urgent font-semibold bg-sproutly-urgent/10 rounded-2xl">
                  {searchError}
                </div>
              )}

              {/* Search Results Grid */}
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-sproutly-primary" size={32} />
                  <p className="text-sm font-semibold text-sproutly-secondary">Searching Perenual database...</p>
                </div>
              ) : dbResults.length === 0 ? (
                <div className="text-center py-16 text-sproutly-secondary font-medium">
                  No plant species found. Try searching for something else or add a custom plant!
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider">
                    {dbSearchQuery ? 'Search Results' : 'Suggested Plants (Perenual API)'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dbResults.map((dbPlant) => (
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
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CUSTOMIZE PLANT DETAILS */}
          {step === 'customize' && (
            <div className="space-y-5">
              {/* Selected Database Plant Preview banner */}
              {searchMode === 'search' && !plant && (
                <div className="bg-sproutly-light/10 border border-sproutly-light/20 p-4 rounded-2xl flex items-center gap-4">
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-sproutly-bg shadow-sm"
                  />
                  <div>
                    <div className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider font-semibold">Selected Species</div>
                    <h3 className="font-bold text-sproutly-primary text-lg leading-tight">{formData.name}</h3>
                    <p className="text-xs text-sproutly-secondary italic">{formData.species}</p>
                  </div>
                </div>
              )}

              {/* Form Input fields */}
              <div>
                <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Plant Nickname
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. My Bedroom Monster, Leafy"
                  className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Species / Scientific Name
                </label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  placeholder="e.g. Monstera deliciosa"
                  className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Category / Light Requirement
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option>Indoor</option>
                    <option>Semi-Shade</option>
                    <option>Direct Sun</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Potting Status
                  </label>
                  <select
                    value={formData.pottingStatus}
                    onChange={(e) => setFormData({ ...formData, pottingStatus: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option value="own">Own Pot</option>
                    <option value="nursery">Nursery Pot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Growth Stage
                  </label>
                  <select
                    value={formData.growthStage}
                    onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  >
                    <option>Seedling</option>
                    <option>Growing</option>
                    <option>Mature</option>
                    <option>Flowering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                    Water Interval (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formData.fertilizerCycle}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 7;
                      setFormData({
                        ...formData,
                        fertilizerCycle: val,
                        nextWatering: new Date(Date.now() + val * 24 * 60 * 60 * 1000).toISOString()
                      });
                    }}
                    className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/plant-image.jpg"
                  className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-sproutly-secondary mb-1.5">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add care tips, location, or general observation notes..."
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-sproutly-secondary/20 focus:outline-none focus:border-sproutly-light focus:ring-1 focus:ring-sproutly-light bg-white text-sproutly-primary font-semibold resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-sproutly-secondary/10 bg-white shrink-0 flex gap-3">
          {searchMode === 'search' && step === 'select' ? (
            <button
              onClick={onClose}
              className="flex-1 bg-white text-sproutly-primary py-3.5 rounded-xl font-bold border border-sproutly-secondary/20 hover:bg-sproutly-bg transition-colors"
            >
              Cancel
            </button>
          ) : (
            <>
              {searchMode === 'search' && !plant && (
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 bg-white text-sproutly-primary py-3.5 rounded-xl font-bold border border-sproutly-secondary/20 hover:bg-sproutly-bg transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Search Again
                </button>
              )}
              <button
                onClick={() => {
                  if (searchMode === 'custom' && !plant) {
                    if (!formData.image) {
                      formData.image = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800';
                    }
                  }
                  onSave(formData);
                }}
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
};
const TransitionChecklistModal = ({ plantId, onClose }: any) => {
  const { updatePlant, setActiveTab } = usePlants();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = [
  {
    id: 'soil',
    label: 'Soil Mix Ready?',
    guide: 'soil-mixing'
  },
  {
    id: 'roots',
    label: 'Root Health Checked?',
    guide: 'root-health'
  },
  {
    id: 'drainage',
    label: 'Drainage Holes Confirmed?',
    guide: 'drainage'
  },
  {
    id: 'pot',
    label: 'Pot Size Appropriate?',
    guide: 'pot-sizing'
  }];

  const allChecked = items.every((item) => checked[item.id]);
  const handleComplete = () => {
    updatePlant(plantId, {
      pottingStatus: 'own'
    });
    onClose();
  };
  const goToGuide = (guideId: string) => {
    setActiveTab('knowledge');
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-sproutly-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{
          scale: 0.95,
          opacity: 0,
          y: 20
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0
        }}
        exit={{
          scale: 0.95,
          opacity: 0,
          y: 20
        }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-sproutly-primary mb-2">
          Nursery Transition
        </h2>
        <p className="text-sproutly-secondary mb-8">
          Complete these checks before repotting your new plant.
        </p>

        <div className="space-y-4 mb-8">
          {items.map((item) =>
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-sproutly-bg">
            
              <label className="flex items-center gap-4 cursor-pointer flex-1">
                <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked[item.id] ? 'bg-sproutly-primary border-sproutly-primary' : 'border-sproutly-secondary/30'}`}>
                
                  {checked[item.id] &&
                <CheckCircle2 size={16} className="text-white" />
                }
                </div>
                <input
                type="checkbox"
                className="hidden"
                checked={!!checked[item.id]}
                onChange={() =>
                setChecked((prev) => ({
                  ...prev,
                  [item.id]: !prev[item.id]
                }))
                } />
              
                <span
                className={`font-semibold ${checked[item.id] ? 'text-sproutly-secondary line-through' : 'text-sproutly-primary'}`}>
                
                  {item.label}
                </span>
              </label>
              <button
              onClick={() => goToGuide(item.guide)}
              className="text-sm text-sproutly-light font-bold hover:text-sproutly-primary px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
              
                Guide
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-sproutly-secondary bg-sproutly-bg hover:bg-sproutly-secondary/10 transition-colors">
            
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition-colors ${allChecked ? 'bg-sproutly-primary hover:bg-sproutly-secondary' : 'bg-sproutly-secondary/30 cursor-not-allowed'}`}>
            
            Complete
          </button>
        </div>
      </motion.div>
    </div>);

};
