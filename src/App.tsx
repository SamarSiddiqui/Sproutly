import React, { useState } from 'react';
import { PlantProvider, usePlants } from './context/PlantContext';
import { BottomNav } from './components/Navigation/BottomNav';
import { HamburgerMenu } from './components/Navigation/HamburgerMenu';
import { Sidebar } from './components/Navigation/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Collection } from './pages/Collection';
import { CareCycle } from './pages/CareCycle';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { VerdantAI } from './pages/VerdantAI';
import { SettingsPage } from './pages/Settings';
import { Menu, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const MainContent: React.FC = () => {
  const { activeTab } = usePlants();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'collection':
        return <Collection />;
      case 'care':
        return <CareCycle />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'ai':
        return <VerdantAI />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="min-h-screen bg-verdant-bg font-sans selection:bg-verdant-light/30 flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-verdant-bg/80 backdrop-blur-md z-30 border-b border-verdant-secondary/10">
        <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 text-verdant-primary hover:bg-verdant-secondary/10 rounded-full transition-colors">
            
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 text-verdant-primary">
            <Leaf className="fill-verdant-primary" size={20} />
            <span className="font-bold tracking-tight text-lg">Verdant</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.2
            }}
            className="min-h-full">
            
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Elements */}
      <div className="lg:hidden">
        <HamburgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)} />
        
        <BottomNav />
      </div>
    </div>);

};
export function App() {
  return (
    <PlantProvider>
      <MainContent />
    </PlantProvider>);

}
