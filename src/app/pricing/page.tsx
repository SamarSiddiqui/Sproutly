'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/PreLogin/Navbar';
import { Footer } from '../../components/PreLogin/Footer';
import { Check, Sparkles, Zap, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(true);

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
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white relative flex flex-col justify-between">
      <Navbar onNavigate={handleNavigate} />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-sm font-semibold mb-6">
            <Sparkles size={16} className="text-emerald-600" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-sproutly-forest mb-6">
            Invest in your <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sproutly-sage to-emerald-700">indoor jungle</span>
          </h1>
          <p className="text-lg md:text-xl text-sproutly-forest/70 leading-relaxed">
            Start for free with up to 10 plants. Upgrade to Pro whenever you're ready to unlock unlimited capacity, photo AI diagnostics, and smart weather automation.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-medium ${!annual ? 'text-sproutly-forest font-bold' : 'text-sproutly-forest/60'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-16 h-8 bg-sproutly-forest rounded-full p-1 transition-colors duration-300 focus:outline-none"
            >
              <div
                className={`w-6 h-6 bg-sproutly-cream rounded-full transition-transform duration-300 shadow-md ${
                  annual ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${annual ? 'text-sproutly-forest font-bold' : 'text-sproutly-forest/60'}`}>
              Annual Billing
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                SAVE 35%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch mb-24">
          {/* Free Tier */}
          <div className="bg-white/80 backdrop-blur-md border border-sproutly-forest/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl font-bold text-sproutly-forest">Sprouter</h3>
                <span className="text-xs font-semibold uppercase tracking-wider bg-sproutly-cream px-3 py-1 rounded-full text-sproutly-forest/70">Free Forever</span>
              </div>
              <p className="text-sm text-sproutly-forest/70 mb-6">Perfect for beginners caring for a cozy starter collection.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-sproutly-forest">$0</span>
                <span className="text-sm text-sproutly-forest/60 ml-2">/ month</span>
              </div>

              <ul className="space-y-4 text-sm text-sproutly-forest/80 mb-8">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-600 shrink-0" />
                  <span><strong>Up to 10 Plants</strong> in collection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-600 shrink-0" />
                  <span><strong>10 AI Chat Messages</strong> / day</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-600 shrink-0" />
                  <span>Smart Watering & Fertilizer Schedules</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-600 shrink-0" />
                  <span>Basic Weather Forecast integration</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleNavigate('signup')}
              className="w-full py-4 rounded-full border border-sproutly-forest/20 text-sproutly-forest font-semibold hover:bg-sproutly-forest/5 transition-colors text-center"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="relative bg-gradient-to-b from-sproutly-forest to-emerald-950 text-sproutly-cream rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-2xl overflow-hidden border border-emerald-500/20">
            {/* Glowing Orb */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-bold text-white">Jungle Master</h3>
                  <Zap size={18} className="text-emerald-400 fill-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <p className="text-sm text-sproutly-cream/70 mb-6">For dedicated plant parents who want effortless care and unlimited features.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">
                  {annual ? '$3.25' : '$4.99'}
                </span>
                <span className="text-sm text-sproutly-cream/60 ml-2">
                  / month {annual && '(billed $39/year)'}
                </span>
              </div>

              <ul className="space-y-4 text-sm text-sproutly-cream/90 mb-8">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <span><strong>Unlimited Plants</strong> capacity</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <span><strong>Unlimited AI Chat</strong> & Consultations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <span>📸 <strong>Photo AI Diagnostics</strong> (Upload leaf photos)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <span>🌧️ <strong>Smart Rain Auto-Snooze</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-emerald-400 shrink-0" />
                  <span>Growth Photo Journals & Progress Tracker</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleNavigate('signup')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-400 to-sproutly-sage text-emerald-950 font-bold hover:shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              Start 14-Day Free Pro Trial
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-sproutly-forest mb-3">Frequently Asked Questions</h2>
            <p className="text-sproutly-forest/70">Everything you need to know about Sproutly plans.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-sproutly-forest/5">
              <h4 className="font-semibold text-sproutly-forest mb-2">Can I stay on the Free plan forever?</h4>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                Yes! If you have 10 plants or fewer, you can use Sproutly completely free for as long as you like.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-sproutly-forest/5">
              <h4 className="font-semibold text-sproutly-forest mb-2">What happens when I reach 10 plants?</h4>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                You'll still be able to manage your 10 plants. To add an 11th plant, simply upgrade to Sproutly Pro for unlimited plant capacity.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-sproutly-forest/5">
              <h4 className="font-semibold text-sproutly-forest mb-2">How does the 10 messages/day AI cap work?</h4>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                Free accounts get 10 AI chat queries per 24 hours. The limit resets automatically every day.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-sproutly-forest/5">
              <h4 className="font-semibold text-sproutly-forest mb-2">Can I cancel my Pro subscription anytime?</h4>
              <p className="text-sm text-sproutly-forest/70 leading-relaxed">
                Absolutely. You can cancel with one click in your account settings. You will retain access until the end of your billing cycle.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
