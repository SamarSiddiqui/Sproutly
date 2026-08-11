import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useArticles } from '../../hooks/useArticles';

gsap.registerPlugin(ScrollTrigger);

export function GuidesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { data: articles = [] } = useArticles();

  const topArticles = articles.slice(0, 3);

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
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sproutly-forest font-semibold hover:text-emerald-800 transition-colors group"
          >
            View all guides
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div
          ref={cardsRef}
          className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {topArticles.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="flex-1 min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer block"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-sm border border-sproutly-forest/10">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-sproutly-forest/80 backdrop-blur-md text-sproutly-cream text-xs font-semibold px-3 py-1 rounded-full">
                  {guide.category}
                </div>
              </div>
              <div className="text-xs text-sproutly-forest/60 mb-2 font-medium">
                {guide.readTime} • {guide.publishedAt}
              </div>
              <h3 className="text-xl font-serif font-bold text-sproutly-forest group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                {guide.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
