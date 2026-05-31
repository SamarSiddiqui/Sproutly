import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-sproutly-sage text-sproutly-cream relative overflow-hidden"
    >
      {/* Subtle background pattern/shape */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sproutly-forest/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <div ref={contentRef}>
          <div className="text-6xl font-serif text-sproutly-cream/30 mb-6">
            "
          </div>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-10">
            I used to feel so guilty when a plant died. Sproutly took away the
            stress and replaced it with this quiet confidence. My fiddle leaf
            fig is actually growing new leaves!
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              alt="Sarah M."
              className="w-12 h-12 rounded-full object-cover border-2 border-sproutly-cream/20"
            />
            <div className="text-left">
              <div className="font-medium">Sarah M.</div>
              <div className="text-sm text-sproutly-cream/70">
                Balcony & indoor gardener · 14 plants
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
