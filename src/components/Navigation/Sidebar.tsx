'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Leaf,
  Droplets,
  BookOpen,
  Sparkles,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { usePlants } from '../../hooks/usePlants';
import { useProfile } from '../../hooks/useProfile';
import { useWeather } from '../../hooks/useWeather';
import { motion } from 'framer-motion';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const { plants } = usePlants();
  const { profile } = useProfile();
  
  // Weather synced dynamically
  const { data: weather } = useWeather(
    profile?.preferences?.latitude,
    profile?.preferences?.longitude,
    profile?.location
  );

  const menuItems = [
    {
      id: 'dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Command Center'
    },
    {
      id: 'collection',
      href: '/collection',
      icon: Leaf,
      label: 'My Collection',
      badge: plants.length
    },
    {
      id: 'care',
      href: '/care',
      icon: Droplets,
      label: 'Care Cycle'
    },
    {
      id: 'knowledge',
      href: '/knowledge',
      icon: BookOpen,
      label: 'Knowledge Hub'
    },
    {
      id: 'ai',
      href: '/ai',
      icon: Sparkles,
      label: 'Sproutly AI'
    }
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-white border-r border-sproutly-secondary/10 z-40">
      <div className="p-6 flex items-center justify-between text-sproutly-primary mb-6 border-b border-sproutly-secondary/5 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="fill-sproutly-primary" size={28} />
          <span className="text-2xl font-bold tracking-tight">Sproutly</span>
        </Link>
        {weather && (
          <span className="flex items-center gap-1 bg-sproutly-bg px-2.5 py-1.5 rounded-xl border border-sproutly-secondary/10 text-xs font-bold select-none" title={`${weather.cityName}: ${weather.text}`}>
            <span>{weather.icon}</span>
            <span>{weather.temp}°</span>
          </span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all relative group ${isActive ? 'text-white' : 'text-sproutly-primary hover:bg-sproutly-light/10'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute inset-0 bg-sproutly-primary rounded-xl -z-10"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6
                  }}
                />
              )}
              <div className="flex items-center gap-3 relative z-10">
                <Icon
                  size={20}
                  className={isActive ? 'text-white' : 'text-sproutly-secondary group-hover:text-sproutly-primary'}
                />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full relative z-10 ${isActive ? 'bg-white/20 text-white' : 'bg-sproutly-bg text-sproutly-primary'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sproutly-secondary/10 space-y-2">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === '/settings' ? 'bg-sproutly-primary text-white shadow-md' : 'text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-light/10'}`}
        >
          <Settings size={20} />
          <span className="font-semibold text-sm">Settings</span>
        </Link>
        <Link
          href="/profile"
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === '/profile' ? 'bg-sproutly-primary text-white shadow-md' : 'text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-light/10'}`}
        >
          <User size={20} />
          <span className="font-semibold text-sm">Profile</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sproutly-urgent hover:bg-sproutly-urgent/10 transition-all"
        >
          <LogOut size={20} className="text-sproutly-urgent" />
          <span className="font-semibold text-sm text-sproutly-urgent">Log out</span>
        </button>
      </div>
    </div>
  );
};
