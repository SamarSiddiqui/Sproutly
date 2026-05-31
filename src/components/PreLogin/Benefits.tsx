import React, { useEffect, useRef } from 'react';
import { Droplets, Sprout, Scissors, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Droplets,
    title: 'Smart Watering',
    description:
      "No more guessing. Get gentle reminders based on your plant's specific needs and your local weather.",
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Sprout,
    title: 'Feeding Schedules',
    description:
      'Know exactly when to fertilize during the growing season to keep those leaves looking lush.',
    color: 'bg-sproutly-beige text-sproutly-terracotta',
  },
  {
    icon: Scissors,
    title: 'Pruning & Care',
    description:
      'Step-by-step guidance on when and how to prune, repot, and propagate your collection.',
    color: 'bg-sproutly-sage/20 text-sproutly-forest',
  },
  {
    icon: BookOpen,
    title: 'Quick Guides',
    description:
      'Bite-sized articles to help you understand light levels, humidity, and soil mixes without the jargon.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sproutly-forest mb-6">
            Everything your plants need, in one quiet little app.
          </h2>
          <p className="text-lg text-sproutly-forest/70">
            We've distilled years of botanical knowledge into simple, actionable
            steps so you can focus on enjoying your indoor jungle.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-sproutly-cream border border-sproutly-forest/5 hover:shadow-xl hover:shadow-sproutly-forest/5 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${benefit.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif text-sproutly-forest mb-3">
                {benefit.title}
              </h3>
              <p className="text-sproutly-forest/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
