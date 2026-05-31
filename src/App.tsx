import React, { useState } from 'react';
import { PlantProvider, usePlants } from './context/PlantContext';
import { BottomNav } from './components/Navigation/BottomNav';
import { HamburgerMenu } from './components/Navigation/HamburgerMenu';
import { Sidebar } from './components/Navigation/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Collection } from './pages/Collection';
import { CareCycle } from './pages/CareCycle';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { SproutlyAI } from './pages/SproutlyAI';
import { SettingsPage } from './pages/Settings';
import { PreLoginPage } from './pages/PreLoginPage';
import { Menu, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainContentProps {
  onLogout: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onLogout }) => {
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
        return <SproutlyAI />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="min-h-screen bg-sproutly-bg font-sans selection:bg-sproutly-light/30 flex">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sproutly-bg/80 backdrop-blur-md z-30 border-b border-sproutly-secondary/10">
        <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 text-sproutly-primary hover:bg-sproutly-secondary/10 rounded-full transition-colors">
            
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 text-sproutly-primary">
            <Leaf className="fill-sproutly-primary" size={20} />
            <span className="font-bold tracking-tight text-lg">Sproutly</span>
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
          onClose={() => setIsMenuOpen(false)}
          onLogout={onLogout} />
        
        <BottomNav />
      </div>
    </div>);

};

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem('sproutly:auth:v1') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogin = () => {
    try {
      window.localStorage.setItem('sproutly:auth:v1', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem('sproutly:auth:v1');
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <PreLoginPage onLogin={handleLogin} />;
  }

  return (
    <PlantProvider>
      <MainContent onLogout={handleLogout} />
    </PlantProvider>);
}
