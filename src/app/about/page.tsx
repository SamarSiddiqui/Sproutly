'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/PreLogin/Navbar';
import { Footer } from '../../components/PreLogin/Footer';
import { Leaf, Sun, CloudRain, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'login') {
      router.push('/login');
    } else if (state === 'signup') {
      router.push('/signup');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white flex flex-col justify-between">
      <Navbar onNavigate={handleNavigate} />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-sm font-semibold mb-6">
            <Leaf size={16} className="text-emerald-600" />
            Our Story & Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-sproutly-forest mb-6 leading-tight">
            We help plant lovers build thriving gardens, <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sproutly-sage to-emerald-700">without the guesswork</span>
          </h1>
          <p className="text-lg md:text-xl text-sproutly-forest/70 leading-relaxed">
            Sproutly was born out of a simple frustration: rigid calendar reminders drenching plants on rainy days, and confusing advice on forums. We set out to build a smarter, warmer companion for your green companions.
          </p>
        </div>

        {/* Mission Banner Card */}
        <div className="relative bg-gradient-to-br from-sproutly-forest to-emerald-950 text-sproutly-cream rounded-3xl p-8 md:p-14 mb-24 shadow-2xl overflow-hidden border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 block">
                The Sproutly Promise
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 leading-snug">
                Every plant deserves personalized, adaptive care.
              </h2>
              <p className="text-sm md:text-base text-sproutly-cream/80 leading-relaxed mb-6">
                Whether you have a single Monstera on a windowsill or 40 rare aroids across your balcony, Sproutly adapts to your local microclimate, weather forecasts, and individual plant needs.
              </p>
              <div className="flex items-center gap-6 text-xs text-emerald-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sun size={16} className="text-amber-400" /> Real-time Weather Sync
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-emerald-400" /> AI Diagnostics
                </span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <CloudRain size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Weather-Aware Snoozing</h4>
                  <p className="text-xs text-sproutly-cream/70 leading-relaxed">
                    If it rains in your area, Sproutly defers outdoor watering so roots stay healthy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Empathetic Botanical AI</h4>
                  <p className="text-xs text-sproutly-cream/70 leading-relaxed">
                    Instant advice tailored directly to your garden context, not generic search results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-serif text-sproutly-forest font-bold mb-3">Our Core Principles</h2>
            <p className="text-sproutly-forest/70">The values that guide every feature we build.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-sproutly-forest/10 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sproutly-sage/10 text-emerald-700 flex items-center justify-center mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-sproutly-forest mb-3">Botanical Integrity</h3>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                We back our recommendations with real horticultural science, avoiding fads and dangerous viral plant hacks.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-sproutly-forest/10 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sproutly-sage/10 text-emerald-700 flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-sproutly-forest mb-3">Effortless Joy</h3>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                Plant care should feel like a cozy, relaxing hobby — not a stressful chore list or complicated spreadsheet.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-sproutly-forest/10 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sproutly-sage/10 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-sproutly-forest mb-3">Privacy & Trust</h3>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                Your garden photos, location data, and personal notes remain completely private and secure. We never sell user data.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-10 md:p-14 text-center border border-sproutly-forest/10 shadow-sm">
          <h3 className="text-3xl md:text-4xl font-serif text-sproutly-forest font-bold mb-4">
            Ready to give your plants the care they deserve?
          </h3>
          <p className="text-base text-sproutly-forest/70 max-w-lg mx-auto mb-8">
            Join Sproutly for free today and track up to 10 plants with personalized schedules and AI advice.
          </p>
          <button
            onClick={() => handleNavigate('signup')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sproutly-forest text-sproutly-cream font-bold text-base hover:bg-sproutly-forest/90 hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Start Growing Free <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
