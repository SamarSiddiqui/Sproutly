import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Add your plants',
    desc: "Search our database or snap a photo. We'll identify it instantly.",
  },
  {
    num: '02',
    title: 'Get a care plan',
    desc: 'We generate a personalized schedule based on your specific plant and environment.',
  },
  {
    num: '03',
    title: 'Tend with confidence',
    desc: 'Follow gentle reminders and watch every plant — indoors or out — thrive.',
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stepsRef.current) {
        gsap.fromTo(
          stepsRef.current.children,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-sproutly-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sproutly-forest mb-6">
            Simple, stress-free plant care.
          </h2>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-sproutly-forest/10 -z-10"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white border-4 border-sproutly-cream shadow-sm flex items-center justify-center mb-6 z-10">
                <span className="text-2xl font-serif text-sproutly-sage">
                  {step.num}
                </span>
              </div>
              <h3 className="text-2xl font-serif text-sproutly-forest mb-3">
                {step.title}
              </h3>
              <p className="text-sproutly-forest/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
