'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Leaf,
  Droplets,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  
  const tabs = [
    {
      id: 'dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      id: 'collection',
      href: '/collection',
      icon: Leaf,
      label: 'Collection'
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
      label: 'Knowledge'
    },
    {
      id: 'ai',
      href: '/ai',
      icon: Sparkles,
      label: 'Sproutly AI'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sproutly-secondary/20 px-4 py-2 pb-safe z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative flex flex-col items-center p-2 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-sproutly-light/20 rounded-xl"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6
                  }}
                />
              )}
              <Icon
                size={24}
                className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-sproutly-primary' : 'text-sproutly-secondary/60'}`}
              />
              <span
                className={`text-[10px] mt-1 font-medium relative z-10 transition-colors duration-200 ${isActive ? 'text-sproutly-primary' : 'text-sproutly-secondary/60'}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
