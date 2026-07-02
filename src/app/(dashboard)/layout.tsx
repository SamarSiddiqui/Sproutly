'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useWeather } from '../../hooks/useWeather';
import { Sidebar } from '../../components/Navigation/Sidebar';
import { BottomNav } from '../../components/Navigation/BottomNav';
import { HamburgerMenu } from '../../components/Navigation/HamburgerMenu';
import { Leaf, Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading, logout } = useAuth();
  const { profile } = useProfile();
  
  const { data: weather, isLoading: weatherLoading } = useWeather(
    profile?.preferences?.latitude,
    profile?.preferences?.longitude,
    profile?.location
  );
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/');
    }
  }, [session, loading, router]);

  if (loading || !session) {
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

  return (
    <div className="min-h-screen bg-sproutly-bg font-sans selection:bg-sproutly-light/30 flex animate-fadeIn">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={logout} />

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sproutly-bg/80 backdrop-blur-md z-30 border-b border-sproutly-secondary/10">
        <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 text-sproutly-primary hover:bg-sproutly-secondary/10 rounded-full transition-colors"
          >
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
        <div className="min-h-full">
          {children}
        </div>
      </div>

      {/* Mobile Navigation Elements */}
      <div className="lg:hidden">
        <HamburgerMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onLogout={logout}
        />
        <BottomNav />
      </div>
    </div>
  );
}
