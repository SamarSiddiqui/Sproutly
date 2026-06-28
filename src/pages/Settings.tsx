import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { Download, Upload, RefreshCw, Trash2, Bell, User, Sparkles, SlidersHorizontal, ShieldAlert, Loader2, Check } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

type EnvironmentView = 'chart' | 'bars';

type SproutlySettings = {
  profile: {
    displayName: string;
    location: string;
  };
  reminders: {
    enableCareReminders: boolean;
    reminderTime: string;
    weeklyDigest: boolean;
  };
  preferences: {
    environmentView: EnvironmentView;
    aiTone: 'gentle' | 'direct';
    reduceMotion: boolean;
  };
};

const settingsStorageKey = 'sproutly:settings:v1';
const dashboardEnvironmentViewKey = 'sproutly:dashboard:environmentView';

const defaultSettings: SproutlySettings = {
  profile: {
    displayName: '',
    location: ''
  },
  reminders: {
    enableCareReminders: true,
    reminderTime: '09:00',
    weeklyDigest: false
  },
  preferences: {
    environmentView: 'chart',
    aiTone: 'gentle',
    reduceMotion: false
  }
};

const loadSettings = (): SproutlySettings => {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(settingsStorageKey);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<SproutlySettings> | null;
    if (!parsed || typeof parsed !== 'object') return defaultSettings;
    return {
      profile: {
        displayName: parsed.profile?.displayName ?? defaultSettings.profile.displayName,
        location: parsed.profile?.location ?? defaultSettings.profile.location
      },
      reminders: {
        enableCareReminders: parsed.reminders?.enableCareReminders ?? defaultSettings.reminders.enableCareReminders,
        reminderTime: parsed.reminders?.reminderTime ?? defaultSettings.reminders.reminderTime,
        weeklyDigest: parsed.reminders?.weeklyDigest ?? defaultSettings.reminders.weeklyDigest
      },
      preferences: {
        environmentView: parsed.preferences?.environmentView === 'bars' ? 'bars' : 'chart',
        aiTone: parsed.preferences?.aiTone === 'direct' ? 'direct' : 'gentle',
        reduceMotion: parsed.preferences?.reduceMotion ?? defaultSettings.preferences.reduceMotion
      }
    };
  } catch {
    return defaultSettings;
  }
};

const saveSettings = (next: SproutlySettings) => {
  try {
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(next));
  } catch { /* empty */ }
};

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
      className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-sproutly-bg hover:bg-sproutly-light/10 transition-colors text-left">
      <div>
        <div className="font-bold text-sproutly-primary">{label}</div>
        {description ?
        <div className="text-sm font-medium text-sproutly-secondary mt-1">
            {description}
          </div> :
        null}
      </div>
      <div
        className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-sproutly-primary' : 'bg-sproutly-secondary/30'}`}>
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
};

