import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const guides = [
  {
    title: "Why are my Monstera's leaves yellow?",
    category: 'Troubleshooting',
    image:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Watering 101: The Soak and Dry Method',
    category: 'Basics',
    image:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Light levels by room: A practical guide',
    category: 'Environment',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Repotting like a pro without the mess',
    category: 'Care',
    image:
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

export function GuidesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
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
    <section id="guides" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-sproutly-forest mb-4">
              Learn as you grow.
            </h2>
            <p className="text-lg text-sproutly-forest/70">
              Bite-sized guides to help you understand your plants better,
              written by real botanists.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 text-sproutly-terracotta font-medium hover:text-sproutly-terracotta/80 transition-colors group">
            View all guides
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div
          ref={cardsRef}
          className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start group cursor-pointer"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-sproutly-forest">
                  {guide.category}
                </div>
              </div>
              <h3 className="text-xl font-serif text-sproutly-forest group-hover:text-sproutly-terracotta transition-colors line-clamp-2">
                {guide.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
