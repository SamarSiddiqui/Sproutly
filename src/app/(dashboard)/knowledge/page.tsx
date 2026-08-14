'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlants } from '../../../hooks/usePlants';
import {
  BookOpen,
  Lightbulb,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function KnowledgeHubPage() {
  const router = useRouter();
  const { plants, loading } = usePlants();
  const [activeCategory, setActiveCategory] = useState('All');
  const [triviaIndex, setTriviaIndex] = useState(0);
  const categories = ['All', 'Pest Control', 'Watering', 'Propagation', 'Soil Health', 'Lighting'];

  const articles = [
    {
      id: 'soil-health',
      category: 'Soil Health',
      title: 'The Secret to Perfect Aeration',
      content: 'Gently poke holes in the topsoil with a chopstick before watering to improve oxygen flow to roots and prevent compaction.',
      readTime: '3 min read',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1416879598555-220013f707f1?auto=format&fit=crop&q=80&w=600',
      relatedCategories: ['Indoor', 'Semi-Shade']
    },
    {
      id: 'pest-control',
      category: 'Pest Control',
      title: 'Organic Neem Oil Spray Guide',
      content: 'Mix 1tsp neem oil with 1L water and a drop of dish soap. Spray every 14 days to prevent mealybugs and spider mites.',
      readTime: '5 min read',
      difficulty: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1595856950275-3453b3d4f195?auto=format&fit=crop&q=80&w=600',
      relatedCategories: ['Direct Sun']
    },
    {
      id: 'watering',
      category: 'Watering',
      title: 'Busting the Pebble Drainage Myth',
      content: 'Adding pebbles to the bottom of a pot actually raises the water table and causes root rot. Use a well-draining soil mix instead.',
      readTime: '4 min read',
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1598282305597-4b71ffebbcbe?auto=format&fit=crop&q=80&w=600',
      relatedCategories: ['Indoor', 'Direct Sun', 'Semi-Shade']
    }
  ];

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const propagationGuides = [
    {
      title: 'Water Propagation',
      plant: 'Money Plant',
      steps: [
        'Cut below a node',
        'Place in clean water',
        'Change water weekly',
        'Pot when roots are 2" long'
      ],
      image: 'https://images.unsplash.com/photo-1610448102431-729457618037?auto=format&fit=crop&q=80&w=400'
    },
    {
      title: 'Soil Propagation',
      plant: 'Jade Plant',
      steps: [
        'Twist off a healthy leaf',
        'Let callous for 3 days',
        'Lay flat on moist soil',
        'Mist occasionally'
      ],
      image: 'https://images.unsplash.com/photo-1603436326446-74e2d65f3168?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const triviaFacts = [
    {
      title: "Plants Can 'Hear' Water",
      fact: "Roots can sense the vibrations of running water moving through pipes or underground springs and will actively grow towards the sound!"
    },
    {
      title: "The Smell of Fresh Cut Grass",
      fact: "That distinctive smell of freshly cut grass is actually a chemical distress signal called 'green leaf volatiles' alerting nearby plants of danger."
    },
    {
      title: "Caffeine is a Defense Mechanism",
      fact: "Plants evolved caffeine to paralyze and kill insects that try to eat them. Humans just happen to like the buzz!"
    },
    {
      title: "Trees Have Their Own Internet",
      fact: "Forests are connected by underground fungal networks called mycorrhizae, which trees use to share nutrients and warn each other about droughts or disease."
    }
  ];

  const generateTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % triviaFacts.length);
  };

  const getRelatedPlants = (categories: string[]) => {
    return plants.filter((p) => categories.includes(p.category)).slice(0, 3);
  };

  const goToPlant = (id: string) => {
    router.push(`/collection?plantId=${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="animate-spin text-sproutly-primary" size={32} />
        <p className="text-sm font-semibold text-sproutly-secondary">Loading guides...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Header Left */}
        <div className="lg:col-span-2 space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-sproutly-primary">
            Knowledge Hub
          </h1>
          <p className="text-lg text-sproutly-secondary font-semibold">
            Master the art of terrace gardening & indoor plant care.
          </p>
        </div>

        {/* Relocated Trivia widget (compact version) */}
        <div className="bg-sproutly-light/10 border border-sproutly-light/20 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-sm">
          <div className="absolute -top-6 -right-6 text-sproutly-light/10 pointer-events-none">
            <Sparkles size={100} />
          </div>
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sproutly-primary font-bold uppercase tracking-wider text-[10px]">
              <Sparkles size={12} className="text-sproutly-primary/80" /> Sproutly Trivia
            </div>
            <h4 className="text-sm font-extrabold text-sproutly-primary leading-tight">
              {triviaFacts[triviaIndex].title}
            </h4>
            <p className="text-xs text-sproutly-secondary font-semibold leading-relaxed line-clamp-3">
              {triviaFacts[triviaIndex].fact}
            </p>
          </div>
          <button
            onClick={generateTrivia}
            className="mt-3 bg-sproutly-primary text-white text-xs font-bold py-2 px-4 rounded-xl w-fit hover:bg-sproutly-primary/95 transition-all active:scale-95 shadow-sm"
          >
            New Fact
          </button>
        </div>
      </div>

      {/* Featured Hero Banner */}
      <section className="relative w-full h-[350px] lg:h-[400px] rounded-[32px] overflow-hidden shadow-sm group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?auto=format&fit=crop&q=80&w=1200"
          alt="Featured Article"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sproutly-primary/90 via-sproutly-primary/40 to-transparent" />
        
        <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-end">
          <div className="flex gap-3 mb-4">
            <span className="bg-sproutly-light text-sproutly-primary text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <BookOpen size={14} /> 5 min read
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight max-w-2xl">
            The Ultimate Guide to Overwintering Terrace Plants
          </h2>
          
          <p className="text-white/80 text-sm lg:text-base font-medium max-w-xl mb-6 line-clamp-2">
            Winter is coming, but your plants don't have to suffer. Learn how to protect your tropicals, manage watering cycles, and keep your terrace thriving during the cold months.
          </p>
          
          <button className="bg-white text-sproutly-primary font-bold px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl w-fit flex items-center gap-2 hover:bg-sproutly-bg transition-colors text-sm lg:text-base">
            Read Article <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat
                ? 'bg-sproutly-primary text-white shadow-md'
                : 'bg-white text-sproutly-secondary hover:bg-sproutly-bg border border-sproutly-secondary/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Latest Articles */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-sproutly-light" />
          Latest Articles
        </h2>
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12 text-sproutly-secondary font-medium">
            No articles found for this category yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const related = getRelatedPlants(article.relatedCategories);
            return (
              <div
                key={article.id}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-sproutly-bg flex flex-col h-full group cursor-pointer hover:shadow-md transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-sproutly-primary">
                    {article.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex gap-3 mb-3">
                    <span className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb size={12} /> {article.readTime}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      article.difficulty === 'Beginner' ? 'text-sproutly-light' : 
                      article.difficulty === 'Intermediate' ? 'text-sproutly-warning' : 'text-sproutly-urgent'
                    }`}>
                      • {article.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-sproutly-primary mb-3 leading-tight group-hover:text-sproutly-light transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-sproutly-secondary leading-relaxed font-medium mb-6 flex-1">
                    {article.content}
                  </p>

                {related.length > 0 && (
                  <div className="mt-auto pt-5 border-t border-sproutly-bg">
                    <span className="text-xs font-bold text-sproutly-secondary uppercase tracking-wider mb-3 block">
                      Applies to your plants:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {related.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => goToPlant(p.id)}
                          className="flex items-center gap-2 bg-sproutly-bg px-3 py-1.5 rounded-xl text-xs font-bold text-sproutly-primary hover:bg-sproutly-light/20 transition-colors"
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cutting & Growth Lab */}
      <section>
        <h2 className="text-xl font-bold text-sproutly-primary mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-sproutly-light" />
          Cutting & Growth Lab
        </h2>

        <div className="flex lg:grid lg:grid-cols-2 overflow-x-auto lg:overflow-visible gap-6 pb-4 lg:pb-0 snap-x hide-scrollbar">
          {propagationGuides.map((guide, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-80 lg:w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-sproutly-bg flex flex-col"
            >
              <div className="h-48 relative">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-sm font-semibold opacity-90 mb-1">
                    {guide.plant}
                  </div>
                  <h3 className="font-bold text-2xl">{guide.title}</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <ul className="space-y-4 mb-6">
                  {guide.steps.map((step, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-start gap-4 text-sm font-medium text-sproutly-primary"
                    >
                      <div className="w-6 h-6 rounded-full bg-sproutly-bg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
                <button 
                  type="button"
                  className="w-full mt-auto py-3.5 bg-sproutly-bg text-sproutly-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-sproutly-light/20 transition-colors"
                >
                  Read Full Guide <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Optimization Note */}
      <footer className="pt-2 border-t border-sproutly-secondary/10 text-[11px] font-bold text-sproutly-secondary">
        Optimization Note: Propagation guides are rendered as static, optimized HTML components avoiding redundant hydration work.
      </footer>
    </div>
  );
}
