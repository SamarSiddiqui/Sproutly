'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/PreLogin/Navbar';
import { Footer } from '../components/PreLogin/Footer';
import { Leaf, ArrowLeft, Home, Compass, BookOpen, Sparkles } from 'lucide-react';

export default function NotFound() {
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
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white flex flex-col justify-between relative overflow-hidden">
      <Navbar onNavigate={handleNavigate} />

      <main className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-center relative z-10 my-auto">
        {/* Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sproutly-sage/20 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* 404 Visual Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sproutly-forest to-emerald-950 text-emerald-400 flex items-center justify-center shadow-2xl border border-emerald-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Leaf size={56} className="text-emerald-400 -rotate-45 animate-pulse" />
          </div>
          <span className="absolute -top-3 -right-3 bg-emerald-400 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-emerald-300">
            404 Lost
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-serif text-sproutly-forest font-bold mb-6 tracking-tight">
          Looks like this page <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sproutly-sage to-emerald-700">hasn't sprouted yet</span>
        </h1>

        <p className="text-lg md:text-xl text-sproutly-forest/70 max-w-xl mx-auto mb-10 leading-relaxed">
          The link you followed might be broken, or the page may have been pruned. Let's get you back on the right path.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-sproutly-forest to-emerald-800 text-sproutly-cream font-bold text-base hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home size={18} /> Return to Home
          </Link>

          <Link
            href="/guides"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/80 backdrop-blur-md border border-sproutly-forest/15 text-sproutly-forest font-semibold text-base hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <BookOpen size={18} /> Explore Plant Guides
          </Link>
        </div>

        {/* Quick Nav Suggestions */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-sproutly-forest/10 max-w-2xl mx-auto shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-sproutly-forest/50 mb-4">
            Popular Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-sproutly-forest">
            <Link href="/" className="p-3 rounded-2xl bg-white/70 hover:bg-sproutly-forest hover:text-sproutly-cream transition-all border border-sproutly-forest/5">
              🪴 Home Page
            </Link>
            <Link href="/guides" className="p-3 rounded-2xl bg-white/70 hover:bg-sproutly-forest hover:text-sproutly-cream transition-all border border-sproutly-forest/5">
              📚 Guides Library
            </Link>
            <Link href="/pricing" className="p-3 rounded-2xl bg-white/70 hover:bg-sproutly-forest hover:text-sproutly-cream transition-all border border-sproutly-forest/5">
              💎 Pro Pricing
            </Link>
            <Link href="/about" className="p-3 rounded-2xl bg-white/70 hover:bg-sproutly-forest hover:text-sproutly-cream transition-all border border-sproutly-forest/5">
              🌿 About Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
