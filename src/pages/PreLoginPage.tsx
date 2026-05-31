import React from 'react';
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

interface PreLoginPageProps {
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export const PreLoginPage: React.FC<PreLoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white">
      <Navbar onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <TrustStrip />
        <Benefits />
        <AiSection />
        <HowItWorks />
        <GuidesPreview />
        <Testimonial />
        <FinalCta onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
};
