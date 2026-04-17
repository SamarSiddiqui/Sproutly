import React, { useEffect, useState, useRef } from 'react';
import { usePlants } from '../context/PlantContext';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}
export const VerdantAI: React.FC = () => {
  const { plants, aiContext, setAiContext } = usePlants();
  const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    sender: 'ai',
    text: `Hi! I'm Verdant AI. I see you have ${plants.length} plants in your collection. How can I help you care for them today?`
  }]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestions = plants.
  slice(0, 3).
  map((p) => `How do I prune my ${p.name}?`);
  useEffect(() => {
    if (aiContext) {
      handleSend(aiContext);
      setAiContext(''); // Clear context after using it
    }
  }, [aiContext]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      let responseText =
      "That's a great question! Make sure to check the soil moisture first. If you need specific guidance, check the Care Cycle tab.";
      if (
      text.toLowerCase().includes('prune') &&
      text.toLowerCase().includes('bougainvillea'))
      {
        responseText =
        'For your Bougainvillea, prune right after its flowering cycle ends. Cut back the long, leggy stems to encourage bushier growth and more blooms next season. Wear gloves, those thorns are sharp!';
      } else if (
      text.toLowerCase().includes('water') ||
      text.toLowerCase().includes('watering'))
      {
        responseText =
        "Always check the top 2 inches of soil. If it's dry, give it a thorough watering until it drains out the bottom. Don't let it sit in standing water!";
      } else if (text.toLowerCase().includes('fertilize')) {
        responseText =
        'Use a balanced, water-soluble fertilizer diluted to half strength during the active growing season. Pause fertilizing during winter dormancy.';
      }
      setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText
      }]
      );
      setIsTyping(false);
    }, 1500);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-screen max-w-2xl mx-auto bg-white lg:border-x lg:border-verdant-secondary/10 shadow-sm">
      <header className="px-6 py-4 border-b border-verdant-secondary/10 bg-white z-10 flex items-center justify-between mt-16 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-verdant-light/20 rounded-xl text-verdant-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bold text-verdant-primary text-lg">
              Verdant AI
            </h1>
            <p className="text-xs text-verdant-secondary font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Knows your {plants.length} plants
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-verdant-bg/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) =>
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            key={msg.id}
            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            
              <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-verdant-primary text-white' : 'bg-verdant-light/30 text-verdant-primary'}`}>
              
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
              className={`p-4 rounded-2xl max-w-[75%] text-sm font-medium leading-relaxed ${msg.sender === 'user' ? 'bg-verdant-primary text-white rounded-tr-sm' : 'bg-white text-verdant-primary shadow-sm border border-verdant-secondary/10 rounded-tl-sm'}`}>
              
                {msg.text}
              </div>
            </motion.div>
          )}
          {isTyping &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="flex gap-4">
            
              <div className="w-10 h-10 rounded-full bg-verdant-light/30 text-verdant-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white p-5 rounded-2xl rounded-tl-sm shadow-sm border border-verdant-secondary/10 flex gap-1.5 items-center">
                <div
                className="w-2 h-2 bg-verdant-secondary/50 rounded-full animate-bounce"
                style={{
                  animationDelay: '0ms'
                }} />
              
                <div
                className="w-2 h-2 bg-verdant-secondary/50 rounded-full animate-bounce"
                style={{
                  animationDelay: '150ms'
                }} />
              
                <div
                className="w-2 h-2 bg-verdant-secondary/50 rounded-full animate-bounce"
                style={{
                  animationDelay: '300ms'
                }} />
              
              </div>
            </motion.div>
          }
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 lg:p-6 bg-white border-t border-verdant-secondary/10 mb-16 lg:mb-0">
        {messages.length === 1 &&
        <div className="flex flex-wrap gap-2 pb-4">
            {suggestions.map((s, i) =>
          <button
            key={i}
            onClick={() => handleSend(s)}
            className="bg-verdant-bg text-verdant-primary text-xs font-bold px-4 py-2.5 rounded-full border border-verdant-secondary/20 hover:bg-verdant-light/20 transition-colors">
            
                {s}
              </button>
          )}
          </div>
        }
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about your garden..."
            className="w-full bg-verdant-bg/50 border border-verdant-secondary/20 rounded-full py-4 pl-5 pr-14 text-sm font-medium focus:outline-none focus:border-verdant-primary text-verdant-primary placeholder:text-verdant-secondary/50" />
          
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-2 p-2.5 bg-verdant-primary text-white rounded-full disabled:opacity-50 disabled:bg-verdant-secondary transition-colors">
            
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>);

};