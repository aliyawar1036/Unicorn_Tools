import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CookieConsent } from './components/CookieConsent';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';

// Tools
import { ImageCompressor } from './components/tools/ImageCompressor';
import { ImageResizer } from './components/tools/ImageResizer';
import { ImageConverter } from './components/tools/ImageConverter';
import { ImageSizeChecker } from './components/tools/ImageSizeChecker';
import { BatchCompressor } from './components/tools/BatchCompressor';
import { SessionHistoryProvider, useSessionHistory } from './context/SessionHistoryContext';
import { SessionHistoryDrawer } from './components/SessionHistoryDrawer';

// Meta definitions for SEO per route
const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'UnicornTools — Everyday Tools. Made Simple.',
    desc: 'Free, secure, and private online tools to compress, resize, and convert images directly in your browser. Zero server uploads, lightning fast, and 100% free.',
  },
  '/tools': {
    title: 'All Online Image Utilities — UnicornTools',
    desc: 'Discover our free suite of browser-based utilities: image compressor, resizer, format converter, size inspector, and batch compressor.',
  },
  '/tools/image-compressor': {
    title: 'Image Compressor (Target KB, JPG/PNG/WebP) — UnicornTools',
    desc: 'Compress images to 50KB, 100KB, 200KB or custom targets directly in your browser with zero data uploads.',
  },
  '/tools/image-resizer': {
    title: 'Image Resizer (Pixel Dimensions & Aspect Ratio) — UnicornTools',
    desc: 'Resize images with aspect ratio lock and one-click standard presets for social media, YouTube, and portal forms.',
  },
  '/tools/image-converter': {
    title: 'Image Format Converter (JPG, PNG, WebP) — UnicornTools',
    desc: 'Convert images between JPG, PNG, and WebP instantly while preserving alpha transparency.',
  },
  '/tools/image-size-checker': {
    title: 'Image Size & Dimension Checker — UnicornTools',
    desc: 'Inspect exact image pixel dimensions, file weights, aspect ratio, and forecast optimization savings.',
  },
  '/tools/batch-image-compressor': {
    title: 'Batch Image Compressor (Download as ZIP) — UnicornTools',
    desc: 'Compress multiple photos in one session inside your browser. Download individually or as an organized ZIP archive.',
  },
  '/about': {
    title: 'About Us & Privacy Mission — UnicornTools',
    desc: 'Learn why UnicornTools was built with client-side architecture to provide fast, private utilities without server uploads.',
  },
  '/contact': {
    title: 'Contact Support & Feedback — UnicornTools',
    desc: 'Reach out to the UnicornTools team for feature suggestions, bug reports, and sponsorship inquiries.',
  },
  '/faq': {
    title: 'Frequently Asked Questions — UnicornTools',
    desc: 'Get answers to common questions about image compression, local security, supported formats, and troubleshooting.',
  },
  '/blog': {
    title: 'Guides & Tutorials — UnicornTools',
    desc: 'Helpful tutorials on compressing images to 100 KB, resizing for web forms, WebP format benefits, and Core Web Vitals.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy — UnicornTools',
    desc: 'Full disclosure on our client-side zero-upload architecture, cookie usage, analytics, and data rights.',
  },
  '/terms': {
    title: 'Terms of Service — UnicornTools',
    desc: 'Terms governing the use of UnicornTools free utilities, user verification responsibilities, and intellectual property.',
  },
  '/disclaimer': {
    title: 'Disclaimer — UnicornTools',
    desc: 'Important disclosures regarding image processing variability and independent verification of critical outputs.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy & Consent Settings — UnicornTools',
    desc: 'Learn about essential, analytics, and advertising cookies used on UnicornTools and manage your preferences.',
  },
};

function AppContent() {
  const { history } = useSessionHistory();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('unicorntools_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem('unicorntools_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('unicorntools_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic document title and meta description
  useEffect(() => {
    const meta = PAGE_TITLES[currentPath] || {
      title: 'UnicornTools — Everyday Tools. Made Simple.',
      desc: 'Free, private, and fast online utility suite for image compression, resizing, and format conversion.',
    };

    if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
      const slug = currentPath.replace('/blog/', '');
      document.title = `${slug.replace(/-/g, ' ').toUpperCase()} — UnicornTools`;
    } else {
      document.title = meta.title;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.desc);
    }
  }, [currentPath]);

  const navigate = (path: string) => {
    if (path === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Render current view based on path
  const renderContent = () => {
    if (currentPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      );
    }

    if (currentPath === '/tools') {
      return <ToolsDirectoryPage onNavigate={navigate} />;
    }

    if (currentPath === '/tools/image-compressor') {
      return (
        <div className="py-8 px-4">
          <ImageCompressor />
        </div>
      );
    }

    if (currentPath === '/tools/image-resizer') {
      return (
        <div className="py-8 px-4">
          <ImageResizer />
        </div>
      );
    }

    if (currentPath === '/tools/image-converter') {
      return (
        <div className="py-8 px-4">
          <ImageConverter />
        </div>
      );
    }

    if (currentPath === '/tools/image-size-checker') {
      return (
        <div className="py-8 px-4">
          <ImageSizeChecker />
        </div>
      );
    }

    if (currentPath === '/tools/batch-image-compressor') {
      return (
        <div className="py-8 px-4">
          <BatchCompressor />
        </div>
      );
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/faq') {
      return <FAQPage />;
    }

    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }

    if (currentPath === '/terms') {
      return <TermsPage />;
    }

    if (currentPath === '/disclaimer') {
      return <DisclaimerPage />;
    }

    if (currentPath === '/cookie-policy') {
      return <CookiePolicyPage />;
    }

    // 404 Fallback
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Page Not Found (404)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested page <code className="font-mono text-indigo-600 dark:text-indigo-400">{currentPath}</code> does not exist.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-[#0A0A0A] dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {renderContent()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Session History Drawer */}
      <SessionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onNavigateToTool={navigate}
      />

      {/* Cookie Consent Banner & Settings Modal */}
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <SessionHistoryProvider>
      <AppContent />
    </SessionHistoryProvider>
  );
}
