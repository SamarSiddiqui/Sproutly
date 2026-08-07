import React, { useEffect, useRef } from 'react';
import { Leaf as LeafIcon, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { Leaf } from './decor/Leaf';

interface AuthLayoutProps {
  children: React.ReactNode;
  type: 'login' | 'signup';
  quote: string;
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function AuthLayout({ children, type, quote, onNavigate }: AuthLayoutProps) {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const isLogin = type === 'login';
  const bgColor = isLogin ? 'bg-sproutly-forest' : 'bg-sproutly-sage';
  const imageUrl = isLogin
    ? '/login_page.png'
    : '/sign-Up_page.png';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate left panel content
      if (leftPanelRef.current) {
        gsap.fromTo(
          leftPanelRef.current.children,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
          }
        );
      }
      // Animate right panel content (form)
      if (rightPanelRef.current) {
        gsap.fromTo(
          rightPanelRef.current.children,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3,
          }
        );
      }
      // Floating leaves animation
      if (leavesRef.current) {
        const leaves = leavesRef.current.children;
        Array.from(leaves).forEach((leaf, i) => {
          gsap.to(leaf, {
            y: `+=${15 + i * 5}`,
            rotation: `+=${10 + i * 5}`,
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.5,
          });
        });
      }
      // Subtle image scale
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 1.05,
          },
          {
            scale: 1,
            duration: 10,
            ease: 'sine.out',
          }
        );
      }
    });
    return () => ctx.revert();
  }, [type]);

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-sproutly-cream font-sans selection:bg-sproutly-sage selection:text-white overflow-x-hidden lg:overflow-hidden">
      {/* Left Panel - Brand/Visual */}
      <div
        className={`lg:w-[45%] ${bgColor} relative overflow-hidden flex flex-col justify-between p-6 md:p-8 lg:p-10 min-h-[30vh] lg:h-full`}
      >
        {/* Floating Leaves */}
        <div
          ref={leavesRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-20"
        >
          <Leaf className="absolute top-20 left-[10%] w-12 h-12 text-white -rotate-12" />
          <Leaf className="absolute top-1/3 right-[20%] w-8 h-8 text-white rotate-45" />
          <Leaf className="absolute bottom-32 left-[30%] w-16 h-16 text-white rotate-90" />
        </div>

        <div ref={leftPanelRef} className="relative z-10 h-full flex flex-col">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-sproutly-cream hover:opacity-80 transition-opacity w-fit mb-8 lg:mb-0 text-left"
          >
            <LeafIcon className="w-6 h-6" />
            <span className="font-serif text-2xl font-semibold tracking-tight text-white">
              Sproutly
            </span>
          </button>

          {/* Image Inset */}
          <div className="hidden sm:block flex-grow relative my-8 lg:my-12 rounded-[2rem] overflow-hidden shadow-2xl">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Lush indoor plants"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Quote */}
          <div className="mt-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-sproutly-cream leading-tight mb-4">
              "{quote}"
            </h2>
            <p className="text-sproutly-cream/70 font-medium">— Sproutly</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="lg:w-[55%] flex flex-col p-6 md:p-8 lg:p-10 relative lg:h-full justify-between overflow-y-auto lg:overflow-hidden">
        <button
          onClick={() => onNavigate('landing')}
          className="absolute top-6 left-6 md:top-12 md:left-12 inline-flex items-center gap-2 text-sm font-medium text-sproutly-forest/60 hover:text-sproutly-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="flex-grow flex items-center justify-center mt-12 lg:mt-0">
          <div ref={rightPanelRef} className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