export const SettingsPage: React.FC = () => {
  const { plants, replacePlants, resetPlants, setActiveTab } = usePlants();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SproutlySettings>(() => {
    const s = loadSettings();
    if (typeof window === 'undefined') return s;
    const env = window.localStorage.getItem(dashboardEnvironmentViewKey);
    if (env === 'bars' || env === 'chart') {
      return {
        ...s,
        preferences: {
          ...s.preferences,
          environmentView: env
        }
      };
    }
    return s;
  });

  // Fetch profile settings on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSettings({
            profile: {
              displayName: data.display_name || '',
              location: data.location || ''
            },
            reminders: {
              enableCareReminders: data.reminders?.enableCareReminders ?? defaultSettings.reminders.enableCareReminders,
              reminderTime: data.reminders?.reminderTime ?? defaultSettings.reminders.reminderTime,
              weeklyDigest: data.reminders?.weeklyDigest ?? defaultSettings.reminders.weeklyDigest
            },
            preferences: {
              environmentView: data.preferences?.environmentView ?? defaultSettings.preferences.environmentView,
              aiTone: data.preferences?.aiTone ?? defaultSettings.preferences.aiTone,
              reduceMotion: data.preferences?.reduceMotion ?? defaultSettings.preferences.reduceMotion
            }
          });
        } else {
          // Initialize profile row
          const defaultProfile = {
            id: user.id,
            display_name: user.user_metadata?.display_name || '',
            location: '',
            reminders: defaultSettings.reminders,
            preferences: defaultSettings.preferences
          };
          await supabase.from('profiles').insert([defaultProfile]);
          setSettings({
            ...defaultSettings,
            profile: {
              displayName: user.user_metadata?.display_name || '',
              location: ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching profile from Supabase:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // Debounced Sync with Supabase on settings change
  useEffect(() => {
    saveSettings(settings);
    try {
      window.localStorage.setItem(dashboardEnvironmentViewKey, settings.preferences.environmentView);
    } catch { /* empty */ }

    if (loadingProfile) return;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            display_name: settings.profile.displayName,
            location: settings.profile.location,
            reminders: settings.reminders,
            preferences: settings.preferences,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('Error saving profile changes to Supabase:', err);
      } finally {
        setSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [settings, loadingProfile]);

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
      settings,
      ui: {
        dashboardEnvironmentView: settings.preferences.environmentView
      }
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
    const text = await file.text();
    const parsed = JSON.parse(text) as any;
    const nextPlants = Array.isArray(parsed?.plants) ? parsed.plants : null;
    if (!nextPlants) {
      window.alert('Invalid backup file. Expected a JSON object with a "plants" array.');
      return;
    }
    replacePlants(nextPlants);
    if (parsed?.settings) {
      const nextSettings = (() => {
        try {
          window.localStorage.setItem(settingsStorageKey, JSON.stringify(parsed.settings));
        } catch { /* empty */ }
        return loadSettings();
      })();
      setSettings(nextSettings);
    }
    if (parsed?.ui?.dashboardEnvironmentView === 'bars' || parsed?.ui?.dashboardEnvironmentView === 'chart') {
      setSettings((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          environmentView: parsed.ui.dashboardEnvironmentView
        }
      }));
    }
    window.alert('Backup imported successfully.');
  };

  const handleResetDemo = () => {
    if (!window.confirm('Reset your garden back to the demo plants? This will replace your current collection.')) return;
    resetPlants();
    window.alert('Demo plants restored.');
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all local data (plants + settings)? This cannot be undone.')) return;
    try {
      window.localStorage.removeItem('sproutly:plants:v1');
      window.localStorage.removeItem(settingsStorageKey);
      window.localStorage.removeItem(dashboardEnvironmentViewKey);
    } catch { /* empty */ }
    window.location.reload();
  };

  if (loadingProfile) {
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
          <div className="text-sm font-semibold text-sproutly-secondary">Garden</div>
          <div className="text-lg font-bold text-sproutly-primary">
            {stats.total} plants • {stats.tasks} tasks
          </div>
        </div>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-sproutly-bg text-sproutly-primary">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold text-sproutly-primary">Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-sproutly-primary mb-2">
              Display name
            </label>
            <input
              value={settings.profile.displayName}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    displayName: e.target.value
                  }
                }))
              }
              placeholder="e.g., Sam"
              className="w-full bg-sproutly-bg rounded-xl py-3 px-4 font-medium text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light" />
          </div>
          <div>
            <label className="block text-sm font-bold text-sproutly-primary mb-2">
              Location
            </label>
            <input
              value={settings.profile.location}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    location: e.target.value
                  }
                }))
              }
              placeholder="e.g., Mumbai"
              className="w-full bg-sproutly-bg rounded-xl py-3 px-4 font-medium text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light" />
          </div>
        </div>
      </section>

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
            checked={settings.reminders.enableCareReminders}
            onChange={(next) =>
              setSettings((prev) => ({
                ...prev,
                reminders: {
                  ...prev.reminders,
                  enableCareReminders: next
                }
              }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-sproutly-bg">
              <div className="font-bold text-sproutly-primary mb-2">Reminder time</div>
              <input
                type="time"
                value={settings.reminders.reminderTime}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    reminders: {
                      ...prev.reminders,
                      reminderTime: e.target.value
                    }
                  }))
                }
                className="w-full bg-white rounded-xl py-3 px-4 font-medium text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light" />
            </div>
            <Toggle
              label="Weekly digest"
              description="A weekly summary of your garden (settings only for now)."
              checked={settings.reminders.weeklyDigest}
              onChange={(next) =>
                setSettings((prev) => ({
                  ...prev,
                  reminders: {
                    ...prev.reminders,
                    weeklyDigest: next
                  }
                }))
              }
            />
          </div>
        </div>
      </section>

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
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        environmentView: 'chart'
                      }
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${settings.preferences.environmentView === 'chart' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}>
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        environmentView: 'bars'
                      }
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${settings.preferences.environmentView === 'bars' ? 'bg-sproutly-bg text-sproutly-primary' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}>
                  Bars
                </button>
              </div>
            </div>
          </div>

          <Toggle
            label="Reduce motion"
            description="Prefer calmer transitions (settings only for now)."
            checked={settings.preferences.reduceMotion}
            onChange={(next) =>
              setSettings((prev) => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  reduceMotion: next
                }
              }))
            }
          />
        </div>
      </section>

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
              value={settings.preferences.aiTone}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    aiTone: e.target.value === 'direct' ? 'direct' : 'gentle'
                  }
                }))
              }
              className="bg-white rounded-xl py-3 px-4 font-bold text-sproutly-primary focus:outline-none focus:ring-2 focus:ring-sproutly-light">
              <option value="gentle">Gentle</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>
      </section>

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
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-primary text-white font-bold shadow-md hover:bg-sproutly-secondary transition-colors">
            <Download size={18} />
            Export backup
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-sproutly-secondary/20 text-sproutly-primary font-bold shadow-sm hover:bg-sproutly-light/10 transition-colors">
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
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-bg text-sproutly-primary font-bold hover:bg-sproutly-light/10 transition-colors">
            <RefreshCw size={18} />
            Restore demo plants
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-sproutly-urgent/10 text-sproutly-urgent font-bold hover:bg-sproutly-urgent/15 transition-colors">
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
            onClick={() => setActiveTab('dashboard')}
            className="text-sproutly-secondary hover:text-sproutly-primary font-bold transition-colors">
            Back to Command Center
          </button>
        </div>
      </section>
    </div>
  );
};

