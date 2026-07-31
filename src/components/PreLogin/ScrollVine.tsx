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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'max',
          scrub: 1.5, // 1.5 second smoothing
        }
      });

      // 1. Draw the vine stalk
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
      }, 0);

      // 2. Pop the leaves at specific scroll depths
      const leaves = gsap.utils.toArray('.leaf-sprout') as SVGElement[];
      leaves.forEach((leaf) => {
        const yPos = parseFloat(leaf.getAttribute('data-y') || '0');
        const triggerPoint = yPos / 1000; // Convert Y to a 0-1 timeline progress

        tl.fromTo(leaf, {
          scale: 0,
          opacity: 0,
        }, {
          scale: 1,
          opacity: 1,
          duration: 0.05,
          ease: 'back.out(2)',
        }, triggerPoint);
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

        {/* Sprouting Leaves */}
        {/* Leaf 1 - Left */}
        <g className="leaf-sprout" data-y="200" style={{ transformOrigin: '35px 200px' }}>
          <path d="M 35 200 Q 15 180 5 200 Q 15 220 35 200" fill="#669c35" />
        </g>
        
        {/* Leaf 2 - Right */}
        <g className="leaf-sprout" data-y="450" style={{ transformOrigin: '65px 450px' }}>
          <path d="M 65 450 Q 85 430 95 450 Q 85 470 65 450" fill="#669c35" />
        </g>

        {/* Leaf 3 - Left */}
        <g className="leaf-sprout" data-y="650" style={{ transformOrigin: '35px 650px' }}>
          <path d="M 35 650 Q 15 630 5 650 Q 15 670 35 650" fill="#669c35" />
        </g>

        {/* Leaf 4 - Right */}
        <g className="leaf-sprout" data-y="850" style={{ transformOrigin: '65px 850px' }}>
          <path d="M 65 850 Q 85 830 95 850 Q 85 870 65 850" fill="#669c35" />
        </g>

        {/* Final Bloom - Bottom Center */}
        <g className="leaf-sprout" data-y="980" style={{ transformOrigin: '50px 980px' }}>
          <path d="M 50 980 Q 40 960 50 950 Q 60 960 50 980" fill="#eab308" />
          <path d="M 50 980 Q 30 970 40 960 Q 45 975 50 980" fill="#fef08a" />
          <path d="M 50 980 Q 70 970 60 960 Q 55 975 50 980" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
}
