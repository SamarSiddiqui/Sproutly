import React, { useEffect } from 'react';
import { usePlants } from '../context/PlantContext';
import {
  Droplets,
  FlaskConical,
  Scissors,
  Sparkles,
  Calendar as CalendarIcon,
  Info } from
'lucide-react';
import { motion } from 'framer-motion';
export const CareCycle: React.FC = () => {
  const {
    plants,
    selectedPlantId,
    setSelectedPlantId,
    setActiveTab,
    setAiContext
  } = usePlants();
  // Auto-select first plant if none selected
  useEffect(() => {
    if (!selectedPlantId && plants.length > 0) {
      setSelectedPlantId(plants[0].id);
    }
  }, [plants, selectedPlantId, setSelectedPlantId]);
  const plant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  if (!plant)
  return <div className="p-8 text-center">No plants in collection.</div>;
  const askAI = (topic: string) => {
    setAiContext(
      `How do I handle ${topic} for my ${plant.name} (${plant.species})?`
    );
    setActiveTab('ai');
  };
  // Calculate watering progress
  const lastW = new Date(plant.lastWatered).getTime();
  const nextW = new Date(plant.nextWatering).getTime();
  const now = Date.now();
  const totalDuration = nextW - lastW;
  const elapsed = now - lastW;
  const waterProgress = Math.max(
    0,
    Math.min(100, elapsed / totalDuration * 100)
  );
  const daysUntilWater = Math.ceil((nextW - now) / (1000 * 60 * 60 * 24));
  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8">
      {/* Left Panel: Plant Selector */}
      <div className="lg:w-80 shrink-0 flex flex-col">
        <header className="mb-4 lg:mb-6">
          <h1 className="text-3xl font-bold text-verdant-primary">
            Care Cycle
          </h1>
        </header>

        {/* Mobile Horizontal Selector */}
        <div className="lg:hidden flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
          {plants.map((p) =>
          <button
            key={p.id}
            onClick={() => setSelectedPlantId(p.id)}
            className={`snap-start shrink-0 flex items-center gap-3 p-2 pr-4 rounded-full transition-all ${selectedPlantId === p.id ? 'bg-verdant-primary text-white shadow-md' : 'bg-white text-verdant-primary border border-verdant-secondary/20'}`}>
            
              <img
              src={p.image}
              alt={p.name}
              className="w-10 h-10 rounded-full object-cover" />
            
              <div className="text-left">
                <div className="text-sm font-bold whitespace-nowrap">
                  {p.name}
                </div>
                <div
                className={`text-[10px] ${selectedPlantId === p.id ? 'text-white/80' : 'text-verdant-secondary'}`}>
                
                  {p.category}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Desktop Vertical Selector */}
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
          {plants.map((p) =>
          <button
            key={p.id}
            onClick={() => setSelectedPlantId(p.id)}
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all text-left ${selectedPlantId === p.id ? 'bg-verdant-primary text-white shadow-md' : 'bg-white text-verdant-primary hover:bg-verdant-light/10'}`}>
            
              <img
              src={p.image}
              alt={p.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0" />
            
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{p.name}</div>
                <div
                className={`text-xs truncate ${selectedPlantId === p.id ? 'text-white/80' : 'text-verdant-secondary'}`}>
                
                  {p.species}
                </div>
              </div>
              {p.healthStatus !== 'healthy' &&
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.healthStatus === 'needs-water' ? 'bg-blue-400' : p.healthStatus === 'needs-pruning' ? 'bg-verdant-warning' : 'bg-verdant-urgent'}`} />

            }
            </button>
          )}
        </div>
      </div>

      {/* Right Panel: Care Details */}
      <div className="flex-1 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 lg:pb-8">
        {/* Desktop Header for selected plant */}
        <div className="hidden lg:flex items-center gap-6 bg-white p-6 rounded-3xl shadow-sm">
          <img
            src={plant.image}
            alt={plant.name}
            className="w-24 h-24 rounded-2xl object-cover" />
          
          <div>
            <h2 className="text-2xl font-bold text-verdant-primary">
              {plant.name}
            </h2>
            <p className="text-verdant-secondary mb-2">{plant.species}</p>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-verdant-bg text-verdant-primary">
                {plant.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-verdant-light/20 text-verdant-primary">
                {plant.growthStage}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Watering Section */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl">
                    <Droplets size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-verdant-primary">
                      Watering
                    </h2>
                    <p className="text-sm font-medium text-verdant-secondary">
                      {daysUntilWater > 0 ?
                      `In ${daysUntilWater} days` :
                      daysUntilWater === 0 ?
                      'Today' :
                      'Overdue'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => askAI('watering')}
                  className="p-2.5 text-verdant-light hover:text-verdant-primary bg-verdant-bg rounded-xl transition-colors"
                  title="Ask AI about watering">
                  
                  <Sparkles size={20} />
                </button>
              </div>

              <div className="mb-8">
                <div className="h-4 bg-verdant-bg rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${waterProgress}%`
                    }}
                    className={`h-full rounded-full ${waterProgress > 90 ? 'bg-verdant-urgent' : 'bg-blue-400'}`} />
                  
                </div>
                <div className="flex justify-between text-sm text-verdant-secondary font-semibold">
                  <span>
                    Last:{' '}
                    {new Date(plant.lastWatered).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    Next:{' '}
                    {new Date(plant.nextWatering).toLocaleDateString(
                      undefined,
                      {
                        month: 'short',
                        day: 'numeric'
                      }
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-verdant-bg p-5 rounded-2xl flex gap-3 items-start mt-auto">
                <Info
                  size={20}
                  className="text-verdant-secondary shrink-0 mt-0.5" />
                
                <p className="text-sm text-verdant-primary font-medium leading-relaxed">
                  {plant.category === 'Indoor' ?
                  'Check top 2 inches of soil before watering.' :
                  'Water deeply until it drains from the bottom.'}
                </p>
              </div>
            </div>
          </section>

          {/* Fertilizer Section */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-verdant-warning/20 text-verdant-warning rounded-2xl">
                  <FlaskConical size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-verdant-primary">
                    Nutrition
                  </h2>
                  <p className="text-sm font-medium text-verdant-secondary">
                    Every {plant.fertilizerCycle} days
                  </p>
                </div>
              </div>
              <button
                onClick={() => askAI('fertilizing')}
                className="p-2.5 text-verdant-light hover:text-verdant-primary bg-verdant-bg rounded-xl transition-colors"
                title="Ask AI about fertilizing">
                
                <Sparkles size={20} />
              </button>
            </div>

            {/* Static Calendar Representation */}
            <div className="border border-verdant-secondary/20 rounded-2xl p-5 mt-auto">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-verdant-primary">
                  This Month
                </span>
                <CalendarIcon size={18} className="text-verdant-secondary" />
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs mb-3 text-verdant-secondary font-bold">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) =>
                <div key={i}>{d}</div>
                )}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({
                  length: 14
                }).map((_, i) => {
                  const isFeedDay = i === 5; // Static demo logic
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm font-bold ${isFeedDay ? 'bg-verdant-warning text-white shadow-md' : 'text-verdant-primary hover:bg-verdant-bg'}`}>
                      
                      {i + 1}
                    </div>);

                })}
              </div>
              <div className="mt-5 text-sm font-medium text-verdant-secondary flex items-center gap-3 bg-verdant-bg p-3 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-verdant-warning shrink-0" />
                Feed with balanced liquid fertilizer
              </div>
            </div>
          </section>
        </div>

        {/* Pruning Section */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-verdant-light/20 text-verdant-primary rounded-2xl">
                <Scissors size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-verdant-primary">
                  Pruning
                </h2>
                <p className="text-sm font-medium text-verdant-secondary">
                  {plant.pruningSeasons.join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => askAI('pruning')}
              className="p-2.5 text-verdant-light hover:text-verdant-primary bg-verdant-bg rounded-xl transition-colors"
              title="Ask AI about pruning">
              
              <Sparkles size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
            'Remove dead or yellowing leaves at the base.',
            'Trim leggy stems just above a leaf node.',
            'Use sterilized shears to prevent infection.'].
            map((instruction, idx) =>
            <div
              key={idx}
              className="flex gap-4 items-start bg-verdant-bg p-5 rounded-2xl">
              
                <div className="w-8 h-8 rounded-full bg-white text-verdant-primary flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-verdant-primary leading-relaxed">
                  {instruction}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>);

};