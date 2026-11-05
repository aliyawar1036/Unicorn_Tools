import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  Maximize2,
  RefreshCw,
  Info,
  Layers,
  ChevronRight,
  CheckCircle,
  FileCheck2,
  Cpu,
  Sliders,
} from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { FAQS } from '../data/faqData';
import { BLOG_POSTS } from '../data/blogData';
import { AdSlot } from '../components/AdSlot';
import { ImageCompressor } from '../components/tools/ImageCompressor';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTools, setRecentTools] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('unicorntools_recent');
      if (saved) {
        setRecentTools(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Diverse, polished icon colors (Lavender, Sky, Indigo, Mint, Peach)
  const toolCardStyles: Record<
    string,
    { iconBg: string; iconColor: string; icon: React.ReactNode }
  > = {
    'image-compressor': {
      iconBg: 'bg-violet-50 dark:bg-violet-950/60',
      iconColor: 'text-violet-600 dark:text-violet-400',
      icon: <Zap className="w-5 h-5" />,
    },
    'image-resizer': {
      iconBg: 'bg-sky-50 dark:bg-sky-950/60',
      iconColor: 'text-sky-600 dark:text-sky-400',
      icon: <Maximize2 className="w-5 h-5" />,
    },
    'image-converter': {
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      icon: <RefreshCw className="w-5 h-5" />,
    },
    'image-size-checker': {
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: <Info className="w-5 h-5" />,
    },
    'batch-image-compressor': {
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: <Layers className="w-5 h-5" />,
    },
  };

  const handleToolClick = (path: string, slug: string) => {
    try {
      const updated = Array.from(new Set([slug, ...recentTools])).slice(0, 4);
      localStorage.setItem('unicorntools_recent', JSON.stringify(updated));
      setRecentTools(updated);
    } catch {
      // ignore
    }
    onNavigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenSearch();
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-6 overflow-hidden">
        {/* Subtle, restrained indigo-to-violet gradient behind a small part of the hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[280px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>UnicornTools · High-Speed Client Utilities</span>
          </div>

          {/* New headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-[1.12] text-balance">
            Your Everyday Tools, All in One Place
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-[#64748B] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compress, resize and convert images with simple, free online tools. Fast, secure and ready whenever you need them.
          </p>

          {/* Large, Elegant Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto relative flex items-center shadow-xs"
          >
            <div className="absolute left-4.5 text-slate-400 pointer-events-none">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={onOpenSearch}
              placeholder="Search tools (e.g. compress 100kb, resize passport, webp)..."
              className="w-full pl-12 pr-32 py-3.5 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#111827] dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-xs"
              readOnly
            />
            <button
              type="button"
              onClick={onOpenSearch}
              className="absolute right-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/about')}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-800 rounded-xl transition-all"
            >
              Why Local Processing?
            </button>
          </div>

          {/* Tasteful abstract productivity visual indicator */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero server uploads</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Instant client speed</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-violet-600" />
              <span>100% Free forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot: below hero section */}
      <div className="max-w-5xl mx-auto px-4">
        <AdSlot placement="homepage-below-hero" />
      </div>

      {/* 2. FEATURED TOOLS GRID */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
              Everyday Utility Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-0.5">
              Purpose-built tools running locally on your device for fast, private results.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/tools')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Utilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const style = toolCardStyles[tool.slug] || {
              iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
              iconColor: 'text-indigo-600 dark:text-indigo-400',
              icon: <Zap className="w-5 h-5" />,
            };

            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool.path, tool.slug)}
                className="group cursor-pointer bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    {style.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED IMAGE COMPRESSION TOOL (Immediate interactive workspace) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Interactive Preview
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white mt-0.5">
                Image Compressor
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/tools/image-compressor')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Fullscreen Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ImageCompressor />
        </div>
      </section>

      {/* 4. RECENTLY USED TOOLS (if any in session/localStorage) */}
      {recentTools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Recently Used Tools
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {recentTools.map((slug) => {
                const matched = TOOLS.find((t) => t.slug === slug);
                if (!matched) return null;
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => onNavigate(matched.path)}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{matched.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE UNICORNTOOLS? */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
            Designed for Performance &amp; Privacy
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
            A modern utility suite engineered to handle everyday files without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Files are processed in temporary browser memory. Your private photos never leave your device and cannot be accessed by anyone else.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              Hardware Accelerated
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Leverage your local CPU and GPU for instant calculations without upload wait times or backend network queues.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              No Signups or Paywalls
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              No credit card requirements, subscriptions, or watermarks. Clean, free utilities available to everyone worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400">
            Simple 3-step workflow for all everyday image tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              01. Select &amp; Drop
            </span>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              Upload Files
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Drag-and-drop single images or batch collections directly into the secure local drop zone.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              02. Customize
            </span>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              Fine-Tune Settings
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Pick target dimensions, kilobyte caps (e.g. 50 KB or 100 KB), or convert formats with instant feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              03. Export
            </span>
            <h3 className="text-base font-bold text-[#111827] dark:text-white">
              Download Output
            </h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Review before-and-after visual previews and save the optimized files or download all as a ZIP archive.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS TEASER */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Clear answers regarding privacy, quality, and supported formats.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/faq')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {FAQS.slice(0, 4).map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 shadow-xs space-y-1.5"
            >
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                {faq.question}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HELPFUL GUIDES & BLOG TEASER */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white">
              Helpful Guides &amp; Tutorials
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Practical walkthroughs on hitting portal limits, web optimization, and modern formats.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <article
              key={post.slug}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {post.category} · {post.readTime}
                </div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{post.publishedDate}</span>
                <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform font-medium">
                  Read &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl border border-indigo-900/50">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>100% Free · No Registration Needed</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Optimize Your Files?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            No installation, no account creation, and zero server uploads. Clean, reliable utilities ready on your browser right now.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/tools')}
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore All 5 Utilities</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
