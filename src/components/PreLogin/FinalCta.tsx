import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaProps {
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function FinalCta({ onNavigate }: FinalCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-sproutly-forest to-emerald-950">
      {/* Dark Mode Glow Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sproutly-sage/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div ref={contentRef}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            Ready to give your plants a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sproutly-sage to-emerald-400">better life?</span>
          </h2>
          <p className="text-lg md:text-xl text-sproutly-cream/80 mb-12 max-w-2xl mx-auto font-light tracking-wide">
            Join thousands of plant lovers who have ditched the spreadsheets and
            stress. Your indoor jungle will thank you.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="group flex items-center justify-center gap-3 mx-auto bg-gradient-to-r from-emerald-400 to-sproutly-sage text-emerald-950 px-10 py-5 rounded-full text-lg font-bold hover:shadow-[0_0_40px_rgba(52,211,153,0.3)] transition-all duration-300 hover:-translate-y-1"
          >
            Start growing for free
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <p className="mt-6 text-sm text-sproutly-cream/40 uppercase tracking-widest font-medium">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
