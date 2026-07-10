'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SeasonalAdvisorWidgetProps {
  location: string;
  plants: any[];
}

export function SeasonalAdvisorWidget({ location, plants }: SeasonalAdvisorWidgetProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toLocaleDateString();
      const cacheKey = 'sproutly:seasonal_advice';
      const cacheDateKey = 'sproutly:seasonal_advice_date';

      if (!force) {
        const cachedAdvice = localStorage.getItem(cacheKey);
        const cachedDate = localStorage.getItem(cacheDateKey);

        if (cachedAdvice && cachedDate === today) {
          setAdvice(cachedAdvice);
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/seasonal-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, plants, date: today }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seasonal advice.');
      }

      const data = await response.json();
      setAdvice(data.advice);
      localStorage.setItem(cacheKey, data.advice);
      localStorage.setItem(cacheDateKey, today);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location && plants.length >= 0) {
      fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, plants]);

  if (!location) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-3 border border-sproutly-secondary/5"
    >
      {/* Subtle Animated gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-sproutly-primary/5 via-sproutly-urgent/5 to-sproutly-primary/5 animate-pulse pointer-events-none" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-sproutly-primary">
          <Sparkles size={20} className="text-yellow-500" />
          <h2 className="text-lg font-bold">Proactive Care Advisor</h2>
        </div>
        <button 
          onClick={() => fetchAdvice(true)}
          disabled={loading}
          className="text-sproutly-secondary hover:text-sproutly-primary transition-colors disabled:opacity-50"
          title="Refresh Advice"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative mt-2">
        {loading && !advice ? (
          <div className="space-y-3">
            <div className="h-4 bg-sproutly-bg rounded-md w-3/4 animate-pulse"></div>
            <div className="h-4 bg-sproutly-bg rounded-md w-5/6 animate-pulse"></div>
            <div className="h-4 bg-sproutly-bg rounded-md w-2/3 animate-pulse"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        ) : advice ? (
          <div className="space-y-2">
            {advice.split('\n').filter(line => line.trim()).map((line, idx) => {
              // Basic markdown list parsing and bold/italic formatting stripping
              const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*');
              // Strip list characters, asterisks, and backticks
              const cleanLine = line
                .replace(/^[-*]\s*/, '')
                .replace(/\*/g, '')
                .replace(/`/g, '');
              
              return (
                <div key={idx} className="flex items-start gap-2">
                  {isListItem && <span className="text-sproutly-primary mt-0.5 select-none">•</span>}
                  <span className="text-sm font-semibold text-sproutly-secondary leading-relaxed">
                    {cleanLine}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
