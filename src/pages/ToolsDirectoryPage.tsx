import React, { useState } from 'react';
import { Search, Zap, Maximize2, RefreshCw, Info, Layers, ArrowRight } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { AdSlot } from '../components/AdSlot';

interface ToolsDirectoryPageProps {
  onNavigate: (path: string) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'compress' | 'resize' | 'convert' | 'inspect'>('all');
  const [search, setSearch] = useState('');

  const toolVisuals: Record<string, { icon: React.ReactNode; bg: string }> = {
    'image-compressor': {
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40',
    },
    'image-resizer': {
      icon: <Maximize2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-100 dark:border-violet-900/40',
    },
    'image-converter': {
      icon: <RefreshCw className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-100 dark:border-sky-900/40',
    },
    'image-size-checker': {
      icon: <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40',
    },
    'batch-image-compressor': {
      icon: <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40',
    },
  };

  const filteredTools = TOOLS.filter((t) => {
    const matchesCategory = filter === 'all' || t.category === filter;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tagline.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Online Utilities
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Fast, browser-based tools to compress, scale, convert, and inspect your images with zero uploads and total privacy.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'compress', label: 'Compression' },
            { id: 'resize', label: 'Resizing' },
            { id: 'convert', label: 'Conversion' },
            { id: 'inspect', label: 'Inspection' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filter === cat.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const visual = toolVisuals[tool.slug] || {
            icon: <Zap className="w-5 h-5 text-indigo-600" />,
            bg: 'bg-indigo-50 border-indigo-100',
          };
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.path)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${visual.bg}`}>
                  {visual.icon}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      <AdSlot placement="content-inline" />
    </div>
  );
};
