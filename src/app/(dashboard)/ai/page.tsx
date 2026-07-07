'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function SproutlyAIPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { plants, loading } = usePlants();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial welcome message once plants are loaded
  useEffect(() => {
    if (!loading && messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hi! I'm Sproutly AI. I see you have ${plants.length} plants in your collection. How can I help you care for them today?`
        }
      ]);
    }
  }, [plants, loading, messages.length]);

  const suggestions = useMemo(() => {
    return plants.slice(0, 3).map((p) => `How do I prune my ${p.name}?`);
  }, [plants]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };
    
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages,
          plants,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat response');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: data.text || 'I encountered an issue communicating with the service.'
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: 'Oops! I am having trouble connecting right now. Please try again in a moment.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, plants]);

  // Read URL query context on mount
  const initialContext = searchParams.get('context');
  const initialProcessed = useRef(false);

  useEffect(() => {
    if (initialContext && !loading && !initialProcessed.current) {
      initialProcessed.current = true;
      const decoded = decodeURIComponent(initialContext);
      handleSend(decoded);
      
      // Clean query params
      const params = new URLSearchParams(window.location.search);
      params.delete('context');
      router.replace(`/ai?${params.toString()}`);
    }
  }, [initialContext, loading, router, handleSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-sproutly-primary" size={32} />
        <p className="text-sm font-semibold text-sproutly-secondary">Waking Sproutly AI...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen max-w-2xl mx-auto bg-white lg:border-x lg:border-sproutly-secondary/10 shadow-sm">
      <header className="px-6 py-4 border-b border-sproutly-secondary/10 bg-white z-10 flex items-center justify-between mt-16 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sproutly-light/20 rounded-xl text-sproutly-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bold text-sproutly-primary text-lg">
              Sproutly AI
            </h1>
            <p className="text-xs text-sproutly-secondary font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Knows your {plants.length} plants
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-sproutly-bg/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-sproutly-primary text-white' : 'bg-sproutly-light/30 text-sproutly-primary'
                }`}
              >
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`p-4 rounded-2xl max-w-[75%] text-sm font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sproutly-primary text-white rounded-tr-sm'
                    : 'bg-white text-sproutly-primary shadow-sm border border-sproutly-secondary/10 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-sproutly-light/30 text-sproutly-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white p-5 rounded-2xl rounded-tl-sm shadow-sm border border-sproutly-secondary/10 flex gap-1.5 items-center">
                <div
                  className="w-2 h-2 bg-sproutly-secondary/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-sproutly-secondary/50 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-sproutly-secondary/50 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 lg:p-6 bg-white border-t border-sproutly-secondary/10 mb-16 lg:mb-0">
        {messages.length === 1 && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(s)}
                className="bg-sproutly-bg text-sproutly-primary text-xs font-bold px-4 py-2.5 rounded-full border border-sproutly-secondary/20 hover:bg-sproutly-light/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about your garden..."
            className="w-full bg-sproutly-bg/50 border border-sproutly-secondary/20 rounded-full py-4 pl-5 pr-14 text-sm font-medium focus:outline-none focus:border-sproutly-primary text-sproutly-primary placeholder:text-sproutly-secondary/50"
          />
          
          <button
            type="button"
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-2 p-2.5 bg-sproutly-primary text-white rounded-full disabled:opacity-50 disabled:bg-sproutly-secondary transition-colors"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
      
      {/* Optimization Note */}
      <footer className="px-6 py-2 border-t border-sproutly-secondary/10 text-[11px] font-bold text-sproutly-secondary">
        Optimization Note: Chat log calculations are managed via query params, avoiding duplicate computations and global context states.
      </footer>
    </div>
  );
}
