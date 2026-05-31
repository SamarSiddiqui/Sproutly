import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  ScanLine,
  CalendarClock,
  MessageSquare,
  Stethoscope,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const aiFeatures = [
  {
    icon: ScanLine,
    title: 'Plant ID from a photo',
    desc: "Snap a pic and we'll tell you exactly what it is and how to care for it.",
  },
  {
    icon: CalendarClock,
    title: 'Personalized care schedules',
    desc: "AI adapts watering times based on your home's light and humidity.",
  },
  {
    icon: MessageSquare,
    title: 'Chat with an AI botanist',
    desc: 'Ask any question, anytime. "Why are the tips brown?" We know.',
  },
  {
    icon: Stethoscope,
    title: 'Diagnose problems',
    desc: 'Upload a photo of a sick leaf for an instant diagnosis and treatment plan.',
  },
];

export function AiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          {
            x: -30,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }
      if (mockupRef.current) {
        gsap.fromTo(
          mockupRef.current,
          {
            x: 30,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }
      if (messagesRef.current) {
        gsap.fromTo(
          messagesRef.current.children,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mockupRef.current,
              start: 'top 60%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ai"
      ref={sectionRef}
      className="py-24 md:py-32 bg-sproutly-beige overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-sproutly-forest text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-sproutly-terracotta" />
              Powered by AI
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-sproutly-forest mb-6">
              Meet your AI plant whisperer.
            </h2>
            <p className="text-lg text-sproutly-forest/70 mb-10">
              Take the guesswork out of plant parenthood. Our AI analyzes your
              plants, environment, and photos to give you expert advice
              instantly.
            </p>

            <div className="space-y-8">
              {aiFeatures.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <feature.icon className="w-6 h-6 text-sproutly-sage" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif text-sproutly-forest mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sproutly-forest/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={mockupRef} className="relative">
            {/* Decorative background shape */}
            <div className="absolute inset-0 bg-sproutly-sage/20 rounded-[3rem] transform -rotate-3 scale-105"></div>

            {/* Mock Device / Card */}
            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-sproutly-forest/5">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-sproutly-sage flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-serif text-sproutly-forest">
                    Botanist AI
                  </div>
                  <div className="text-xs text-sproutly-forest/50">
                    Always online
                  </div>
                </div>
              </div>

              <div ref={messagesRef} className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-sproutly-cream rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-sm text-sproutly-forest">
                    <img
                      src="https://bloomscape.com/wp-content/uploads/2023/03/ccee577b-c338-46ad-ad6f-59366199a65b-hs_file_upload-image-scaled-e1677783036739.jpg?ver=1013903"
                      alt="Yellowing monstera leaf"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    Why are the bottom leaves on my Monstera turning yellow?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-sproutly-sage/10 rounded-2xl rounded-tl-sm p-4 max-w-[85%] text-sm text-sproutly-forest">
                    I can see the yellowing! Since it's only the older, bottom
                    leaves and the soil looks quite dry in the background, this
                    is likely just natural aging or slight underwatering.
                    <br />
                    <br />
                    Let's check the soil moisture. If the top 2 inches are dry,
                    give it a thorough watering today.
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-sproutly-cream rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-sm text-sproutly-forest">
                    Phew, thanks! I'll water it now.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
