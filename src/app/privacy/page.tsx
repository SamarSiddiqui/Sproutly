'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/PreLogin/Navbar';
import { Footer } from '../../components/PreLogin/Footer';
import { ShieldCheck, Lock, Eye, Database, Server, RefreshCw, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 border-b border-sproutly-forest/10 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-sm font-semibold mb-4">
            <ShieldCheck size={16} className="text-emerald-600" />
            Legal & Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-sproutly-forest font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-sproutly-forest/60">
            Last Updated: August 4, 2026 • Effective Immediately
          </p>
        </div>

        {/* Intro Highlight Box */}
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-sproutly-forest/10 shadow-sm mb-12 flex items-start gap-4">
          <Lock size={24} className="text-emerald-700 shrink-0 mt-1" />
          <p className="text-sm md:text-base text-sproutly-forest/80 leading-relaxed font-medium">
            At Sproutly, we believe your garden data belongs to you. We only collect the minimal information necessary to deliver personalized plant care schedules, local weather forecasts, and AI consultations. <strong>We never sell your personal data or garden logs to advertisers or third parties.</strong>
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 text-sproutly-forest/90 leading-relaxed text-sm md:text-base">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-sproutly-forest flex items-center gap-2">
              <Database size={20} className="text-emerald-700" /> 1. Information We Collect
            </h2>
            <p className="text-sproutly-forest/80">
              When you create an account or use Sproutly, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sproutly-forest/80">
              <li><strong>Account Credentials:</strong> Email address, display name, and password hash (authenticated via Supabase Auth).</li>
              <li><strong>Garden Data:</strong> Plant nicknames, species names, categories, growth stages, care logs (last watered, fertilized, pruned), and personal notes.</li>
              <li><strong>Location Data:</strong> City name or general geographic coordinates to fetch accurate weather and rain probability data via Open-Meteo.</li>
              <li><strong>AI Conversations & Images:</strong> Messages and leaf photos uploaded to the AI Botanist for diagnostic purposes.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-sproutly-forest flex items-center gap-2">
              <RefreshCw size={20} className="text-emerald-700" /> 2. How We Use Your Information
            </h2>
            <p className="text-sproutly-forest/80">
              Your information is used strictly to provide and improve the Sproutly platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sproutly-forest/80">
              <li>Calculating customized watering, fertilizing, and pruning schedules.</li>
              <li>Snoozing outdoor watering tasks when local rain is detected.</li>
              <li>Generating tailored responses during AI Botanist consultations.</li>
              <li>Enforcing plan limits (such as the 10-plant free capacity and daily AI message limits).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-sproutly-forest flex items-center gap-2">
              <Server size={20} className="text-emerald-700" /> 3. Third-Party Service Providers
            </h2>
            <p className="text-sproutly-forest/80">
              We partner with industry-leading, privacy-compliant infrastructure providers:
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/60 p-4 rounded-2xl border border-sproutly-forest/5 text-xs">
                <strong className="block text-sproutly-forest font-bold mb-1">Supabase</strong>
                <span className="text-sproutly-forest/70">Encrypted database storage and user authentication.</span>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl border border-sproutly-forest/5 text-xs">
                <strong className="block text-sproutly-forest font-bold mb-1">Mistral AI</strong>
                <span className="text-sproutly-forest/70">Powers botanical language model responses.</span>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl border border-sproutly-forest/5 text-xs">
                <strong className="block text-sproutly-forest font-bold mb-1">Open-Meteo API</strong>
                <span className="text-sproutly-forest/70">Fetches real-time weather forecasts and precipitation.</span>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl border border-sproutly-forest/5 text-xs">
                <strong className="block text-sproutly-forest font-bold mb-1">Vercel Inc.</strong>
                <span className="text-sproutly-forest/70">Secure application hosting and edge deployment.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-sproutly-forest flex items-center gap-2">
              <Eye size={20} className="text-emerald-700" /> 4. Data Rights & Deletion
            </h2>
            <p className="text-sproutly-forest/80">
              You retain full ownership of your data. At any time, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sproutly-forest/80">
              <li>Request an export of all your plant collection records.</li>
              <li>Request full deletion of your Sproutly account and all associated database records.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-sproutly-forest/10">
            <h2 className="text-2xl font-serif font-bold text-sproutly-forest flex items-center gap-2">
              <Mail size={20} className="text-emerald-700" /> 5. Contact & Privacy Inquiries
            </h2>
            <p className="text-sproutly-forest/80">
              If you have any questions regarding this Privacy Policy or wish to exercise your data rights, please contact our team at:
            </p>
            <div className="inline-block bg-sproutly-forest/5 px-4 py-2.5 rounded-xl font-mono text-sm text-sproutly-forest font-semibold">
              privacy@sproutly.app
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
