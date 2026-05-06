import React from 'react';
import { usePlants } from '../context/PlantContext';
import {
  BookOpen,
  Lightbulb,
  Sprout,
  ArrowRight,
  Bug,
  Droplets } from
'lucide-react';
export const KnowledgeHub: React.FC = () => {
  const { plants, setSelectedPlantId, setActiveTab } = usePlants();
  const quickTips = [
  {
    id: 'soil-health',
    icon: Sprout,
    title: 'Aerating Soil',
    content:
    'Gently poke holes in the topsoil with a chopstick before watering to improve oxygen flow to roots.',
    relatedCategories: ['Indoor', 'Semi-Shade']
  },
  {
    id: 'pest-control',
    icon: Bug,
    title: 'Neem Oil Spray',
    content:
    'Mix 1tsp neem oil with 1L water and a drop of dish soap. Spray every 14 days to prevent mealybugs.',
    relatedCategories: ['Direct Sun']
  },
  {
    id: 'drainage',
    icon: Droplets,
    title: 'The Pebble Myth',
    content:
    'Adding pebbles to the bottom of a pot actually raises the water table. Use a well-draining soil mix instead.',
    relatedCategories: ['Indoor', 'Direct Sun', 'Semi-Shade']
  }];

  const propagationGuides = [
  {
    title: 'Water Propagation',
    plant: 'Money Plant',
    steps: [
    'Cut below a node',
    'Place in clean water',
    'Change water weekly',
    'Pot when roots are 2" long'],

    image:
    'https://images.unsplash.com/photo-1610448102431-729457618037?auto=format&fit=crop&q=80&w=400'
  },
  {
    title: 'Soil Propagation',
    plant: 'Jade Plant',
    steps: [
    'Twist off a healthy leaf',
    'Let callous for 3 days',
    'Lay flat on moist soil',
    'Mist occasionally'],

    image:
    'https://images.unsplash.com/photo-1603436326446-74e2d65f3168?auto=format&fit=crop&q=80&w=400'
  }];

  const getRelatedPlants = (categories: string[]) => {
    return plants.filter((p) => categories.includes(p.category)).slice(0, 3);
  };
  const goToPlant = (id: string) => {
    setSelectedPlantId(id);
    setActiveTab('collection');
  };
  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-sproutly-primary mb-2">
          Knowledge Hub
        </h1>
        <p className="text-lg text-sproutly-secondary">
          Master the art of terrace gardening
        </p>
      </header>

      {/* Quick Tips */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-6 flex items-center gap-2">
          <Lightbulb size={24} className="text-sproutly-warning" />
          Quick Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickTips.map((tip) => {
            const Icon = tip.icon;
            const related = getRelatedPlants(tip.relatedCategories);
            return (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-sproutly-bg flex flex-col h-full">
                
                <div className="flex gap-4 mb-4">
                  <div className="p-3 bg-sproutly-bg rounded-2xl h-fit text-sproutly-primary shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sproutly-primary mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-sproutly-secondary leading-relaxed font-medium">
                      {tip.content}
                    </p>
                  </div>
                </div>

                {related.length > 0 &&
                <div className="mt-auto pt-5 border-t border-sproutly-bg">
                    <span className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider mb-3 block">
                      Applies to your plants:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {related.map((p) =>
                    <button
                      key={p.id}
                      onClick={() => goToPlant(p.id)}
                      className="flex items-center gap-2 bg-sproutly-bg px-3 py-1.5 rounded-xl text-xs font-bold text-sproutly-primary hover:bg-sproutly-light/20 transition-colors">
                      
                          <img
                        src={p.image}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover" />
                      
                          {p.name}
                        </button>
                    )}
                    </div>
                  </div>
                }
              </div>);

          })}
        </div>
      </section>

      {/* Cutting & Growth Lab */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-sproutly-light" />
          Cutting & Growth Lab
        </h2>

        {/* Mobile horizontal scroll, Desktop grid */}
        <div className="flex lg:grid lg:grid-cols-2 overflow-x-auto lg:overflow-visible gap-6 pb-4 lg:pb-0 snap-x hide-scrollbar">
          {propagationGuides.map((guide, idx) =>
          <div
            key={idx}
            className="snap-start shrink-0 w-80 lg:w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-sproutly-bg flex flex-col">
            
              <div className="h-48 relative">
                <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-sm font-semibold opacity-90 mb-1">
                    {guide.plant}
                  </div>
                  <h3 className="font-bold text-2xl">{guide.title}</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-4 mb-6">
                  {guide.steps.map((step, sIdx) =>
                <li
                  key={sIdx}
                  className="flex items-start gap-4 text-sm font-medium text-sproutly-primary">
                  
                      <div className="w-6 h-6 rounded-full bg-sproutly-bg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      {step}
                    </li>
                )}
                </ul>
                <button className="w-full mt-auto py-3.5 bg-sproutly-bg text-sproutly-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-sproutly-light/20 transition-colors">
                  Read Full Guide <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>);

};
