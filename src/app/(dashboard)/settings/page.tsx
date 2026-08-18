'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { useProfile } from '../../../hooks/useProfile';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Bell,
  Sparkles,
  SlidersHorizontal,
  ShieldAlert,
  Loader2,
  Check
} from 'lucide-react';

const Toggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}> = ({ label, description, checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-sproutly-bg hover:bg-sproutly-light/10 transition-colors text-left"
    >
      <div>
        <div className="font-bold text-sproutly-primary">{label}</div>
        {description ? (
          <div className="text-sm font-medium text-sproutly-secondary mt-1">
            {description}
          </div>
        ) : null}
      </div>
      <div
        className={`w-12 h-7 rounded-full p-1 transition-colors ${
          checked ? 'bg-sproutly-primary' : 'bg-sproutly-secondary/30'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const { plants, replacePlants, resetPlants, loading: loadingPlants } = usePlants();
  const { profile, loading: loadingProfile, updateProfile } = useProfile();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [saving, setSaving] = useState(false);
  const hasInitialized = useRef(false);

  // Local settings state
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [enableCareReminders, setEnableCareReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [environmentView, setEnvironmentView] = useState<'chart' | 'bars'>('chart');
  const [aiTone, setAiTone] = useState<'gentle' | 'direct'>('gentle');
  const [reduceMotion, setReduceMotion] = useState(false);

  // Sync profile to local state on initial load
  useEffect(() => {
    if (profile && !hasInitialized.current) {
      setDisplayName(profile.displayName);
      setLocation(profile.location);
      setEnableCareReminders(profile.reminders.enableCareReminders);
      setReminderTime(profile.reminders.reminderTime);
      setWeeklyDigest(profile.reminders.weeklyDigest);
      setEnvironmentView(profile.preferences.environmentView);
      setAiTone(profile.preferences.aiTone);
      setReduceMotion(profile.preferences.reduceMotion);
      hasInitialized.current = true;
    }
  }, [profile]);

  // Debounced cloud upsert on local state changes
  useEffect(() => {
    if (loadingProfile || !profile) return;

    // Check if there are actual changes compared to current profile values
    const hasChanges =
      displayName !== profile.displayName ||
      location !== profile.location ||
      enableCareReminders !== profile.reminders.enableCareReminders ||
      reminderTime !== profile.reminders.reminderTime ||
      weeklyDigest !== profile.reminders.weeklyDigest ||
      environmentView !== profile.preferences.environmentView ||
      aiTone !== profile.preferences.aiTone ||
      reduceMotion !== profile.preferences.reduceMotion;

    if (!hasChanges) return;

    // Determine if GPS coordinates should be kept or cleared.
    // If the location is manually changed from 'GPS Location', clear the latitude/longitude coordinates.
    const isGPSLocation = location === 'GPS Location';
    const latitude = isGPSLocation ? profile.preferences.latitude : undefined;
    const longitude = isGPSLocation ? profile.preferences.longitude : undefined;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        await updateProfile({
          displayName,
          location,
          reminders: {
            enableCareReminders,
            reminderTime,
            weeklyDigest,
          },
          preferences: {
            environmentView,
            aiTone,
            reduceMotion,
            latitude,
            longitude,
          },
        });
      } catch (err) {
        console.error('Error saving profile settings:', err);
      } finally {
        setSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    displayName,
    location,
    enableCareReminders,
    reminderTime,
    weeklyDigest,
    environmentView,
    aiTone,
    reduceMotion,
    loadingProfile,
    profile,
    updateProfile,
  ]);

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation('GPS Location');
        
        try {
          await updateProfile({
            location: 'GPS Location',
            preferences: {
              environmentView,
              aiTone,
              reduceMotion,
              latitude,
              longitude,
            },
          });
        } catch (e) {
          console.error(e);
        }
        setGpsLoading(false);
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsError('Failed to get location. Check browser permission.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const stats = useMemo(() => {
    const total = plants.length;
    const needsWater = plants.filter((p) => p.healthStatus === 'needs-water').length;
    const needsPruning = plants.filter((p) => p.healthStatus === 'needs-pruning').length;
    const needsFertilizer = plants.filter((p) => p.healthStatus === 'needs-fertilizer').length;
    return {
      total,
      tasks: needsWater + needsPruning + needsFertilizer
    };
  }, [plants]);

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      plants,
      settings: {
        profile: { displayName, location },
        reminders: { enableCareReminders, reminderTime, weeklyDigest },
        preferences: { environmentView, aiTone, reduceMotion },
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sproutly-backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as any;
      const nextPlants = Array.isArray(parsed?.plants) ? parsed.plants : null;
      if (!nextPlants) {
        window.alert('Invalid backup file. Expected a JSON object with a "plants" array.');
        return;
      }
      await replacePlants(nextPlants);
      if (parsed?.settings) {
        const s = parsed.settings;
        setDisplayName(s.profile?.displayName || '');
        setLocation(s.profile?.location || '');
        setEnableCareReminders(s.reminders?.enableCareReminders ?? true);
        setReminderTime(s.reminders?.reminderTime ?? '09:00');
        setWeeklyDigest(s.reminders?.weeklyDigest ?? false);
        setEnvironmentView(s.preferences?.environmentView ?? 'chart');
        setAiTone(s.preferences?.aiTone ?? 'gentle');
        setReduceMotion(s.preferences?.reduceMotion ?? false);
      }
      window.alert('Backup imported successfully.');
    } catch (e) {
      console.error(e);
      window.alert('Failed to parse backup JSON.');
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset your garden back to the demo plants? This will replace your current collection.')) return;
    await resetPlants();
    window.alert('Demo plants restored.');
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all local data (plants + settings)? This cannot be undone.')) return;
    await replacePlants([]);
    setDisplayName('');
    setLocation('');
    setEnableCareReminders(true);
    setReminderTime('09:00');
    setWeeklyDigest(false);
    setEnvironmentView('chart');
    setAiTone('gentle');
    setReduceMotion(false);
    window.alert('Collection cleared.');
  };

  if (loadingProfile || loadingPlants) {
    return (
      <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-sproutly-primary" size={32} />
        <p className="text-sm font-semibold text-sproutly-secondary">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-4xl mx-auto min-h-full space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-sproutly-primary mb-1">
              Settings
            </h1>
            {saving ? (
              <span className="text-xs font-semibold text-sproutly-secondary flex items-center gap-1 bg-sproutly-bg px-2.5 py-1 rounded-full animate-pulse">
                <Loader2 className="animate-spin" size={10} /> Syncing...
              </span>
            ) : (
              <span className="text-xs font-semibold text-sproutly-secondary flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full">
                <Check size={10} /> Saved to cloud
              </span>
            )}
          </div>
          <p className="text-sproutly-secondary font-medium">
            Personalize Sproutly, manage your data, and choose how the app behaves.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3 text-right">
          <div className="text-sm font-semibold text-sproutly-secondary font-semibold">Garden</div>
          <div className="text-lg font-bold text-sproutly-primary">
            {stats.total} plants • {stats.tasks} tasks
          </div>
        </div>
      </header>

      {/* Location & Microclimate */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <span>📍</span>
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Location & Weather Sync</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-sproutly-secondary leading-relaxed">
            Configure your location to fetch real-time local forecasts and enable weather-adaptive alerts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-sproutly-primary mb-2">
                Home City / Region
              </label>
              <div className="flex gap-2">
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Mumbai"
                  className="flex-1 bg-sproutly-bg rounded-xl py-3 px-4 font-semibold text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light"
                />
                <button
                  type="button"
                  onClick={handleGetGPS}
                  disabled={gpsLoading}
                  className="bg-sproutly-primary hover:bg-sproutly-secondary disabled:opacity-50 text-white px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 font-semibold"
                >
                  <span>📍</span>
                  <span>{gpsLoading ? 'Locating...' : 'Use GPS'}</span>
                </button>
              </div>
              {gpsError && (
                <p className="text-xs text-red-500 font-bold mt-1">{gpsError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <Bell size={20} />
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Reminders</h2>
        </div>

        <div className="space-y-3">
          <Toggle
            label="Care reminders"
            description="Keep the Urgent Care list fresh with gentle nudges (settings only for now)."
            checked={enableCareReminders}
            onChange={setEnableCareReminders}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-sproutly-bg">
              <div className="font-bold text-sproutly-primary mb-2">Reminder time</div>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-white rounded-xl py-3 px-4 font-semibold text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light"
              />
            </div>
            <Toggle
              label="Weekly digest"
              description="A weekly summary of your garden (settings only for now)."
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <SlidersHorizontal size={20} />
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Preferences</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-sproutly-bg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sproutly-primary">Dashboard environment view</div>
                <div className="text-sm font-medium text-sproutly-secondary mt-1">
                  Choose how the Environment section looks in the Command Center.
                </div>
              </div>
              <div className="flex items-center bg-white rounded-xl p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setEnvironmentView('chart')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    environmentView === 'chart' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary hover:text-sproutly-primary'
                  }`}
                >
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironmentView('bars')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    environmentView === 'bars' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary hover:text-sproutly-primary'
                  }`}
                >
                  Bars
                </button>
              </div>
            </div>
          </div>

          <Toggle
            label="Reduce motion"
            description="Prefer calmer transitions (settings only for now)."
            checked={reduceMotion}
            onChange={setReduceMotion}
          />
        </div>
      </section>

      {/* Sproutly AI */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Sproutly AI</h2>
        </div>

        <div className="p-4 rounded-2xl bg-sproutly-bg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sproutly-primary">Assistant tone</div>
              <div className="text-sm font-medium text-sproutly-secondary mt-1">
                Just a preference for now—useful for future AI responses.
              </div>
            </div>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value as any)}
              className="bg-white rounded-xl py-3 px-4 font-bold text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light"
            >
              <option value="gentle">Gentle</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-primary text-white font-bold shadow-md hover:bg-sproutly-secondary transition-colors"
          >
            <Download size={18} />
            Export backup
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-sproutly-secondary/20 text-sproutly-primary font-bold shadow-sm hover:bg-sproutly-light/10 transition-colors"
          >
            <Upload size={18} />
            Import backup
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleImportFile(file).finally(() => {
              e.target.value = '';
            });
          }}
        />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleResetDemo}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-bg text-sproutly-primary font-bold hover:bg-sproutly-light/10 transition-colors"
          >
            <RefreshCw size={18} />
            Restore demo plants
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-urgent/10 text-sproutly-urgent font-bold hover:bg-sproutly-urgent/15 transition-colors"
          >
            <Trash2 size={18} />
            Clear all local data
          </button>
        </div>

        <div className="mt-4 text-sm font-medium text-sproutly-secondary">
          Tip: After exporting, keep your backup somewhere safe. Import will replace your current collection.
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push('/botanical-base')}
            className="text-sproutly-secondary hover:text-sproutly-primary font-bold transition-colors"
          >
            Back to Botanical Base
          </button>
        </div>
      </section>
      
      {/* Optimization Note */}
      <footer className="pt-2 border-t border-sproutly-secondary/10 text-[11px] font-bold text-sproutly-secondary">
        Optimization Note: Profile updates are debounced automatically, saving state changes to the Supabase cloud dynamically with a 1-second delay.
      </footer>
    </div>
  );
}
