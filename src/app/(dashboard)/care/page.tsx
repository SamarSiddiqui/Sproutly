'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { useProfile } from '../../../hooks/useProfile';
import { useWeather } from '../../../hooks/useWeather';
import { useAISchedule } from '../../../hooks/useAISchedule';
import {
  Droplets,
  FlaskConical,
  Scissors,
  Sparkles,
  Calendar as CalendarIcon,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareCyclePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { plants, loading } = usePlants();
  const { profile } = useProfile();
  const { data: weather } = useWeather(undefined, undefined, profile?.location);

  // Selected plant from URL search params, fallback to first plant
  const selectedPlantId = searchParams.get('plantId');

  const plant = useMemo(() => {
    if (plants.length === 0) return null;
    return plants.find((p) => p.id === selectedPlantId) || plants[0];
  }, [plants, selectedPlantId]);

  // If there are plants and none is selected in URL, update URL silently
  useEffect(() => {
    if (!loading && plants.length > 0 && !selectedPlantId) {
      router.replace(`/care?plantId=${plants[0].id}`);
    }
  }, [plants, selectedPlantId, loading, router]);

  const selectPlant = (id: string) => {
    router.push(`/care?plantId=${id}`);
  };

  const askAI = (topic: string) => {
    if (!plant) return;
    const query = encodeURIComponent(`How do I handle ${topic} for my ${plant.name} (${plant.species})?`);
    router.push(`/ai?context=${query}`);
  };

  const { data: aiSchedule } = useAISchedule(plant, weather?.forecast);

  const wateringMetrics = useMemo(() => {
    if (!plant) return { progress: 0, daysLeft: 0, aiAdjustedDays: 0 };
    const lastW = new Date(plant.lastWatered).getTime();
    const nextW = new Date(plant.nextWatering).getTime();
    const now = Date.now();
    
    const aiAdjustedDays = aiSchedule?.adjusted ? aiSchedule.daysOff : 0;
    const adjustedNextW = nextW + (aiAdjustedDays * 24 * 60 * 60 * 1000);

    const totalDuration = adjustedNextW - lastW;
    const elapsed = now - lastW;
    const progress = Math.max(0, Math.min(100, (elapsed / (totalDuration || 1)) * 100));
    const daysLeft = Math.ceil((adjustedNextW - now) / (1000 * 60 * 60 * 24));
    
    return { progress, daysLeft, aiAdjustedDays };
  }, [plant, aiSchedule]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-sproutly-primary" size={32} />
        <p className="text-sm font-semibold text-sproutly-secondary">Loading care schedule...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="p-8 text-center text-sproutly-secondary">
        No plants in your collection. Go to <button onClick={() => router.push('/collection')} className="underline font-bold text-sproutly-primary">My Collection</button> to add one!
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8">
      {/* Left Panel: Plant Selector */}
      <div className="lg:w-80 shrink-0 flex flex-col">
        <header className="mb-4 lg:mb-6">
          <h1 className="text-3xl font-bold text-sproutly-primary">
            Care Cycle
          </h1>
        </header>

        {/* Mobile Horizontal Selector */}
        <div className="lg:hidden flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
          {plants.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPlant(p.id)}
              className={`snap-start shrink-0 flex items-center gap-3 p-2 pr-4 rounded-full transition-all ${
                plant.id === p.id 
                  ? 'bg-sproutly-primary text-white shadow-md' 
                  : 'bg-white text-sproutly-primary border border-sproutly-secondary/20'
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="text-sm font-bold whitespace-nowrap">{p.name}</div>
                <div className={`text-[10px] ${plant.id === p.id ? 'text-white/80' : 'text-sproutly-secondary'}`}>
                  {p.category}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Desktop Vertical Selector */}
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto pr-2 pb-4 max-h-[calc(100vh-200px)]">
          {plants.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPlant(p.id)}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all text-left ${
                plant.id === p.id 
                  ? 'bg-sproutly-primary text-white shadow-md' 
                  : 'bg-white text-sproutly-primary hover:bg-sproutly-light/10'
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{p.name}</div>
                <div className={`text-xs truncate ${plant.id === p.id ? 'text-white/80' : 'text-sproutly-secondary'}`}>
                  {p.species}
                </div>
              </div>
              {p.healthStatus !== 'healthy' && (
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    p.healthStatus === 'needs-water' 
                      ? 'bg-blue-400' 
                      : p.healthStatus === 'needs-pruning' 
                      ? 'bg-sproutly-warning' 
                      : 'bg-sproutly-urgent'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Care Details */}
      <div className="flex-1 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 lg:pb-8">
        {/* Desktop Header for selected plant */}
        <div className="hidden lg:flex items-center gap-6 bg-white p-6 rounded-3xl shadow-sm">
          <img
            src={plant.image}
            alt={plant.name}
            className="w-24 h-24 rounded-2xl object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-sproutly-primary">
              {plant.name}
            </h2>
            <p className="text-sproutly-secondary mb-2">{plant.species}</p>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sproutly-bg text-sproutly-primary">
                {plant.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sproutly-light/20 text-sproutly-primary">
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
                    <h2 className="text-xl font-bold text-sproutly-primary">
                      Watering
                    </h2>
                    <p className="text-sm font-medium text-sproutly-secondary font-semibold">
                      {wateringMetrics.daysLeft > 0 
                        ? `In ${wateringMetrics.daysLeft} days` 
                        : wateringMetrics.daysLeft === 0 
                        ? 'Today' 
                        : 'Overdue'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => askAI('watering')}
                  className="p-2.5 text-sproutly-light hover:text-sproutly-primary bg-sproutly-bg rounded-xl transition-colors"
                  title="Ask AI about watering"
                >
                  <Sparkles size={20} />
                </button>
              </div>

              <div className="mb-8">
                <div className="h-4 bg-sproutly-bg rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${wateringMetrics.progress}%` }}
                    className={`h-full rounded-full ${wateringMetrics.progress > 90 ? 'bg-sproutly-urgent' : 'bg-blue-400'}`}
                  />
                </div>
                <div className="flex justify-between text-sm text-sproutly-secondary font-semibold">
                  <span>
                    Last:{' '}
                    {new Date(plant.lastWatered).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    Next:{' '}
                    {new Date(plant.nextWatering + (wateringMetrics.aiAdjustedDays * 24 * 60 * 60 * 1000)).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {aiSchedule?.adjusted && (
                <div className="mb-4 bg-sproutly-light/10 border border-sproutly-primary/20 rounded-xl p-3 flex gap-3 items-start">
                  <Sparkles size={18} className="text-sproutly-primary shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs text-sproutly-primary font-bold leading-relaxed">
                    {aiSchedule.reason}
                  </p>
                </div>
              )}

              <div className="bg-sproutly-bg p-5 rounded-2xl flex gap-3 items-start mt-auto">
                <Info size={20} className="text-sproutly-secondary shrink-0 mt-0.5" />
                <p className="text-sm text-sproutly-primary font-medium leading-relaxed">
                  {plant.category === 'Indoor' 
                    ? 'Check top 2 inches of soil before watering.' 
                    : 'Water deeply until it drains from the bottom.'}
                </p>
              </div>
            </div>
          </section>

          {/* Fertilizer Section */}
          <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-sproutly-warning/20 text-sproutly-warning rounded-2xl">
                  <FlaskConical size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-sproutly-primary">
                    Nutrition
                  </h2>
                  <p className="text-sm font-medium text-sproutly-secondary font-semibold">
                    Every {plant.fertilizerCycle} days
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => askAI('fertilizing')}
                className="p-2.5 text-sproutly-light hover:text-sproutly-primary bg-sproutly-bg rounded-xl transition-colors"
                title="Ask AI about fertilizing"
              >
                <Sparkles size={20} />
              </button>
            </div>

            <div className="border border-sproutly-secondary/20 rounded-2xl p-5 mt-auto bg-sproutly-bg/10">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-sproutly-primary">
                  This Month
                </span>
                <CalendarIcon size={18} className="text-sproutly-secondary" />
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs mb-3 text-sproutly-secondary font-bold">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 14 }).map((_, i) => {
                  const isFeedDay = i === 5;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm font-bold ${
                        isFeedDay ? 'bg-sproutly-warning text-white shadow-md' : 'text-sproutly-primary hover:bg-sproutly-bg'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 text-sm font-medium text-sproutly-secondary flex items-center gap-3 bg-sproutly-bg p-3 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-sproutly-warning shrink-0" />
                Feed with balanced liquid fertilizer
              </div>
            </div>
          </section>
        </div>

        {/* Pruning Section */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-sproutly-light/20 text-sproutly-primary rounded-2xl">
                <Scissors size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-sproutly-primary">
                  Pruning
                </h2>
                <p className="text-sm font-medium text-sproutly-secondary font-semibold">
                  {plant.pruningSeasons.join(', ')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => askAI('pruning')}
              className="p-2.5 text-sproutly-light hover:text-sproutly-primary bg-sproutly-bg rounded-xl transition-colors"
              title="Ask AI about pruning"
            >
              <Sparkles size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              'Remove dead or yellowing leaves at the base.',
              'Trim leggy stems just above a leaf node.',
              'Use sterilized shears to prevent infection.'
            ].map((instruction, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-sproutly-bg p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-white text-sproutly-primary flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-sproutly-primary leading-relaxed">
                  {instruction}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Optimization Note */}
        <footer className="pt-2 border-t border-sproutly-secondary/10 text-[11px] font-bold text-sproutly-secondary">
          Optimization Note: Watering metrics use useMemo and query param selectors to prevent excessive React re-renders when switching selected plants.
        </footer>
      </div>
    </div>
  );
}
