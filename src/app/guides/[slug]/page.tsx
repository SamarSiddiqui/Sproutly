'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '../../../components/PreLogin/Navbar';
import { Footer } from '../../../components/PreLogin/Footer';
import { useArticle, useArticles } from '../../../hooks/useArticles';
import {
  ArrowLeft,
  Clock,
  Sun,
  Droplets,
  Wind,
  Gauge,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Share2,
  Loader2,
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: article, isLoading } = useArticle(slug);
  const { data: allArticles = [] } = useArticles();

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'login') {
      router.push('/login');
    } else if (state === 'signup') {
      router.push('/signup');
    } else {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sproutly-cream flex flex-col justify-between">
        <Navbar onNavigate={handleNavigate} />
        <main className="pt-36 pb-24 text-center px-6 max-w-lg mx-auto">
          <Loader2 size={36} className="mx-auto text-emerald-600 animate-spin mb-4" />
          <p className="text-sm font-semibold text-sproutly-forest/70">Loading botanical guide...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-sproutly-cream flex flex-col justify-between">
        <Navbar onNavigate={handleNavigate} />
        <main className="pt-36 pb-24 text-center px-6 max-w-lg mx-auto">
          <BookOpen size={48} className="mx-auto text-sproutly-forest/30 mb-4" />
          <h1 className="text-3xl font-serif text-sproutly-forest font-bold mb-3">Guide Not Found</h1>
          <p className="text-sm text-sproutly-forest/70 mb-8">
            The care guide you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sproutly-forest text-sproutly-cream font-semibold text-sm hover:bg-sproutly-forest/90 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Guides Library
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Related articles (excluding current one)
  const relatedArticles = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-sproutly-cream font-inter selection:bg-sproutly-sage selection:text-white flex flex-col justify-between">
      <Navbar onNavigate={handleNavigate} />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-sproutly-forest/60 mb-8">
          <Link href="/guides" className="hover:text-sproutly-forest transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Guides Library
          </Link>
          <span>/</span>
          <span className="text-sproutly-forest/40 truncate max-w-xs">{article.title}</span>
        </div>

        {/* Article Meta Header */}
        <div className="mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-sproutly-sage/10 text-sproutly-forest text-xs font-bold uppercase tracking-wider mb-4">
            {article.category}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif text-sproutly-forest font-bold leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-sproutly-forest/10">
            {/* Author info */}
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar || '/favicon.svg'}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-sproutly-forest/20 shadow-sm shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-sproutly-forest">{article.author.name}</p>
                <p className="text-xs text-sproutly-forest/60">{article.author.role}</p>
              </div>
            </div>

            {/* Read time & date */}
            <div className="flex items-center gap-4 text-xs font-medium text-sproutly-forest/70">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {article.readTime}
              </span>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative h-72 md:h-[420px] w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-sproutly-forest/10">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Key Care Takeaways Callout Box */}
        {article.takeaways && (
          <div className="bg-gradient-to-br from-sproutly-forest to-emerald-950 text-sproutly-cream rounded-3xl p-6 md:p-8 mb-12 shadow-lg border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-serif text-lg font-bold mb-4">
              <Sparkles size={20} /> Quick Care Takeaways
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs md:text-sm">
              {article.takeaways.light && (
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                  <Sun size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Light Needs</span>
                    <span className="text-sproutly-cream/80">{article.takeaways.light}</span>
                  </div>
                </div>
              )}

              {article.takeaways.water && (
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                  <Droplets size={18} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Water Schedule</span>
                    <span className="text-sproutly-cream/80">{article.takeaways.water}</span>
                  </div>
                </div>
              )}

              {article.takeaways.humidity && (
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                  <Wind size={18} className="text-teal-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Humidity</span>
                    <span className="text-sproutly-cream/80">{article.takeaways.humidity}</span>
                  </div>
                </div>
              )}

              {article.takeaways.difficulty && (
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                  <Gauge size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Care Level</span>
                    <span className="text-sproutly-cream/80">{article.takeaways.difficulty}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-lg max-w-none text-sproutly-forest/90 space-y-8 leading-relaxed mb-16">
          <p className="text-xl md:text-2xl font-serif text-sproutly-forest italic leading-relaxed bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-l-4 border-sproutly-sage">
            {article.content.intro}
          </p>

          {article.content.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-serif text-sproutly-forest font-bold pt-4">
                {section.heading}
              </h2>
              <p className="text-base md:text-lg text-sproutly-forest/80 leading-relaxed">
                {section.body}
              </p>

              {section.bullets && (
                <ul className="space-y-2.5 my-4 pl-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-sm md:text-base text-sproutly-forest/90">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-1" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.tip && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-5 rounded-2xl text-sm md:text-base font-medium flex items-start gap-3">
                  <Sparkles size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 font-bold mb-1">Pro Tip:</strong>
                    {section.tip}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-sproutly-forest/10">
            <h3 className="text-xl font-serif font-bold text-sproutly-forest mb-2">Final Summary</h3>
            <p className="text-base md:text-lg text-sproutly-forest/80 leading-relaxed">
              {article.content.conclusion}
            </p>
          </div>
        </article>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-sproutly-forest to-emerald-900 text-sproutly-cream rounded-3xl p-8 md:p-12 text-center mb-16 shadow-xl">
          <h3 className="text-2xl md:text-4xl font-serif text-white font-bold mb-4">
            Never forget a watering day again
          </h3>
          <p className="text-sm md:text-base text-sproutly-cream/80 max-w-xl mx-auto mb-8">
            Add your plants to Sproutly to get custom AI care schedules, watering alerts, and localized weather auto-snooze.
          </p>
          <button
            onClick={() => handleNavigate('signup')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-sproutly-sage text-emerald-950 font-bold hover:shadow-xl transition-transform hover:-translate-y-0.5 text-sm md:text-base"
          >
            Start Tracking Free
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-2xl font-serif text-sproutly-forest font-bold mb-6">Related Guides</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="group bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-sproutly-forest/10 hover:shadow-lg transition-all flex items-center gap-4"
                >
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-sproutly-forest group-hover:text-emerald-800 line-clamp-2 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
