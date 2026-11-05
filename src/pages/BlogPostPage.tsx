import React from 'react';
import { ArrowLeft, Clock, Calendar, Zap, ArrowRight, Share2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { AdSlot } from '../components/AdSlot';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-sm text-slate-500">The requested guide does not exist or has moved.</p>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {post.category}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span>·</span>
          <span>{post.publishedDate}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {post.description}
        </p>
      </div>

      <AdSlot placement="content-inline" />

      {/* Content paragraphs */}
      <div className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        {post.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Recommended Tool Callout */}
      <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
          <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Put this guide into practice</span>
        </div>
        <p className="text-xs text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
          Need to test these techniques? UnicornTools provides free, 100% private in-browser compression and resizing without watermarks or server uploads.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/tools/image-compressor')}
          className="mt-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <span>Open Image Compressor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <AdSlot placement="tool-bottom" />
    </article>
  );
};
