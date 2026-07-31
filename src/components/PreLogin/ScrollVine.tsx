'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollVine() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    // Get the exact pixel length of the SVG curve
    const length = pathRef.current.getTotalLength();

    // Prepare for the draw animation
    gsap.set(pathRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const ctx = gsap.context(() => {
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'max',
          scrub: 1.5, // 1.5 second smoothing for that buttery feel
        },
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <div className="fixed top-0 left-4 md:left-8 lg:left-16 bottom-0 w-24 pointer-events-none z-0 hidden md:block">
      <svg 
        viewBox="0 0 100 1000" 
        preserveAspectRatio="xMidYMin slice"
        className="w-full h-full overflow-visible opacity-30"
      >
        {/* The main vine stalk */}
        <path
          ref={pathRef}
          id="vine-stalk"
          d="M 50 0 C 80 150, 20 250, 50 400 C 80 550, 20 700, 50 850 C 80 950, 50 1000, 50 1000"
          fill="none"
          stroke="#426B1F"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
