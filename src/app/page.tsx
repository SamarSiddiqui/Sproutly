'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/PreLogin/Navbar';
import { Hero } from '../components/PreLogin/Hero';
import { TrustStrip } from '../components/PreLogin/TrustStrip';
import { Benefits } from '../components/PreLogin/Benefits';
import { AiSection } from '../components/PreLogin/AiSection';
import { HowItWorks } from '../components/PreLogin/HowItWorks';
import { GuidesPreview } from '../components/PreLogin/GuidesPreview';
import { Testimonial } from '../components/PreLogin/Testimonial';
import { FinalCta } from '../components/PreLogin/FinalCta';
import { Footer } from '../components/PreLogin/Footer';
import { ScrollVine } from '../components/PreLogin/ScrollVine';
import { useAuth } from '../hooks/useAuth';
import { Leaf } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && session) {
      router.replace('/dashboard');
    }
  }, [session, loading, router]);

  React.useEffect(() => {
    // If OAuth redirects back to landing page with access token hash,
    // allow client to process session and force clean redirect to dashboard.
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'login') {
      router.push('/login');
    } else if (state === 'signup') {
      router.push('/signup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sproutly-bg flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sproutly-primary animate-pulse">
          <Leaf className="fill-sproutly-primary animate-bounce" size={32} />
          <span className="font-bold tracking-tight text-2xl font-serif">Sproutly</span>
        </div>
        <p className="text-sm font-semibold text-sproutly-secondary">Tending to your garden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white relative">
      <ScrollVine />
      <Navbar onNavigate={handleNavigate} />
      <main>
        <Hero onNavigate={handleNavigate} />
        {/* <TrustStrip /> */}
        <Benefits />
        <AiSection />
        <HowItWorks />
        <GuidesPreview />
        {/* <Testimonial /> */}
        <FinalCta onNavigate={handleNavigate} />
      </main>
      <Footer />
    </div>
  );
}
