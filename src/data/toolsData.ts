import { ToolMeta } from '../types';

export const TOOLS: ToolMeta[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    path: '/tools/image-compressor',
    tagline: 'Reduce JPG, PNG, and WebP file size without losing quality',
    description:
      'Compress single images with custom quality sliders or specify an exact target size (e.g., 50 KB, 100 KB, 200 KB) for portal uploads.',
    category: 'compress',
    featured: true,
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    path: '/tools/image-resizer',
    tagline: 'Scale image dimensions by pixels or aspect ratio presets',
    description:
      'Resize images accurately with aspect ratio lock and one-click presets for social media, YouTube thumbnails, and form uploads.',
    category: 'resize',
    featured: true,
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    slug: 'image-converter',
    path: '/tools/image-converter',
    tagline: 'Convert between JPG, PNG, and WebP formats instantly',
    description:
      'Fast format transformation with full support for transparent backgrounds when converting between WebP and PNG.',
    category: 'convert',
    featured: true,
  },
  {
    id: 'image-size-checker',
    name: 'Image Size Checker',
    slug: 'image-size-checker',
    path: '/tools/image-size-checker',
    tagline: 'Inspect detailed dimensions, file weight, and compression forecast',
    description:
      'View comprehensive technical metrics, exact pixel dimensions, aspect ratio, and estimated savings if converted to modern formats.',
    category: 'inspect',
    featured: true,
  },
  {
    id: 'batch-image-compressor',
    name: 'Batch Image Compressor',
    slug: 'batch-image-compressor',
    path: '/tools/batch-image-compressor',
    tagline: 'Process multiple images simultaneously and download as ZIP',
    description:
      'Drop dozens of photos, compress them all locally in your browser, track individual progress, and download in a single archive.',
    category: 'compress',
    featured: true,
  },
];
