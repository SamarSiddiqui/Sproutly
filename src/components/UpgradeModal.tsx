'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, X, Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureName?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = 'Upgrade to Sproutly Pro',
  description = 'You have reached the free tier limit. Upgrade to Pro to unlock unlimited capacity and advanced AI diagnostic tools.',
  featureName = 'Pro Feature',
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-sproutly-forest to-emerald-950 text-sproutly-cream rounded-3xl p-8 shadow-2xl border border-emerald-500/30 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sproutly-sage/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-sproutly-cream/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-6 shadow-inner">
            <Zap size={28} className="fill-emerald-400 text-emerald-400" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            {featureName} Locked
          </div>

          <h3 className="text-2xl md:text-3xl font-serif text-white font-bold mb-3">
            {title}
          </h3>

          <p className="text-sm text-sproutly-cream/80 mb-8 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>

          {/* Quick Perks */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-8 text-left border border-white/10 space-y-2.5 text-xs text-sproutly-cream/90">
            <div className="flex items-center gap-2.5">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Unlimited Plant Capacity</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Unlimited AI Consultations (No Daily Caps)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Photo AI Leaf Diagnostics & Weather Auto-Snooze</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/pricing"
              onClick={onClose}
              className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-400 to-sproutly-sage text-emerald-950 font-bold hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              Explore Pro Plans ($3.25/mo)
            </Link>

            <button
              onClick={onClose}
              className="py-2.5 text-xs text-sproutly-cream/60 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
