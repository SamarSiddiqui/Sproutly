import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sproutly-forest hover:opacity-90 transition-opacity">
          <Leaf className="w-6 h-6 text-sproutly-sage" />
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Sproutly
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-sproutly-forest/70">
          <Link
            href="/#features"
            className="px-4 py-2 rounded-full hover:bg-sproutly-sage/10 hover:text-sproutly-forest transition-all duration-300"
          >
            Features
          </Link>
          <Link
            href="/#ai"
            className="px-4 py-2 rounded-full hover:bg-sproutly-sage/10 hover:text-sproutly-forest transition-all duration-300"
          >
            AI
          </Link>
          <Link
            href="/#guides"
            className="px-4 py-2 rounded-full hover:bg-sproutly-sage/10 hover:text-sproutly-forest transition-all duration-300"
          >
            Guides
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('login')}
            className="hidden md:block text-sm font-medium text-sproutly-forest/80 hover:text-sproutly-forest transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-gradient-to-r from-sproutly-forest to-emerald-700 text-sproutly-cream px-6 py-2.5 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
