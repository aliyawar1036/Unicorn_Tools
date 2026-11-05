export type RoutePath =
  | '/'
  | '/tools'
  | '/tools/image-compressor'
  | '/tools/image-resizer'
  | '/tools/image-converter'
  | '/tools/image-size-checker'
  | '/tools/batch-image-compressor'
  | '/about'
  | '/contact'
  | '/faq'
  | '/blog'
  | '/privacy-policy'
  | '/terms'
  | '/disclaimer'
  | '/cookie-policy'
  | string;

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  path: RoutePath;
  tagline: string;
  description: string;
  category: 'compress' | 'resize' | 'convert' | 'inspect';
  badge?: string;
  featured?: boolean;
}

export interface ImageFileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: string;
  dataUrl: string;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  size: number;
  originalSize: number;
  savingsPercentage: number;
  targetHit: boolean;
  actualQuality: number;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
  note?: string;
}

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: CompressionResult;
  error?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  publishedDate: string;
  category: string;
  content: string[];
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  hasConsented: boolean;
  timestamp?: number;
}

export interface SessionHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  fileName: string;
  originalFile?: File;
  originalSize: number;
  processedSize?: number;
  width?: number;
  height?: number;
  previewUrl: string;
  resultBlob?: Blob;
  resultFileName?: string;
  settingsSummary: string;
  timestamp: number;
}
