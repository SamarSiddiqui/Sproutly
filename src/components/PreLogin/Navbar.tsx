import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

interface NavbarProps {
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sproutly-cream/90 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sproutly-forest">
          <Leaf className="w-6 h-6 text-sproutly-sage" />
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Sproutly
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-sproutly-forest/80">
          <a
            href="#features"
            className="hover:text-sproutly-forest transition-colors"
          >
            Features
          </a>
          <a
            href="#ai"
            className="hover:text-sproutly-forest transition-colors"
          >
            AI
          </a>
          <a
            href="#guides"
            className="hover:text-sproutly-forest transition-colors"
          >
            Guides
          </a>
          <a
            href="#pricing"
            className="hover:text-sproutly-forest transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="hidden md:block text-sm font-medium text-sproutly-forest hover:text-sproutly-forest/70 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-sproutly-forest text-sproutly-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-sproutly-forest/90 transition-colors shadow-sm"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
