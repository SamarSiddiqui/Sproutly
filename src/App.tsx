import React, { useState, useEffect } from 'react';
import { PlantProvider, usePlants } from './context/PlantContext';
import { supabase } from './utils/supabaseClient';
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
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Menu, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainContentProps {
  onLogout: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onLogout }) => {
  const { activeTab, weather, weatherLoading } = usePlants();
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
          <div className="flex items-center justify-end gap-1 text-xs font-bold text-sproutly-primary shrink-0 select-none">
            {weatherLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-sproutly-primary/30 border-t-sproutly-primary animate-spin" />
            ) : weather ? (
              <span className="flex items-center gap-1 bg-white/60 px-2.5 py-1 rounded-xl border border-sproutly-secondary/10" title={weather.text}>
                <span>{weather.icon}</span>
                <span>{weather.temp}°</span>
              </span>
            ) : (
              <div className="w-10" />
            )}
          </div>
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
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preLoginState, setPreLoginState] = useState<'landing' | 'login' | 'signup'>('landing');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setPreLoginState('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sproutly-bg flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sproutly-primary animate-pulse">
          <Leaf className="fill-sproutly-primary animate-bounce" size={32} />
          <span className="font-bold tracking-tight text-2xl font-serif">Sproutly</span>
        </div>
        <p className="text-sm font-semibold text-sproutly-secondary">Tending to your garden...</p>
      </div>
    );
  }

  if (!session) {
    switch (preLoginState) {
      case 'landing':
        return <PreLoginPage onNavigate={setPreLoginState} />;
      case 'login':
        return <LoginPage onLogin={() => {}} onNavigate={setPreLoginState} />;
      case 'signup':
        return <SignupPage onLogin={() => {}} onNavigate={setPreLoginState} />;
      default:
        return <PreLoginPage onNavigate={setPreLoginState} />;
    }
  }

  return (
    <PlantProvider>
      <MainContent onLogout={handleLogout} />
    </PlantProvider>);
}
