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
    label: 'Sproutly AI'
  }];

  return (
    <div className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-sproutly-secondary/10 z-40">
      <div className="p-6 flex items-center gap-2 text-sproutly-primary mb-6">
        <Leaf className="fill-sproutly-primary" size={28} />
        <span className="text-2xl font-bold tracking-tight">Sproutly</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all relative group ${isActive ? 'text-white' : 'text-sproutly-primary hover:bg-sproutly-light/10'}`}>
              
              {isActive &&
              <motion.div
                layoutId="sidebarIndicator"
                className="absolute inset-0 bg-sproutly-primary rounded-xl -z-10"
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
                  'text-sproutly-secondary group-hover:text-sproutly-primary'
                  } />
                
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined &&
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full relative z-10 ${isActive ? 'bg-white/20 text-white' : 'bg-sproutly-bg text-sproutly-primary'}`}>
                
                  {item.badge}
                </span>
              }
            </button>);

        })}
      </nav>

      <div className="p-4 border-t border-sproutly-secondary/10 space-y-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-sproutly-primary text-white shadow-md' : 'text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-light/10'}`}>
          <Settings size={20} />
          <span className="font-semibold text-sm">Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-light/10 transition-all">
          <User size={20} />
          <span className="font-semibold text-sm">Profile</span>
        </button>
      </div>
    </div>);

};
