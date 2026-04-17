import React from 'react';
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
  // Derived data
  const growthStages = {
    Seedling: plants.filter((p) => p.growthStage === 'Seedling').length,
    Growing: plants.filter((p) => p.growthStage === 'Growing').length,
    Mature: plants.filter((p) => p.growthStage === 'Mature').length,
    Flowering: plants.filter((p) => p.growthStage === 'Flowering').length
  };
  const distributionData = [
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
  }].
  filter((d) => d.value > 0);
  const alerts = [
  ...plants.
  filter((p) => p.healthStatus === 'needs-water').
  map((p) => ({
    id: p.id,
    type: 'water',
    message: `${p.name} needs water`,
    urgency: 'high',
    icon: Droplets,
    color: 'text-verdant-urgent',
    bg: 'bg-verdant-urgent/10'
  })),
  ...plants.
  filter((p) => p.healthStatus === 'needs-pruning').
  map((p) => ({
    id: p.id,
    type: 'prune',
    message: `${p.name} needs pruning`,
    urgency: 'medium',
    icon: Scissors,
    color: 'text-verdant-warning',
    bg: 'bg-verdant-warning/10'
  })),
  ...plants.
  filter((p) => p.healthStatus === 'needs-fertilizer').
  map((p) => ({
    id: p.id,
    type: 'fertilizer',
    message: `${p.name} needs fertilizer`,
    urgency: 'medium',
    icon: FlaskConical,
    color: 'text-verdant-warning',
    bg: 'bg-verdant-warning/10'
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
        <h1 className="text-3xl font-bold text-verdant-primary mb-1">
          Command Center
        </h1>
        <p className="text-verdant-secondary">{today}</p>
      </header>

      {/* Total Garden Count */}
      <section>
        <h2 className="text-xl font-bold text-verdant-primary mb-4">
          Garden Status
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          {
            label: 'Seedlings',
            count: growthStages.Seedling,
            icon: Sprout,
            color: 'text-verdant-light'
          },
          {
            label: 'Growing',
            count: growthStages.Growing,
            icon: Leaf,
            color: 'text-verdant-secondary'
          },
          {
            label: 'Mature',
            count: growthStages.Mature,
            icon: TreeDeciduous,
            color: 'text-verdant-primary'
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
                  <div className={`p-3 rounded-xl bg-verdant-bg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-bold text-verdant-primary">
                    {stat.count}
                  </span>
                </div>
                <span className="text-sm font-semibold text-verdant-secondary">
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
            <h2 className="text-xl font-bold text-verdant-primary flex items-center gap-2">
              <AlertCircle size={20} className="text-verdant-urgent" />
              Urgent Care
            </h2>
            <span className="text-sm font-medium bg-verdant-urgent/10 text-verdant-urgent px-3 py-1 rounded-full">
              {alerts.length} tasks
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ?
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-verdant-secondary">
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
                    <div className="flex-1 font-semibold text-verdant-primary text-lg">
                      {alert.message}
                    </div>
                    <ChevronRight
                    size={24}
                    className="text-verdant-secondary/50" />
                  
                  </motion.button>);

            })
            }
          </div>
        </section>

        {/* Garden Distribution */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-bold text-verdant-primary mb-4">
            Environment
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm h-[calc(100%-2.5rem)] flex flex-col">
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value">
                    
                    {distributionData.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {distributionData.map((d) =>
              <div
                key={d.name}
                className="flex items-center gap-2 text-sm font-medium text-verdant-secondary">
                
                  <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: d.color
                  }} />
                
                  {d.name} ({d.value})
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>);

};