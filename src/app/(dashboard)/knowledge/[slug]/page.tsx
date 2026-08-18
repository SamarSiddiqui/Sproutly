'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useArticle, useArticles } from '../../../../hooks/useArticles';
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Sun,
  Droplets,
  Wind,
  Gauge,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function DashboardArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: article, isLoading } = useArticle(slug);
  const { data } = useArticles();
  const articles = data?.articles || [];

  if (isLoading) {
    return (
      <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 size={36} className="text-sproutly-primary animate-spin" />
        <p className="text-sm font-semibold text-sproutly-secondary">Loading botanical guide...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 max-w-lg mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-sproutly-primary">Guide Not Found</h1>
        <p className="text-sproutly-secondary font-medium">
          The care guide you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sproutly-primary text-white font-bold text-sm hover:bg-sproutly-secondary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  // Related articles (excluding current one)
  const relatedArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="pt-20 pb-24 lg:pt-8 lg:pb-8 px-4 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-sproutly-secondary/80">
        <Link href="/knowledge" className="hover:text-sproutly-primary transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Knowledge Hub
        </Link>
        <span>/</span>
        <span className="text-sproutly-primary/60 truncate max-w-xs">{article.title}</span>
      </div>

      {/* Article Meta Header */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-sproutly-light/20 text-sproutly-primary text-xs font-bold uppercase tracking-wider">
          {article.category}
        </div>

        <h1 className="text-3xl md:text-5xl font-serif text-sproutly-primary font-bold leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-sproutly-secondary/15">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar || '/favicon.svg'}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border border-sproutly-secondary/20 shadow-sm shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-sproutly-primary">{article.author.name}</p>
              <p className="text-xs text-sproutly-secondary font-medium">{article.author.role}</p>
            </div>
          </div>

          {/* Read time & date */}
          <div className="flex items-center gap-4 text-xs font-bold text-sproutly-secondary">
            <span className="flex items-center gap-1">
              <Clock size={14} /> {article.readTime}
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative h-72 md:h-[420px] w-full rounded-3xl overflow-hidden shadow-sm border border-sproutly-secondary/5">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Key Care Takeaways Callout Box */}
      {article.takeaways && (
        <div className="bg-gradient-to-br from-sproutly-primary to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-300 font-serif text-lg font-bold mb-4">
            <Sparkles size={20} /> Quick Care Takeaways
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs md:text-sm">
            {article.takeaways.light && (
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                <Sun size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Light Needs</span>
                  <span className="text-emerald-100/80">{article.takeaways.light}</span>
                </div>
              </div>
            )}

            {article.takeaways.water && (
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                <Droplets size={18} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Water Schedule</span>
                  <span className="text-emerald-100/80">{article.takeaways.water}</span>
                </div>
              </div>
            )}

            {article.takeaways.humidity && (
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                <Wind size={18} className="text-teal-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Humidity</span>
                  <span className="text-emerald-100/80">{article.takeaways.humidity}</span>
                </div>
              </div>
            )}

            {article.takeaways.difficulty && (
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                <Gauge size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Care Level</span>
                  <span className="text-emerald-100/80">{article.takeaways.difficulty}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Article Body Content */}
      <article className="max-w-none text-sproutly-primary/90 space-y-8 leading-relaxed mb-16">
        <p className="text-lg md:text-xl font-serif text-sproutly-primary italic leading-relaxed bg-white p-6 rounded-2xl border-l-4 border-sproutly-primary/30 shadow-sm">
          {article.content.intro}
        </p>

        {article.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif text-sproutly-primary font-bold pt-4">
              {section.heading}
            </h2>
            <p className="text-base md:text-lg text-sproutly-secondary leading-relaxed">
              {section.body}
            </p>

            {section.bullets && (
              <ul className="space-y-2.5 my-4 pl-2">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 text-sm md:text-base text-sproutly-primary">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.tip && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-5 rounded-2xl text-sm md:text-base font-semibold flex items-start gap-3 shadow-sm">
                <Sparkles size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-950 font-bold mb-1">Pro Tip:</strong>
                  {section.tip}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-6 border-t border-sproutly-secondary/15">
          <h3 className="text-xl font-serif font-bold text-sproutly-primary mb-2">Final Summary</h3>
          <p className="text-base md:text-lg text-sproutly-secondary leading-relaxed">
            {article.content.conclusion}
          </p>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pt-4">
          <h3 className="text-2xl font-serif text-sproutly-primary font-bold mb-6">Related Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/knowledge/${rel.slug}`}
                className="group bg-white rounded-2xl p-5 border border-sproutly-secondary/10 hover:shadow-md transition-all flex items-center gap-4"
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
                  <h4 className="font-serif text-sm font-bold text-sproutly-primary group-hover:text-emerald-800 line-clamp-2 transition-colors">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
