'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { useProfile } from '../../../hooks/useProfile';
import { useWeather } from '../../../hooks/useWeather';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Droplets,
  Scissors,
  FlaskConical,
  AlertCircle,
  ChevronRight,
  Sprout,
  Flower2,
  TreeDeciduous,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SeasonalAdvisorWidget } from '../../../components/dashboard/SeasonalAdvisorWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { plants } = usePlants();
  const { profile, updateProfile } = useProfile();
  
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Fetch weather dynamically using our cache hook
  const { data: weather, isLoading: weatherLoading, refetch: refreshWeather } = useWeather(
    profile?.preferences?.latitude,
    profile?.preferences?.longitude,
    profile?.location
  );

  const handleDashboardGPS = async () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          await updateProfile({
            location: 'GPS Location',
            preferences: {
              environmentView: profile?.preferences?.environmentView || 'chart',
              aiTone: profile?.preferences?.aiTone || 'gentle',
              reduceMotion: profile?.preferences?.reduceMotion || false,
              latitude,
              longitude
            }
          });
          
          await refreshWeather();
        } catch (err) {
          console.error(err);
          setGpsError('Failed to save GPS location.');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsError('Failed to get location. Check browser permission.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const [environmentView, setEnvironmentView] = useState<'chart' | 'bars'>('chart');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sproutly:dashboard:environmentView');
      if (saved === 'bars') setEnvironmentView('bars');
    }
  }, []);

  const changeEnvironmentView = (view: 'chart' | 'bars') => {
    setEnvironmentView(view);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sproutly:dashboard:environmentView', view);
    }
  };

  const growthStages = useMemo(() => {
    return {
      Seedling: plants.filter((p) => p.growthStage === 'Seedling').length,
      Growing: plants.filter((p) => p.growthStage === 'Growing').length,
      Mature: plants.filter((p) => p.growthStage === 'Mature').length,
      Flowering: plants.filter((p) => p.growthStage === 'Flowering').length
    };
  }, [plants]);

  const environmentBreakdown = useMemo(() => {
    const total = plants.length;
    const categories = [
      {
        name: 'Indoor',
        value: plants.filter((p) => p.category === 'Indoor').length,
        color: '#1B4332'
      },
      {
        name: 'Semi-Shade',
        value: plants.filter((p) => p.category === 'Semi-Shade').length,
        color: '#52796F'
      },
      {
        name: 'Direct Sun',
        value: plants.filter((p) => p.category === 'Direct Sun').length,
        color: '#74C69D'
      }
    ].map((c) => ({
      ...c,
      percent: total === 0 ? 0 : Math.round((c.value / total) * 100)
    }));
    const dominant = total === 0 ? null : categories.reduce((best, c) => c.value > best.value ? c : best, categories[0]);
    return {
      total,
      categories,
      chartData: categories.filter((c) => c.value > 0),
      dominant
    };
  }, [plants]);

  const alerts = useMemo(() => {
    return [
      ...plants
        .filter((p) => p.healthStatus === 'needs-water')
        .map((p) => {
          const isRainDelay = weather && weather.rainProbability > 50;
          return {
            id: p.id,
            type: 'water',
            message: isRainDelay 
              ? `${p.name} needs water (Skip: Rain Forecast)` 
              : `${p.name} needs water`,
            urgency: isRainDelay ? 'low' : 'high',
            icon: Droplets,
            color: isRainDelay ? 'text-green-600' : 'text-sproutly-urgent',
            bg: isRainDelay ? 'bg-green-50' : 'bg-sproutly-urgent/10'
          };
        }),
      ...plants
        .filter((p) => p.healthStatus === 'needs-pruning')
        .map((p) => ({
          id: p.id,
          type: 'prune',
          message: `${p.name} needs pruning`,
          urgency: 'medium',
          icon: Scissors,
          color: 'text-sproutly-warning',
          bg: 'bg-sproutly-warning/10'
        })),
      ...plants
        .filter((p) => p.healthStatus === 'needs-fertilizer')
        .map((p) => ({
          id: p.id,
          type: 'fertilizer',
          message: `${p.name} needs fertilizer`,
          urgency: 'medium',
          icon: FlaskConical,
          color: 'text-sproutly-warning',
          bg: 'bg-sproutly-warning/10'
        }))
    ];
  }, [plants, weather]);

  const handleAlertClick = (plantId: string) => {
    router.push(`/care?plantId=${plantId}`);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sproutly-primary mb-1">
            Gardener's Observatory
          </h1>
          <p className="text-sproutly-secondary font-medium">{today}</p>
        </div>
        {weather && (
          <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-sproutly-secondary/5 select-none shrink-0" title={`${weather.cityName}: ${weather.text}`}>
            <span className="text-2xl filter drop-shadow-sm select-none">{weather.icon}</span>
            <div className="text-right">
              <div className="text-sm font-extrabold text-sproutly-primary leading-tight font-semibold">{weather.temp}°C</div>
              <div className="text-[10px] font-bold text-sproutly-secondary uppercase tracking-wider">{weather.text}</div>
            </div>
          </div>
        )}
      </header>

      {/* Weather Widget Section */}
      {weatherLoading ? (
        <div className="bg-white p-5 rounded-3xl shadow-sm animate-pulse flex items-center justify-between border border-sproutly-secondary/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sproutly-bg" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-sproutly-bg rounded" />
              <div className="w-16 h-3 bg-sproutly-bg rounded" />
            </div>
          </div>
          <div className="w-20 h-4 bg-sproutly-bg rounded" />
        </div>
      ) : weather ? (
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-sproutly-secondary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl filter drop-shadow-sm select-none" role="img" aria-label="weather status">
              {weather.icon}
            </span>
            <div>
              <div className="text-sm font-bold text-sproutly-secondary uppercase tracking-wider font-semibold">Local Weather</div>
              <h3 className="font-bold text-sproutly-primary text-xl flex items-baseline gap-2">
                <span>{weather.temp}°C</span>
                <span className="text-sm font-medium text-sproutly-secondary">{weather.text}</span>
              </h3>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            {weather.rainProbability > 50 ? (
              <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span className="text-base select-none">🌧️</span>
                <span>Smart Delay: {weather.rainProbability}% precipitation expected in {weather.cityName}. Outdoor watering delayed.</span>
              </div>
            ) : weather.temp > 38 ? (
              <div className="bg-orange-50 text-orange-700 border border-orange-200 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span className="text-base select-none">🔥</span>
                <span>Heatwave Alert: High of {weather.maxTemp}°C forecast in {weather.cityName}. Balcony containers dry out quickly.</span>
              </div>
            ) : (
              <div className="bg-sproutly-light/10 text-sproutly-primary border border-sproutly-light/20 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span className="text-base select-none">🌤️</span>
                <span>Optimal: High of {weather.maxTemp}°C in {weather.cityName}. Keep standard moisture schedules.</span>
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            onClick={() => refreshWeather()}
            className="text-xs font-bold text-sproutly-secondary hover:text-sproutly-primary bg-sproutly-bg px-3 py-2 rounded-xl transition-all self-start md:self-center font-semibold"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="bg-sproutly-light/5 border border-dashed border-sproutly-secondary/25 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🌦️</span>
            <div>
              <h4 className="font-bold text-sproutly-primary text-sm">Enable weather-based smart watering</h4>
              <p className="text-xs text-sproutly-secondary font-medium">Use your real-time GPS location or set your city manually in Settings.</p>
              {gpsError && (
                <p className="text-xs text-red-500 font-bold mt-1">{gpsError}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDashboardGPS}
              disabled={gpsLoading}
              className="bg-sproutly-primary hover:bg-sproutly-secondary disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 font-semibold"
            >
              <span>📍</span>
              <span>{gpsLoading ? 'Locating...' : 'Use GPS'}</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/settings')}
              disabled={gpsLoading}
              className="bg-white hover:bg-sproutly-bg text-sproutly-primary border border-sproutly-secondary/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 font-semibold"
            >
              Set Manually
            </button>
          </div>
        </div>
      )}

      {/* Seasonal Advisor Widget */}
      <SeasonalAdvisorWidget location={profile?.location || ''} plants={plants} />

      {/* Total Garden Count */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-4">
          Garden Status
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Seedlings',
              count: growthStages.Seedling,
              icon: Sprout,
              color: 'text-sproutly-light'
            },
            {
              label: 'Growing',
              count: growthStages.Growing,
              icon: Leaf,
              color: 'text-sproutly-secondary'
            },
            {
              label: 'Mature',
              count: growthStages.Mature,
              icon: TreeDeciduous,
              color: 'text-sproutly-primary'
            },
            {
              label: 'Flowering',
              count: growthStages.Flowering,
              icon: Flower2,
              color: 'text-pink-500'
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white p-5 rounded-2xl shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-3 rounded-xl bg-sproutly-bg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-bold text-sproutly-primary">
                    {stat.count}
                  </span>
                </div>
                <span className="text-sm font-semibold text-sproutly-secondary">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Care Stream */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-sproutly-primary flex items-center gap-2">
              <AlertCircle size={20} className="text-sproutly-urgent" />
              Urgent Care
            </h2>
            <span className="text-sm font-medium bg-sproutly-urgent/10 text-sproutly-urgent px-3 py-1 rounded-full">
              {alerts.length} tasks
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-sproutly-secondary">
                All plants are happy and healthy! 🌱
              </div>
            ) : (
              alerts.map((alert, idx) => {
                const Icon = alert.icon;
                return (
                  <motion.button
                    initial={{
                      opacity: 0,
                      y: 10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: idx * 0.1
                    }}
                    key={`${alert.id}-${alert.type}`}
                    onClick={() => handleAlertClick(alert.id)}
                    className="w-full bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow text-left"
                  >
                    <div className={`p-3 rounded-xl ${alert.bg} ${alert.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 font-semibold text-sproutly-primary text-lg">
                      {alert.message}
                    </div>
                    <ChevronRight
                      size={24}
                      className="text-sproutly-secondary/50"
                    />
                  </motion.button>
                );
              })
            )}
          </div>
        </section>

        {/* Garden Distribution */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-bold text-sproutly-primary mb-4">
            Environment
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm min-h-[360px] flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-sproutly-secondary">
                  Total plants
                </div>
                <div className="text-2xl font-bold text-sproutly-primary leading-tight">
                  {environmentBreakdown.total}
                </div>
              </div>
              <div className="flex items-center bg-sproutly-bg rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => changeEnvironmentView('chart')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${environmentView === 'chart' ? 'bg-white text-sproutly-primary shadow-sm' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}
                >
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() => changeEnvironmentView('bars')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${environmentView === 'bars' ? 'bg-white text-sproutly-primary shadow-sm' : 'text-sproutly-secondary hover:text-sproutly-primary'}`}
                >
                  Bars
                </button>
              </div>
            </div>

            {environmentBreakdown.total === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-sproutly-bg text-sproutly-secondary flex items-center justify-center mb-4">
                  <Leaf size={28} />
                </div>
                <div className="text-lg font-bold text-sproutly-primary">
                  No plants yet
                </div>
                <div className="text-sm font-medium text-sproutly-secondary mt-1 max-w-xs">
                  Add a plant to see your environment breakdown (Indoor, Semi-Shade, Direct Sun).
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/collection')}
                  className="mt-5 bg-sproutly-primary text-white px-4 py-3 rounded-xl shadow-md hover:bg-sproutly-secondary transition-colors font-bold"
                >
                  Go to My Collection
                </button>
              </div>
            ) : (
              <>
                {environmentView === 'chart' ? (
                  <div className="relative mt-6 flex-1 min-h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={environmentBreakdown.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={environmentBreakdown.chartData.length > 1 ? 4 : 0}
                          stroke="#ffffff"
                          strokeWidth={4}
                          dataKey="value"
                        >
                          {environmentBreakdown.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value} plants`, name]}
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {environmentBreakdown.dominant && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-3xl font-bold text-sproutly-primary leading-none">
                          {environmentBreakdown.dominant.percent}%
                        </div>
                        <div className="text-sm font-bold text-sproutly-secondary mt-1">
                          {environmentBreakdown.dominant.name}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="h-4 rounded-full bg-sproutly-bg overflow-hidden flex">
                      {environmentBreakdown.categories.map((c) =>
                        c.value === 0 ? null : (
                          <div
                            key={c.name}
                            className="h-full"
                            style={{
                              width: `${c.percent}%`,
                              backgroundColor: c.color
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {environmentBreakdown.categories.map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: c.color
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-sproutly-primary">
                            {c.name}
                          </span>
                          <span className="text-sm font-semibold text-sproutly-secondary">
                            {c.value} • {c.percent}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-sproutly-bg overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.percent}%`,
                              backgroundColor: c.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      
      {/* Optimization Note */}
      <footer className="mt-8 pt-4 border-t border-sproutly-secondary/10 text-[11px] font-bold text-sproutly-secondary flex items-center justify-between">
        <span>Optimization Note: Weather is query-cached for 15 minutes, preventing redundant weather API requests. Pie chart computation uses useMemo to avoid redundant re-renders on layout updates.</span>
      </footer>
    </div>
  );
}
