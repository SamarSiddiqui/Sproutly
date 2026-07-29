import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ScanLine,
  CalendarClock,
  MessageSquare,
  Stethoscope,
  Send,
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

  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string, image?: string}[]>([
    {
      role: 'user',
      text: 'Why are the bottom leaves on my Monstera turning yellow?',
      image: 'https://bloomscape.com/wp-content/uploads/2023/03/ccee577b-c338-46ad-ad6f-59366199a65b-hs_file_upload-image-scaled-e1677783036739.jpg?ver=1013903'
    },
    {
      role: 'ai',
      text: "I can see the yellowing! Since it's only the older, bottom leaves and the soil looks quite dry in the background, this is likely just natural aging or slight underwatering.\n\nLet's check the soil moisture. If the top 2 inches are dry, give it a thorough watering today."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    // Load chat limit count from local storage on mount
    const count = parseInt(localStorage.getItem('sproutly_demo_chats') || '0', 10);
    setChatCount(count);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || chatCount >= 3) return;

    const userText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    setTimeout(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 50);

    // Optimistically update, but backend dictates reality
    setChatCount(chatCount + 1);

    try {
      const res = await fetch('/api/ai-chat-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      
      if (res.status === 429) {
        setChatCount(3);
        localStorage.setItem('sproutly_demo_chats', '3');
        setMessages(prev => [...prev, { role: 'ai', text: "You've reached the free demo limit for this IP address! Sign up for a free account to continue." }]);
        return;
      }

      const data = await res.json();
      const aiResponse = data.reply || "I encountered a botanical error. Please try again later!";
      
      if (data.remaining !== undefined) {
        const newCount = 3 - data.remaining;
        setChatCount(newCount);
        localStorage.setItem('sproutly_demo_chats', newCount.toString());
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Hmm, my connection dropped. Try again later!" }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 50);
    }
  };

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

              <div ref={messagesRef} className="space-y-4 h-[320px] overflow-y-auto pr-2 scrollbar-hide pb-4 transition-all scroll-smooth">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${
                      msg.role === 'user' 
                        ? 'bg-sproutly-cream rounded-tr-sm' 
                        : 'bg-sproutly-sage/10 rounded-tl-sm'
                      } rounded-2xl p-4 max-w-[85%] text-sm text-sproutly-forest whitespace-pre-wrap leading-relaxed`}
                    >
                      {msg.image && (
                        <img src={msg.image} alt="Upload" className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      {msg.text.replace(/\*/g, '')}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-sproutly-sage/10 rounded-2xl rounded-tl-sm p-4 text-sm text-sproutly-forest flex gap-1.5 items-center h-12">
                      <span className="w-1.5 h-1.5 bg-sproutly-sage/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-sproutly-sage/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-sproutly-sage/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-4 relative z-10 bg-white">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={chatCount >= 3 ? "Free demo limit reached. Sign up to continue!" : "Ask Sproutly AI..."}
                  disabled={chatCount >= 3 || isTyping}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sproutly-sage text-sproutly-forest font-medium placeholder:text-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputValue.trim() || chatCount >= 3}
                  className="w-11 h-11 rounded-full bg-sproutly-sage flex items-center justify-center text-white shrink-0 disabled:opacity-50 hover:bg-sproutly-forest transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
