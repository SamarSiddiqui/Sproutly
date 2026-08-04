'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/PreLogin/Navbar';
import { Footer } from '../../components/PreLogin/Footer';
import { ARTICLES, Article } from '../../data/articles';
import { Search, BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Indoor Plants', 'Watering & Soil', 'Troubleshooting', 'Propagation', 'Balcony & Outdoor'] as const;

export default function GuidesListingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'login') {
      router.push('/login');
    } else if (state === 'signup') {
      router.push('/signup');
    } else {
      router.push('/');
    }
  };

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white flex flex-col justify-between">
      <Navbar onNavigate={handleNavigate} />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-sm font-semibold mb-6">
            <BookOpen size={16} className="text-emerald-600" />
            Sproutly Botanical Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-sproutly-forest mb-6">
            Plant Guides & <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sproutly-sage to-emerald-700">Expert Tutorials</span>
          </h1>
          <p className="text-lg text-sproutly-forest/70 leading-relaxed">
            Everything you need to keep your houseplants thriving, diagnose symptoms, and master urban plant propagation.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sproutly-forest/40" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Monstera, Overwatering, Propagation)..."
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white/80 backdrop-blur-md border border-sproutly-forest/15 text-sproutly-forest placeholder:text-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage/50 shadow-sm text-base transition-all"
            />
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-sproutly-forest text-sproutly-cream shadow-md scale-105'
                    : 'bg-white/60 text-sproutly-forest/70 hover:bg-white hover:text-sproutly-forest border border-sproutly-forest/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-sproutly-forest/10 max-w-xl mx-auto">
            <BookOpen size={40} className="mx-auto text-sproutly-forest/30 mb-4" />
            <h3 className="text-xl font-serif text-sproutly-forest font-bold mb-2">No guides found</h3>
            <p className="text-sm text-sproutly-forest/60">Try searching for another keyword or clearing your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-sproutly-forest text-sproutly-cream text-xs font-semibold hover:bg-sproutly-forest/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-sproutly-forest/10 shadow-sm hover:shadow-xl hover:border-sproutly-sage/30 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-sproutly-forest/80 backdrop-blur-md text-sproutly-cream text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-xs text-sproutly-forest/60 mb-3">
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-sproutly-forest group-hover:text-emerald-800 transition-colors mb-3 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-sm text-sproutly-forest/70 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Author & Footer CTA */}
                <div className="px-6 md:px-8 pb-6 pt-4 border-t border-sproutly-forest/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-sproutly-forest/20"
                    />
                    <span className="text-xs font-medium text-sproutly-forest/80">{article.author.name}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sproutly-forest group-hover:text-emerald-700 transition-colors">
                    Read
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
