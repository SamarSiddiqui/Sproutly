import React, { useState } from 'react';
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
  CheckCircle2 } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <h1 className="text-3xl font-bold text-verdant-primary">
          My Collection
        </h1>

        <div className="flex items-center gap-3 flex-1 lg:max-w-xl lg:ml-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-verdant-secondary/50"
              size={20} />
            
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-verdant-light text-verdant-primary" />
            
          </div>
          <div className="bg-white rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-verdant-bg text-verdant-primary' : 'text-verdant-secondary/50'}`}>
              
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-verdant-bg text-verdant-primary' : 'text-verdant-secondary/50'}`}>
              
              <List size={20} />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingPlant(null);
              setIsFormOpen(true);
            }}
            className="bg-verdant-primary text-white p-3 rounded-xl shadow-md hover:bg-verdant-secondary transition-colors flex items-center gap-2">
            
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
                <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-verdant-urgent shadow-sm">
                      <AlertTriangle size={14} />
                    </div>
                }
                </div>
              </div>

              <div
              className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'min-w-0'}`}>
              
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-verdant-primary text-lg truncate pr-2">
                    {plant.name}
                  </h3>
                  {viewMode === 'grid' &&
                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}>
                  
                      <button className="text-verdant-secondary/50 hover:text-verdant-primary p-1">
                        <MoreVertical size={18} />
                      </button>
                      <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl py-1 hidden group-hover:block z-10 w-28 border border-verdant-bg">
                        <button
                      onClick={() => handleEdit(plant)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-verdant-bg flex items-center gap-2 text-verdant-primary">
                      
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                      onClick={() => handleDelete(plant.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-verdant-bg flex items-center gap-2 text-verdant-urgent">
                      
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                }
                </div>

                <p className="text-sm text-verdant-secondary italic mb-3 truncate">
                  {plant.species}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-verdant-bg text-verdant-primary">
                    {plant.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-verdant-light/20 text-verdant-primary">
                    {plant.growthStage}
                  </span>
                </div>

                {plant.pottingStatus === 'nursery' && viewMode === 'grid' &&
              <button
                onClick={(e) => openChecklist(e, plant.id)}
                className="w-full mt-2 bg-verdant-warning/20 text-verdant-primary text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-verdant-warning/30 transition-colors">
                
                    <AlertTriangle size={14} className="text-verdant-warning" />
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
                className="bg-verdant-warning/20 text-verdant-primary text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-verdant-warning/30 transition-colors whitespace-nowrap">
                
                      <AlertTriangle
                  size={14}
                  className="text-verdant-warning" />
                
                      Checklist
                    </button>
              }
                  <div
                className="flex items-center gap-2 ml-auto"
                onClick={(e) => e.stopPropagation()}>
                
                    <button
                  onClick={() => handleEdit(plant)}
                  className="p-2 text-verdant-secondary hover:text-verdant-primary hover:bg-verdant-bg rounded-lg transition-colors">
                  
                      <Edit2 size={18} />
                    </button>
                    <button
                  onClick={() => handleDelete(plant.id)}
                  className="p-2 text-verdant-secondary hover:text-verdant-urgent hover:bg-red-50 rounded-lg transition-colors">
                  
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
  const [formData, setFormData] = useState(
    plant || {
      name: '',
      species: '',
      category: 'Indoor',
      growthStage: 'Growing',
      fertilizerCycle: 30,
      pottingStatus: 'own',
      healthStatus: 'healthy',
      image:
      'https://images.unsplash.com/photo-1416879598556-3346f5b64524?auto=format&fit=crop&q=80&w=800',
      lastWatered: new Date().toISOString(),
      nextWatering: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastFertilized: new Date().toISOString(),
      pruningSeasons: ['Spring'],
      notes: ''
    }
  );
  return (
    <div className="fixed inset-0 bg-verdant-primary/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        className="bg-verdant-bg w-full max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-verdant-primary">
            {plant ? 'Edit Plant' : 'Add Plant'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-verdant-secondary hover:bg-black/5 rounded-full transition-colors">
            
            <MoreVertical size={24} className="rotate-90" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-verdant-secondary mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
              }
              className="w-full p-3.5 rounded-xl border border-verdant-secondary/20 focus:outline-none focus:border-verdant-light focus:ring-1 focus:ring-verdant-light" />
            
          </div>
          <div>
            <label className="block text-sm font-semibold text-verdant-secondary mb-1.5">
              Species
            </label>
            <input
              type="text"
              value={formData.species}
              onChange={(e) =>
              setFormData({
                ...formData,
                species: e.target.value
              })
              }
              className="w-full p-3.5 rounded-xl border border-verdant-secondary/20 focus:outline-none focus:border-verdant-light focus:ring-1 focus:ring-verdant-light" />
            
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-verdant-secondary mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value
                })
                }
                className="w-full p-3.5 rounded-xl border border-verdant-secondary/20 focus:outline-none focus:border-verdant-light focus:ring-1 focus:ring-verdant-light bg-white">
                
                <option>Indoor</option>
                <option>Semi-Shade</option>
                <option>Direct Sun</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-verdant-secondary mb-1.5">
                Potting
              </label>
              <select
                value={formData.pottingStatus}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  pottingStatus: e.target.value
                })
                }
                className="w-full p-3.5 rounded-xl border border-verdant-secondary/20 focus:outline-none focus:border-verdant-light focus:ring-1 focus:ring-verdant-light bg-white">
                
                <option value="own">Own Pot</option>
                <option value="nursery">Nursery Pot</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-verdant-primary py-4 rounded-xl font-bold border border-verdant-secondary/20 hover:bg-verdant-bg transition-colors">
              
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="flex-1 bg-verdant-primary text-white py-4 rounded-xl font-bold hover:bg-verdant-secondary transition-colors">
              
              {plant ? 'Save Changes' : 'Add to Collection'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>);

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
    <div className="fixed inset-0 bg-verdant-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
        
        <h2 className="text-2xl font-bold text-verdant-primary mb-2">
          Nursery Transition
        </h2>
        <p className="text-verdant-secondary mb-8">
          Complete these checks before repotting your new plant.
        </p>

        <div className="space-y-4 mb-8">
          {items.map((item) =>
          <div
            key={item.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-verdant-bg">
            
              <label className="flex items-center gap-4 cursor-pointer flex-1">
                <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checked[item.id] ? 'bg-verdant-primary border-verdant-primary' : 'border-verdant-secondary/30'}`}>
                
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
                className={`font-semibold ${checked[item.id] ? 'text-verdant-secondary line-through' : 'text-verdant-primary'}`}>
                
                  {item.label}
                </span>
              </label>
              <button
              onClick={() => goToGuide(item.guide)}
              className="text-sm text-verdant-light font-bold hover:text-verdant-primary px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
              
                Guide
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-verdant-secondary bg-verdant-bg hover:bg-verdant-secondary/10 transition-colors">
            
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition-colors ${allChecked ? 'bg-verdant-primary hover:bg-verdant-secondary' : 'bg-verdant-secondary/30 cursor-not-allowed'}`}>
            
            Complete
          </button>
        </div>
      </motion.div>
    </div>);

};