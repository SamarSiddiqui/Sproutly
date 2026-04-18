import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePlants } from '../context/PlantContext';
import { Download, Upload, RefreshCw, Trash2, Bell, User, Sparkles, SlidersHorizontal, ShieldAlert } from 'lucide-react';

type EnvironmentView = 'chart' | 'bars';

type VerdantSettings = {
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

const settingsStorageKey = 'verdant:settings:v1';
const dashboardEnvironmentViewKey = 'verdant:dashboard:environmentView';

const defaultSettings: VerdantSettings = {
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

const loadSettings = (): VerdantSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = window.localStorage.getItem(settingsStorageKey);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<VerdantSettings> | null;
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

const saveSettings = (next: VerdantSettings) => {
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
      className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-verdant-bg hover:bg-verdant-light/10 transition-colors text-left">
      <div>
        <div className="font-bold text-verdant-primary">{label}</div>
        {description ?
        <div className="text-sm font-medium text-verdant-secondary mt-1">
            {description}
          </div> :
        null}
      </div>
      <div
        className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-verdant-primary' : 'bg-verdant-secondary/30'}`}>
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
};

export const SettingsPage: React.FC = () => {
  const { plants, replacePlants, resetPlants, setActiveTab } = usePlants();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [settings, setSettings] = useState<VerdantSettings>(() => {
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

  useEffect(() => {
    saveSettings(settings);
    try {
      window.localStorage.setItem(dashboardEnvironmentViewKey, settings.preferences.environmentView);
    } catch { /* empty */ }
  }, [settings]);

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
    a.download = 'verdant-backup.json';
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
      window.localStorage.removeItem('verdant:plants:v1');
      window.localStorage.removeItem(settingsStorageKey);
      window.localStorage.removeItem(dashboardEnvironmentViewKey);
    } catch { /* empty */ }
    window.location.reload();
  };

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-4xl mx-auto min-h-full space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-verdant-primary mb-1">
            Settings
          </h1>
          <p className="text-verdant-secondary font-medium">
            Personalize Verdant, manage your data, and choose how the app behaves.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3 text-right">
          <div className="text-sm font-semibold text-verdant-secondary">Garden</div>
          <div className="text-lg font-bold text-verdant-primary">
            {stats.total} plants • {stats.tasks} tasks
          </div>
        </div>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-verdant-bg text-verdant-primary">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold text-verdant-primary">Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-verdant-primary mb-2">
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
              className="w-full bg-verdant-bg rounded-xl py-3 px-4 font-medium text-verdant-primary focus:outline-none focus:ring-2 focus:ring-verdant-light" />
          </div>
          <div>
            <label className="block text-sm font-bold text-verdant-primary mb-2">
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
              className="w-full bg-verdant-bg rounded-xl py-3 px-4 font-medium text-verdant-primary focus:outline-none focus:ring-2 focus:ring-verdant-light" />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-verdant-bg text-verdant-primary">
            <Bell size={20} />
          </div>
          <h2 className="text-xl font-bold text-verdant-primary">Reminders</h2>
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
            <div className="p-4 rounded-2xl bg-verdant-bg">
              <div className="font-bold text-verdant-primary mb-2">Reminder time</div>
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
                className="w-full bg-white rounded-xl py-3 px-4 font-medium text-verdant-primary focus:outline-none focus:ring-2 focus:ring-verdant-light" />
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
          <div className="p-2 rounded-xl bg-verdant-bg text-verdant-primary">
            <SlidersHorizontal size={20} />
          </div>
          <h2 className="text-xl font-bold text-verdant-primary">Preferences</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-verdant-bg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-verdant-primary">Dashboard environment view</div>
                <div className="text-sm font-medium text-verdant-secondary mt-1">
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${settings.preferences.environmentView === 'chart' ? 'bg-verdant-bg text-verdant-primary' : 'text-verdant-secondary hover:text-verdant-primary'}`}>
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${settings.preferences.environmentView === 'bars' ? 'bg-verdant-bg text-verdant-primary' : 'text-verdant-secondary hover:text-verdant-primary'}`}>
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
          <div className="p-2 rounded-xl bg-verdant-bg text-verdant-primary">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-bold text-verdant-primary">Verdant AI</h2>
        </div>

        <div className="p-4 rounded-2xl bg-verdant-bg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-verdant-primary">Assistant tone</div>
              <div className="text-sm font-medium text-verdant-secondary mt-1">
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
              className="bg-white rounded-xl py-3 px-4 font-bold text-verdant-primary focus:outline-none focus:ring-2 focus:ring-verdant-light">
              <option value="gentle">Gentle</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-verdant-bg text-verdant-primary">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-xl font-bold text-verdant-primary">Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-verdant-primary text-white font-bold shadow-md hover:bg-verdant-secondary transition-colors">
            <Download size={18} />
            Export backup
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-verdant-secondary/20 text-verdant-primary font-bold shadow-sm hover:bg-verdant-light/10 transition-colors">
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
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-verdant-bg text-verdant-primary font-bold hover:bg-verdant-light/10 transition-colors">
            <RefreshCw size={18} />
            Restore demo plants
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-verdant-urgent/10 text-verdant-urgent font-bold hover:bg-verdant-urgent/15 transition-colors">
            <Trash2 size={18} />
            Clear all local data
          </button>
        </div>

        <div className="mt-4 text-sm font-medium text-verdant-secondary">
          Tip: After exporting, keep your backup somewhere safe. Import will replace your current collection.
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="text-verdant-secondary hover:text-verdant-primary font-bold transition-colors">
            Back to Command Center
          </button>
        </div>
      </section>
    </div>
  );
};

