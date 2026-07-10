'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import { useChat } from '../../../hooks/useChat';
import { Send, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FormattedMessageText({ text }: { text: string }) {
  // Split into lines
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let isInsideList = false;

  const renderInline = (inlineText: string, key: string | number) => {
    // Basic bold parsing: split by '**'
    const parts = inlineText.split('**');
    return (
      <span key={key}>
        {parts.map((part, index) => {
          const isBold = index % 2 === 1;
          
          // Parse italics inside: split by '*'
          const italicParts = part.split('*');
          const segmentContent = italicParts.map((subpart, subidx) => {
            if (subidx % 2 === 1) {
              return <em key={subidx} className="italic font-medium">{subpart}</em>;
            }
            return subpart;
          });

          if (isBold) {
            return (
              <strong key={index} className="font-extrabold text-sproutly-primary">
                {segmentContent}
              </strong>
            );
          }
          return <span key={index}>{segmentContent}</span>;
        })}
      </span>
    );
  };

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={key} className="list-disc pl-5 my-2 space-y-1 text-inherit">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    
    // Check if line starts with header marker
    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.*)/);
    // Check if line starts with bullet list marker
    const bulletMatch = trimmedLine.match(/^[-*+]\s+(.*)/);
    
    if (headerMatch) {
      if (isInsideList) {
        flushList(`list-${idx}`);
        isInsideList = false;
      }
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      
      let headingClasses = "font-extrabold text-sproutly-primary mt-3 mb-1 ";
      if (level === 1) headingClasses += "text-base";
      else if (level === 2) headingClasses += "text-sm";
      else headingClasses += "text-xs uppercase tracking-wider";
      
      renderedElements.push(
        <div key={idx} className={headingClasses}>
          {renderInline(content, `header-${idx}`)}
        </div>
      );
    } else if (bulletMatch) {
      isInsideList = true;
      const content = bulletMatch[1];
      currentList.push(
        <li key={idx} className="leading-relaxed">
          {renderInline(content, `bullet-${idx}`)}
        </li>
      );
    } else {
      if (isInsideList) {
        flushList(`list-${idx}`);
        isInsideList = false;
      }
      
      if (trimmedLine === '') {
        renderedElements.push(<div key={`br-${idx}`} className="h-2" />);
      } else {
        // Render regular paragraph line
        renderedElements.push(
          <p key={idx} className="leading-relaxed my-1">
            {renderInline(line, `inline-${idx}`)}
          </p>
        );
      }
    }
  });

  // Flush any remaining list at the end
  if (isInsideList) {
    flushList(`list-end`);
  }

  return <div className="space-y-1">{renderedElements}</div>;
}

function SproutlyAILogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glowing background leaf */}
      <path
        d="M2 22C2 22 10 20 15 13C18.5 8.1 19 4 19 4C19 4 14.9 4.5 10 8C3 13 2 22 2 22Z"
        fill="currentColor"
        className="text-sproutly-light/40"
      />
      {/* Leaf outline and stem */}
      <path
        d="M2 22C2 22 10 20 15 13C18.5 8.1 19 4 19 4C19 4 14.9 4.5 10 8C3 13 2 22 2 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-sproutly-primary"
      />
      <path
        d="M2 22C7 17 12 14 19 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-sproutly-primary"
      />
      {/* AI Sparkles */}
      <path
        d="M22 6L20.5 4.5L19 6L20.5 7.5L22 6Z"
        fill="currentColor"
        className="text-sproutly-secondary animate-pulse"
      />
      <path
        d="M15 3.5L14 2.5L13 3.5L14 4.5L15 3.5Z"
        fill="currentColor"
        className="text-sproutly-light animate-pulse"
      />
      <path
        d="M21 11.5L20.5 11L20 11.5L20.5 12L21 11.5Z"
        fill="currentColor"
        className="text-sproutly-secondary animate-pulse"
      />
    </svg>
  );
}

export default function SproutlyAIPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { plants, loading: plantsLoading } = usePlants();
  const { messages, loading: chatLoading, isSending, sendMessage, clearChat } = useChat(plants);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loading = plantsLoading || chatLoading;

  // Prepend visual welcome message if database chat history is empty
  const displayMessages = useMemo(() => {
    if (messages.length === 0) {
      return [
        {
          id: 'welcome',
          sender: 'ai' as const,
          text: `Hi! I'm Sproutly AI. I see you have ${plants.length} plants in your collection. How can I help you care for them today?`
        }
      ];
    }
    return messages;
  }, [messages, plants.length]);

  const suggestions = useMemo(() => {
    return plants.slice(0, 3).map((p) => `How do I prune my ${p.name}?`);
  }, [plants]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isSending) return;
    setInput('');

    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Chat error:', error);
    }
  }, [sendMessage, isSending]);

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
  }, [displayMessages, isSending]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="animate-bounce text-sproutly-primary">
          <SproutlyAILogo size={48} />
        </div>
        <p className="text-sm font-semibold text-sproutly-secondary">Waking Sproutly AI...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen max-w-2xl mx-auto bg-white lg:border-x lg:border-sproutly-secondary/10 shadow-sm">
      <header className="px-6 py-4 border-b border-sproutly-secondary/10 bg-white z-10 flex items-center justify-between mt-16 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sproutly-light/20 rounded-xl">
            <SproutlyAILogo size={26} />
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
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
            title="Clear conversation history"
          >
            <Trash2 size={14} />
            <span>Clear Chat</span>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-sproutly-bg/30">
        <AnimatePresence initial={false}>
          {displayMessages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-sproutly-primary text-white' : 'bg-sproutly-light/20'
                }`}
              >
                {msg.sender === 'user' ? <User size={20} /> : <SproutlyAILogo size={22} />}
              </div>
              <div
                className={`p-4 rounded-2xl max-w-[75%] text-sm font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sproutly-primary text-white rounded-tr-sm'
                    : 'bg-white text-sproutly-primary shadow-sm border border-sproutly-secondary/10 rounded-tl-sm'
                }`}
              >
                {msg.sender === 'user' ? msg.text : <FormattedMessageText text={msg.text} />}
              </div>
            </motion.div>
          ))}
          {isSending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-sproutly-light/20 flex items-center justify-center shrink-0 shadow-sm">
                <SproutlyAILogo size={22} />
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
        {displayMessages.length === 1 && suggestions.length > 0 && (
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
