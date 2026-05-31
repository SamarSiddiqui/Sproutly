import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Leaf } from './decor/Leaf';

interface HeroProps {
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text stagger animation
      if (textRef.current) {
        const elements = textRef.current.children;
        gsap.fromTo(
          elements,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2,
          }
        );
      }

      // Floating leaves animation
      if (leavesRef.current) {
        const leaves = leavesRef.current.children;
        Array.from(leaves).forEach((leaf, i) => {
          gsap.to(leaf, {
            y: `+=${15 + i * 5}`,
            rotation: `+=${10 + i * 5}`,
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
    >
      {/* Floating Leaves Background */}
      <div
        ref={leavesRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
      >
        <Leaf className="absolute top-20 left-[10%] w-12 h-12 text-sproutly-sage -rotate-12" />
        <Leaf className="absolute top-40 right-[40%] w-8 h-8 text-sproutly-forest rotate-45" />
        <Leaf className="absolute bottom-20 left-[30%] w-16 h-16 text-sproutly-terracotta rotate-90" />
        <Leaf className="absolute top-1/3 right-[15%] w-10 h-10 text-sproutly-sage -rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={textRef} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sproutly-beige text-sproutly-forest text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-sproutly-terracotta"></span>
              For every plant grower, everywhere
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6 text-sproutly-forest">
              Plant care,
              <br />
              <span className="italic text-sproutly-sage">gently guided.</span>
            </h1>
            <p className="text-lg md:text-xl text-sproutly-forest/80 mb-10 leading-relaxed">
              Whether your plants live on a sunny windowsill, a busy balcony, a
              terrace garden, or scattered across every room — Sproutly helps
              them thrive. Track your collection, stay ahead of watering, and
              get AI-powered advice the moment something looks off.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="bg-sproutly-forest text-sproutly-cream px-8 py-4 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20"
              >
                Start growing — it's free
              </button>
              <a
                href="#features"
                className="inline-block text-center bg-white/50 backdrop-blur-sm border border-sproutly-forest/10 text-sproutly-forest px-8 py-4 rounded-full text-base font-medium hover:bg-white/80 transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative h-[500px] md:h-[600px] w-full rounded-3xl overflow-hidden">
            {/* Decorative background blob */}
            <div className="absolute inset-0 bg-sproutly-beige rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div
              ref={imageRef}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80"
                alt="Collection of healthy indoor plants in terracotta pots"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
