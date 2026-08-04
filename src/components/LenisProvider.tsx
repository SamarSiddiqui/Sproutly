'use client';

import React, { useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Sync Lenis smooth scroll with GSAP's internal ticker
    // This prevents jank when GSAP ScrollTrigger animations run during smooth scrolling
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);

    // Turn off GSAP's default lag smoothing to avoid conflicts with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false} // Disable autoRaf so GSAP controls it
      options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}
