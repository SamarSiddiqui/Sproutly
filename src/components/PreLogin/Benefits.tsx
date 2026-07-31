'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Sprout, Scissors, BookOpen, Scan, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
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

function ScannerDemoWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    // Hotspot on the right side of the image
    const isNearHotspot = x > rect.width * 0.5 && x < rect.width * 0.9 && y > rect.height * 0.2 && y < rect.height * 0.8;
    setIsScanning(isNearHotspot);
  };

  return (
    <div className="mt-32 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4 border border-blue-100">
          <Scan className="w-4 h-4" />
          AI Diagnosis Engine
        </div>
        <h3 className="text-3xl md:text-4xl font-serif text-sproutly-forest mb-4">Hover to diagnose.</h3>
        <p className="text-lg text-sproutly-forest/70 max-w-xl mx-auto">Move your mouse over the plant to instantly detect issues. No more guessing what those yellow spots mean.</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] overflow-hidden cursor-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-4 border-white"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setIsScanning(false); }}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />

        {/* Plant Image - A nice Monstera */}
        <img
          src="https://www.realsimple.com/thmb/kONnhRNgq8r_OnWfKXjGigjnRbs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2049299849-904f8bac012d4e4685faa3a634be690c.jpeg"
          alt="Plant"
          className="w-full h-full object-cover transition-transform duration-[10s] ease-out hover:scale-110"
        />

        {/* Viewfinder */}
        {isHovering && (
          <motion.div
            className="absolute left-0 top-0 pointer-events-none z-20"
            style={{
              x: springX,
              y: springY,
            }}
          >
            <div className="relative -left-1/2 -top-1/2 flex flex-col items-center justify-center">
              {/* Box */}
              <motion.div
                animate={{
                  width: isScanning ? 160 : 100,
                  height: isScanning ? 160 : 100,
                  borderColor: isScanning ? '#eab308' : '#ffffff',
                  backgroundColor: isScanning ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 255, 255, 0.1)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative border-[3px] rounded-2xl flex items-center justify-center backdrop-blur-[2px] shadow-2xl"
              >
                {/* Corner brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-[3px] border-l-[3px] border-current rounded-tl-lg" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-[3px] border-r-[3px] border-current rounded-tr-lg" />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-[3px] border-l-[3px] border-current rounded-bl-lg" />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-[3px] border-r-[3px] border-current rounded-br-lg" />

                <Scan className={`w-8 h-8 transition-colors ${isScanning ? 'text-yellow-400' : 'text-white'}`} />
              </motion.div>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{
                  opacity: isScanning ? 1 : 0,
                  y: isScanning ? 0 : 15,
                  scale: isScanning ? 1 : 0.9
                }}
                className="absolute top-full mt-6 w-72 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/50 origin-top"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Nitrogen Deficiency</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">98% Match. Apply a balanced liquid fertilizer during your next watering cycle.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

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

        <ScannerDemoWidget />
      </div>
    </section>
  );
}
