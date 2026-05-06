import React, { useEffect, useMemo, useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Droplets,
  Scissors,
  FlaskConical,
  AlertCircle,
  ChevronRight,
  Sprout,
  Flower2,
  TreeDeciduous,
  Leaf } from
'lucide-react';
import { motion } from 'framer-motion';
export const Dashboard: React.FC = () => {
  const { plants, setActiveTab, setSelectedPlantId } = usePlants();
  const [environmentView, setEnvironmentView] = useState<'chart' | 'bars'>(() => {
    if (typeof window === 'undefined') return 'chart';
    const saved = window.localStorage.getItem('sproutly:dashboard:environmentView');
    return saved === 'bars' ? 'bars' : 'chart';
  });
  useEffect(() => {
    window.localStorage.setItem('sproutly:dashboard:environmentView', environmentView);
  }, [environmentView]);
  // Derived data
  const growthStages = {
    Seedling: plants.filter((p) => p.growthStage === 'Seedling').length,
    Growing: plants.filter((p) => p.growthStage === 'Growing').length,
    Mature: plants.filter((p) => p.growthStage === 'Mature').length,
    Flowering: plants.filter((p) => p.growthStage === 'Flowering').length
  };
  const environmentBreakdown = useMemo(() => {
    const total = plants.length;
    const categories = [
      {
        name: 'Indoor',
        value: plants.filter((p) => p.category === 'Indoor').length,
        color: '#1B4332'
      },
      {
        name: 'Semi-Shade',
        value: plants.filter((p) => p.category === 'Semi-Shade').length,
        color: '#52796F'
      },
      {
        name: 'Direct Sun',
        value: plants.filter((p) => p.category === 'Direct Sun').length,
        color: '#74C69D'
      }
    ].map((c) => ({
      ...c,
      percent: total === 0 ? 0 : Math.round(c.value / total * 100)
    }));
    const dominant = total === 0 ? null : categories.reduce((best, c) => c.value > best.value ? c : best, categories[0]);
    return {
      total,
      categories,
      chartData: categories.filter((c) => c.value > 0),
      dominant
    };
  }, [plants]);
  const alerts = [
  ...plants.
  filter((p) => p.healthStatus === 'needs-water').
  map((p) => ({
    id: p.id,
    type: 'water',
    message: `${p.name} needs water`,
    urgency: 'high',
    icon: Droplets,
    color: 'text-sproutly-urgent',
    bg: 'bg-sproutly-urgent/10'
  })),
  ...plants.
  filter((p) => p.healthStatus === 'needs-pruning').
  map((p) => ({
    id: p.id,
    type: 'prune',
    message: `${p.name} needs pruning`,
    urgency: 'medium',
    icon: Scissors,
    color: 'text-sproutly-warning',
    bg: 'bg-sproutly-warning/10'
  })),
  ...plants.
  filter((p) => p.healthStatus === 'needs-fertilizer').
  map((p) => ({
    id: p.id,
    type: 'fertilizer',
    message: `${p.name} needs fertilizer`,
    urgency: 'medium',
    icon: FlaskConical,
    color: 'text-sproutly-warning',
    bg: 'bg-sproutly-warning/10'
  }))];

  const handleAlertClick = (plantId: string) => {
    setSelectedPlantId(plantId);
    setActiveTab('care');
  };
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-sproutly-primary mb-1">
          Command Center
        </h1>
        <p className="text-sproutly-secondary">{today}</p>
      </header>

      {/* Total Garden Count */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-4">
          Garden Status
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          {
            label: 'Seedlings',
            count: growthStages.Seedling,
            icon: Sprout,
            color: 'text-sproutly-light'
          },
          {
            label: 'Growing',
            count: growthStages.Growing,
            icon: Leaf,
            color: 'text-sproutly-secondary'
          },
          {
            label: 'Mature',
            count: growthStages.Mature,
            icon: TreeDeciduous,
            color: 'text-sproutly-primary'
          },
          {
            label: 'Flowering',
            count: growthStages.Flowering,
            icon: Flower2,
            color: 'text-pink-500'
          }].
          map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white p-5 rounded-2xl shadow-sm flex flex-col">
                
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-3 rounded-xl bg-sproutly-bg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-bold text-sproutly-primary">
                    {stat.count}
                  </span>
                </div>
                <span className="text-sm font-semibold text-sproutly-secondary">
                  {stat.label}
                </span>
              </div>);

          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Care Stream */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-sproutly-primary flex items-center gap-2">
              <AlertCircle size={20} className="text-sproutly-urgent" />
              Urgent Care
            </h2>
            <span className="text-sm font-medium bg-sproutly-urgent/10 text-sproutly-urgent px-3 py-1 rounded-full">
              {alerts.length} tasks
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ?
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-sproutly-secondary">
                All plants are happy and healthy! 🌱
              </div> :

            alerts.map((alert, idx) => {
              const Icon = alert.icon;
              return (
                <motion.button
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: idx * 0.1
                  }}
                  key={`${alert.id}-${alert.type}`}
                  onClick={() => handleAlertClick(alert.id)}
                  className="w-full bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow text-left">
                  
                    <div
                    className={`p-3 rounded-xl ${alert.bg} ${alert.color}`}>
                    
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 font-semibold text-sproutly-primary text-lg">
                      {alert.message}
                    </div>
                    <ChevronRight
                    size={24}
                    className="text-sproutly-secondary/50" />
                  
                  </motion.button>);

            })
            }
          </div>
        </section>

        {/* Garden Distribution */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-bold text-sproutly-primary mb-4">
            Environment
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[360px] flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-sproutly-secondary">
                  Total plants
                </div>
                <div className="text-2xl font-bold text-sproutly-primary leading-tight">
                  {environmentBreakdown.total}
                </div>
              </div>
              <div className="flex items-center bg-sproutly-bg rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setEnvironmentView('chart')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${environmentView === 'chart' ? 'bg-white text-sproutly-primary shadow-sm' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}>
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironmentView('bars')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${environmentView === 'bars' ? 'bg-white text-sproutly-primary shadow-sm' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}>
                  Bars
                </button>
              </div>
            </div>

            {environmentBreakdown.total === 0 ?
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-sproutly-bg text-sproutly-secondary flex items-center justify-center mb-4">
                  <Leaf size={28} />
                </div>
                <div className="text-lg font-bold text-sproutly-primary">
                  No plants yet
                </div>
                <div className="text-sm font-medium text-sproutly-secondary mt-1 max-w-xs">
                  Add a plant to see your environment breakdown (Indoor, Semi-Shade, Direct Sun).
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('collection')}
                  className="mt-5 bg-sproutly-primary text-white px-4 py-3 rounded-xl shadow-md hover:bg-sproutly-secondary transition-colors font-bold">
                  Go to My Collection
                </button>
              </div> :
            <>
                {environmentView === 'chart' ?
                <div className="relative mt-6 flex-1 min-h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={environmentBreakdown.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={environmentBreakdown.chartData.length > 1 ? 4 : 0}
                          stroke="#ffffff"
                          strokeWidth={4}
                          dataKey="value">
                          
                          {environmentBreakdown.chartData.map((entry, index) =>
                          <Cell key={`cell-${index}`} fill={entry.color} />
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value} plants`, name]}
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {environmentBreakdown.dominant ?
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-3xl font-bold text-sproutly-primary leading-none">
                          {environmentBreakdown.dominant.percent}%
                        </div>
                        <div className="text-sm font-bold text-sproutly-secondary mt-1">
                          {environmentBreakdown.dominant.name}
                        </div>
                      </div> :
                    null}
                  </div> :
                <div className="mt-6">
                    <div className="h-4 rounded-full bg-sproutly-bg overflow-hidden flex">
                      {environmentBreakdown.categories.map((c) =>
                      c.value === 0 ? null : (
                        <div
                          key={c.name}
                          className="h-full"
                          style={{
                            width: `${c.percent}%`,
                            backgroundColor: c.color
                          }} />
                      ))}
                    </div>
                  </div>}

                <div className="mt-6 space-y-4">
                  {environmentBreakdown.categories.map((c) =>
                  <div key={c.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: c.color
                        }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-sproutly-primary">
                            {c.name}
                          </span>
                          <span className="text-sm font-semibold text-sproutly-secondary">
                            {c.value} • {c.percent}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-sproutly-bg overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.percent}%`,
                              backgroundColor: c.color
                            }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            }
          </div>
        </section>
      </div>
    </div>);

};
