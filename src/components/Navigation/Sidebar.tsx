import React from 'react';
import {
  LayoutDashboard,
  Leaf,
  Droplets,
  BookOpen,
  Sparkles,
  Settings,
  User } from
'lucide-react';
import { usePlants } from '../../context/PlantContext';
import { motion } from 'framer-motion';
export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, plants } = usePlants();
  const menuItems = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Command Center'
  },
  {
    id: 'collection',
    icon: Leaf,
    label: 'My Collection',
    badge: plants.length
  },
  {
    id: 'care',
    icon: Droplets,
    label: 'Care Cycle'
  },
  {
    id: 'knowledge',
    icon: BookOpen,
    label: 'Knowledge Hub'
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'Verdant AI'
  }];

  return (
    <div className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-verdant-secondary/10 z-40">
      <div className="p-6 flex items-center gap-2 text-verdant-primary mb-6">
        <Leaf className="fill-verdant-primary" size={28} />
        <span className="text-2xl font-bold tracking-tight">Verdant</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all relative group ${isActive ? 'text-white' : 'text-verdant-primary hover:bg-verdant-light/10'}`}>
              
              {isActive &&
              <motion.div
                layoutId="sidebarIndicator"
                className="absolute inset-0 bg-verdant-primary rounded-xl -z-10"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6
                }} />

              }
              <div className="flex items-center gap-3 relative z-10">
                <Icon
                  size={20}
                  className={
                  isActive ?
                  'text-white' :
                  'text-verdant-secondary group-hover:text-verdant-primary'
                  } />
                
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined &&
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full relative z-10 ${isActive ? 'bg-white/20 text-white' : 'bg-verdant-bg text-verdant-primary'}`}>
                
                  {item.badge}
                </span>
              }
            </button>);

        })}
      </nav>

      <div className="p-4 border-t border-verdant-secondary/10 space-y-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-verdant-primary text-white shadow-md' : 'text-verdant-secondary hover:text-verdant-primary hover:bg-verdant-light/10'}`}>
          <Settings size={20} />
          <span className="font-semibold text-sm">Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-verdant-secondary hover:text-verdant-primary hover:bg-verdant-light/10 transition-all">
          <User size={20} />
          <span className="font-semibold text-sm">Profile</span>
        </button>
      </div>
    </div>);

};
