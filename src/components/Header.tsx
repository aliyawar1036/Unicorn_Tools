import React, { useState } from 'react';
import { UnicornLogo } from './UnicornLogo';
import { Search, Sun, Moon, Menu, X, ArrowUpRight, History } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenHistory,
  historyCount = 0,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Tools', path: '/tools' },
    { label: 'Compressor', path: '/tools/image-compressor' },
    { label: 'Resizer', path: '/tools/image-resizer' },
    { label: 'Converter', path: '/tools/image-converter' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Brand Wordmark & Minimal Logo */}
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="flex items-center text-left focus:outline-none whitespace-nowrap shrink-0 group"
          >
            <UnicornLogo size="md" />
          </button>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Search, History, Theme, Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Rounded Search Bar */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="px-3 py-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-full bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-2 text-xs"
              title="Search tools (Ctrl+K)"
              aria-label="Search tools"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">Search tools...</span>
              <kbd className="hidden lg:inline text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-400 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Session History Trigger */}
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="Recent session images"
                aria-label="View recent session history"
              >
                <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden xl:inline text-xs">Recent</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white leading-none">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => handleLinkClick('/tools')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all whitespace-nowrap shadow-xs hover:shadow-sm"
            >
              <span>Explore Tools</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] px-4 py-4 space-y-1.5">
          {navLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => handleLinkClick(link.path)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentPath === link.path
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/contact')}
              className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/tools')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Explore All 5 Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
