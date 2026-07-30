import React, { useEffect, useRef, useState } from 'react';
import { Sun, CloudRain, Cloud, Droplets, Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Add your plants',
    desc: "Search our database or snap a photo. We'll identify it instantly.",
  },
  {
    num: '02',
    title: 'Get a care plan',
    desc: 'We generate a personalized schedule based on your specific plant and environment.',
  },
  {
    num: '03',
    title: 'Tend with confidence',
    desc: 'Follow gentle reminders and watch every plant — indoors or out — thrive.',
  },
];

function WeatherDemoWidget() {
  const [weather, setWeather] = useState<'heatwave' | 'overcast' | 'rain'>('overcast');
  const dropletRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(widgetRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: widgetRef.current, start: 'top 85%' } }
      );
    }, widgetRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!dropletRef.current) return;
    
    // Indexes: M=0, T=1, W=2, T=3, F=4, S=5, S=6
    let targetIndex = 3;
    if (weather === 'heatwave') targetIndex = 1;
    if (weather === 'rain') targetIndex = 6;
    
    const percentage = targetIndex * (100 / 7) + (100 / 14);

    gsap.to(dropletRef.current, {
      left: `${percentage}%`,
      xPercent: -50,
      duration: 0.8,
      ease: 'elastic.out(1, 0.7)',
    });
  }, [weather]);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div ref={widgetRef} className="mt-24 max-w-5xl mx-auto px-2">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-sproutly-forest/5 flex flex-col lg:flex-row gap-12 items-center">
        {/* Controls */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-sm font-semibold">
            <CloudRain className="w-4 h-4 text-sproutly-sage" />
            Live Weather Sync
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-sproutly-forest">Watch the algorithm adapt.</h3>
          <p className="text-lg text-sproutly-forest/70 max-w-md mx-auto lg:mx-0">
            Sproutly constantly monitors your local forecast. Heatwave coming? We water sooner. Raining all week? We delay. Click the weather to see it in action.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
            <button 
              onClick={() => setWeather('heatwave')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${weather === 'heatwave' ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500 shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              <Sun className="w-5 h-5" />
              <span className="font-semibold text-sm">Heatwave</span>
            </button>
            <button 
              onClick={() => setWeather('overcast')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${weather === 'overcast' ? 'bg-gray-200 text-gray-800 ring-2 ring-gray-400 shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              <Cloud className="w-5 h-5" />
              <span className="font-semibold text-sm">Overcast</span>
            </button>
            <button 
              onClick={() => setWeather('rain')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${weather === 'rain' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              <CloudRain className="w-5 h-5" />
              <span className="font-semibold text-sm">Heavy Rain</span>
            </button>
          </div>
        </div>

        {/* Mock UI */}
        <div className="w-full lg:w-[400px] bg-sproutly-cream rounded-[2rem] p-6 shadow-inner border border-gray-100 shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="font-serif font-bold text-sproutly-forest text-lg">Monstera Deliciosa</div>
                <div className="text-xs text-gray-400 font-medium">Watering Schedule</div>
              </div>
              <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">Outdoor</div>
            </div>

            <div className="relative h-16 w-full mb-2">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 -z-0 rounded-full" />
              
              {/* Droplet GSAP target */}
              <div 
                ref={dropletRef}
                className="absolute top-0 w-11 h-11 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 z-10"
              >
                <Droplets className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex justify-between w-full px-0">
              {days.map((day, i) => (
                <div key={i} className="text-xs font-bold text-gray-400 w-full text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 min-h-[90px]">
              <div className="flex gap-3 text-sm text-sproutly-forest/80 items-start">
                <Info className="w-5 h-5 text-sproutly-sage shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {weather === 'heatwave' && "Temperatures are soaring! Watering moved up 2 days to prevent soil from drying out completely."}
                  {weather === 'overcast' && "Standard conditions detected. Maintaining your regular 7-day watering interval."}
                  {weather === 'rain' && "Heavy rain expected this weekend. Watering delayed by 3 days. Let nature do the work!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.children,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-sproutly-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sproutly-forest mb-6">
            Simple, stress-free plant care.
          </h2>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-sproutly-forest/10 -z-10"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white border-4 border-sproutly-cream shadow-sm flex items-center justify-center mb-6 z-10">
                <span className="text-2xl font-serif text-sproutly-sage">
                  {step.num}
                </span>
              </div>
              <h3 className="text-2xl font-serif text-sproutly-forest mb-3">
                {step.title}
              </h3>
              <p className="text-sproutly-forest/70">{step.desc}</p>
            </div>
          ))}
        </div>
        
        <WeatherDemoWidget />
      </div>
    </section>
  );
}
