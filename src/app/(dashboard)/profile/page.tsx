'use client';

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { usePlants } from '../../../hooks/usePlants';
import { calculateGardenerStats } from '../../../utils/achievements';
import { 
  Droplets, 
  Leaf, 
  Sparkles, 
  Sun, 
  Scissors, 
  Trophy, 
  Award, 
  ShieldCheck, 
  Calendar,
  Heart,
  TrendingUp
} from 'lucide-react';

const iconMap = {
  Droplets,
  Leaf,
  Sparkles,
  Sun,
  Scissors,
  Trophy,
  Award,
  ShieldCheck,
};

export default function ProfilePage() {
  const { session } = useAuth();
  const { plants } = usePlants();

  const stats = calculateGardenerStats(plants);

  // Find user's favorite/oldest plant for spotlight
  const spotlightPlant = plants.length > 0 ? plants[0] : null;

  const joinedDate = session?.user?.created_at 
    ? new Date(session.user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'RecentlyJoined';

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-sproutly-primary mb-1">Gardener Profile</h1>
        <p className="text-sproutly-secondary">Track your achievements and level up your botanical skills.</p>
      </header>

      {/* Gardener Passport & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Passport Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-sproutly-secondary/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sproutly-light/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sproutly-primary to-sproutly-secondary text-white flex items-center justify-center font-serif text-3xl font-bold shadow-md">
              {session?.user?.email?.charAt(0).toUpperCase() || 'G'}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold text-sproutly-primary">
                {session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm font-medium text-sproutly-secondary">{session?.user?.email}</p>
              <div className="inline-flex items-center gap-1.5 text-xs text-sproutly-secondary mt-1 bg-sproutly-bg px-2.5 py-1 rounded-full border border-sproutly-secondary/5 font-semibold">
                <Calendar size={14} />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-sproutly-secondary/10 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs uppercase tracking-wider text-sproutly-secondary font-bold">Gardener Rank</span>
                <div className="text-lg font-bold text-sproutly-primary mt-0.5">{stats.levelTitle}</div>
              </div>
              <span className="text-sm font-bold text-sproutly-primary">Level {stats.level}</span>
            </div>
            
            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-sproutly-bg rounded-full overflow-hidden border border-sproutly-secondary/5">
                <div 
                  className="h-full bg-sproutly-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stats.currentXp / stats.nextLevelXp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-sproutly-secondary">
                <span>{stats.currentXp} XP</span>
                <span>{stats.nextLevelXp} XP to Level {stats.level + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Stats Summary */}
        <div className="bg-gradient-to-br from-sproutly-primary to-emerald-950 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 opacity-90">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-sm opacity-80 font-medium">Total Plants</span>
                <span className="text-xl font-bold">{stats.totalPlants}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-sm opacity-80 font-medium">Healthy Plants</span>
                <span className="text-xl font-bold text-emerald-300">{stats.healthyPlants}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm opacity-80 font-medium">Care Score</span>
                <span className="text-xl font-bold text-emerald-300">
                  {stats.totalPlants > 0 ? Math.round((stats.healthyPlants / stats.totalPlants) * 100) : 100}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 text-xs text-emerald-200 bg-white/10 px-3.5 py-2.5 rounded-2xl border border-white/10">
            <TrendingUp size={16} />
            <span className="font-semibold">Keep watering on schedule to earn XP!</span>
          </div>
        </div>
      </div>

      {/* Badges and Milestones Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-sproutly-primary flex items-center gap-2">
          <Award className="text-sproutly-primary" />
          <span>Garden Milestones</span>
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.badges.map((badge) => {
            const Icon = iconMap[badge.iconName] || Award;
            return (
              <div 
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                  badge.unlocked 
                    ? 'bg-white border-emerald-500/20 shadow-sm'
                    : 'bg-white/40 border-sproutly-secondary/5 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    badge.unlocked
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-sproutly-bg text-sproutly-secondary border-sproutly-secondary/10'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-sproutly-primary text-sm truncate">{badge.title}</h4>
                    <p className="text-xs text-sproutly-secondary leading-relaxed line-clamp-2">{badge.description}</p>
                  </div>
                </div>

                {/* Progress bar for ongoing milestone achievements */}
                <div className="mt-4 pt-3 border-t border-sproutly-secondary/5 flex items-center justify-between text-[11px] font-bold text-sproutly-secondary">
                  <span className="uppercase text-[9px] tracking-wider">Progress</span>
                  <span>{badge.progress} / {badge.maxProgress}</span>
                </div>
                <div className="w-full h-1.5 bg-sproutly-bg rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      badge.unlocked ? 'bg-emerald-500' : 'bg-sproutly-secondary/30'
                    }`}
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Plant Spotlight */}
      {spotlightPlant && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-sproutly-primary flex items-center gap-2">
            <Heart className="text-sproutly-primary" />
            <span>Plant Spotlight</span>
          </h3>
          <div className="bg-white rounded-3xl p-6 border border-sproutly-secondary/10 shadow-sm flex flex-col md:flex-row items-center gap-6">
            {spotlightPlant.image && (
              <img 
                src={spotlightPlant.image} 
                alt={spotlightPlant.name} 
                className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-sm border border-sproutly-secondary/5"
              />
            )}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div>
                <span className="text-xs font-bold text-sproutly-primary bg-sproutly-bg px-2.5 py-1 rounded-full border border-sproutly-secondary/10 uppercase tracking-wider">
                  Featured Specimen
                </span>
                <h4 className="text-2xl font-bold text-sproutly-primary mt-2">{spotlightPlant.name}</h4>
                <p className="text-sm font-medium italic text-sproutly-secondary">{spotlightPlant.species}</p>
              </div>
              <p className="text-sm text-sproutly-secondary leading-relaxed max-w-xl">
                This beautiful plant is a key part of your garden collection. Currently in{' '}
                <span className="font-semibold text-sproutly-primary">{spotlightPlant.healthStatus}</span> condition. 
                Keep up the watering schedule to unlock more levels!
              </p>
              <div className="flex justify-center md:justify-start gap-6 pt-2 text-xs font-bold text-sproutly-primary">
                <div>
                  <span className="block text-sproutly-secondary text-[10px] uppercase tracking-wider">Water Cycle</span>
                  <span>Every {spotlightPlant.waterInterval} days</span>
                </div>
                <div>
                  <span className="block text-sproutly-secondary text-[10px] uppercase tracking-wider">Fertilizer Cycle</span>
                  <span>Every {spotlightPlant.fertilizerCycle} days</span>
                </div>
                <div>
                  <span className="block text-sproutly-secondary text-[10px] uppercase tracking-wider">Growth Stage</span>
                  <span>{spotlightPlant.growthStage}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
