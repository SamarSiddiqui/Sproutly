import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function TrustStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stripRef.current) {
        gsap.fromTo(
          stripRef.current.children,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stripRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, stripRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-12 border-y border-sproutly-forest/10 bg-sproutly-cream/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={stripRef}
          className="flex flex-wrap justify-center gap-12 md:gap-24 text-center"
        >
          <div className="group flex flex-col items-center cursor-default transition-transform duration-500 hover:-translate-y-1">
            <span className="text-4xl md:text-5xl font-serif text-sproutly-forest/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sproutly-sage group-hover:to-emerald-600 transition-all duration-500 mb-2">
              12,000+
            </span>
            <span className="text-sm font-medium text-sproutly-forest/40 group-hover:text-sproutly-forest/80 transition-colors duration-500 uppercase tracking-widest">
              Plants Tracked
            </span>
          </div>
          <div className="group flex flex-col items-center cursor-default transition-transform duration-500 hover:-translate-y-1">
            <span className="text-4xl md:text-5xl font-serif text-sproutly-forest/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sproutly-sage group-hover:to-emerald-600 transition-all duration-500 mb-2">
              94%
            </span>
            <span className="text-sm font-medium text-sproutly-forest/40 group-hover:text-sproutly-forest/80 transition-colors duration-500 uppercase tracking-widest">
              Survival Rate
            </span>
          </div>
          <div className="group flex flex-col items-center cursor-default transition-transform duration-500 hover:-translate-y-1">
            <span className="text-4xl md:text-5xl font-serif text-sproutly-forest/40 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sproutly-sage group-hover:to-emerald-600 transition-all duration-500 mb-2">
              4.9/5
            </span>
            <span className="text-sm font-medium text-sproutly-forest/40 group-hover:text-sproutly-forest/80 transition-colors duration-500 uppercase tracking-widest">
              Loved by Plant Parents
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
