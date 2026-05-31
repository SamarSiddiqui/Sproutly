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
    <section ref={sectionRef} className="py-24 md:py-32 bg-sproutly-cream">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div ref={contentRef}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-sproutly-forest mb-6">
            Ready to give your plants a better life?
          </h2>
          <p className="text-lg md:text-xl text-sproutly-forest/70 mb-10 max-w-2xl mx-auto">
            Join thousands of plant lovers who have ditched the spreadsheets and
            stress. Your indoor jungle will thank you.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-sproutly-terracotta text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-sproutly-terracotta/90 transition-colors shadow-lg shadow-sproutly-terracotta/20"
          >
            Start growing for free
          </button>
          <p className="mt-4 text-sm text-sproutly-forest/50">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
