import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  Leaf,
  Droplets,
  BookOpen,
  Sparkles,
  Settings,
  User,
  LogOut } from
'lucide-react';
import { usePlants } from '../../context/PlantContext';
interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onLogout
}) => {
  const { activeTab, setActiveTab } = usePlants();
  const menuItems = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Command Center',
    desc: 'Overview & Alerts'
  },
  {
    id: 'collection',
    icon: Leaf,
    label: 'My Collection',
    desc: 'Manage your plants'
  },
  {
    id: 'care',
    icon: Droplets,
    label: 'Care Cycle',
    desc: 'Watering & Pruning'
  },
  {
    id: 'knowledge',
    icon: BookOpen,
    label: 'Knowledge Hub',
    desc: 'Guides & Tips'
  },
  {
    id: 'ai',
    icon: Sparkles,
    label: 'Sproutly AI',
    desc: 'Garden Assistant'
  }];

  const handleNav = (id: string) => {
    setActiveTab(id);
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-sproutly-primary/40 backdrop-blur-sm z-50" />
        
          <motion.div
          initial={{
            x: '-100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200
          }}
          className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-sproutly-bg z-50 shadow-2xl flex flex-col">
          
            <div className="p-6 flex justify-between items-center border-b border-sproutly-secondary/20">
              <div className="flex items-center gap-2 text-sproutly-primary">
                <Leaf className="fill-sproutly-primary" />
                <span className="text-xl font-bold tracking-tight">
                  Sproutly
                </span>
              </div>
              <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-sproutly-secondary/10 text-sproutly-primary">
              
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-sproutly-primary text-white shadow-md' : 'hover:bg-sproutly-light/10 text-sproutly-primary'}`}>
                  
                    <div
                    className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-sproutly-light/20'}`}>
                    
                      <Icon size={24} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{item.label}</div>
                      <div
                      className={`text-sm ${isActive ? 'text-white/80' : 'text-sproutly-secondary'}`}>
                      
                        {item.desc}
                      </div>
                    </div>
                  </button>);

            })}
            </div>

            <div className="p-6 border-t border-sproutly-secondary/20 space-y-4">
              <button
                onClick={() => handleNav('settings')}
                className={`flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'text-sproutly-primary' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}>
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>
              <button
                onClick={() => handleNav('settings')}
                className="flex items-center gap-3 text-sproutly-secondary hover:text-sproutly-primary transition-colors">
                <User size={20} />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-3 text-sproutly-urgent hover:text-sproutly-urgent/80 transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

};
