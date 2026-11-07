import JSZip from 'jszip';
import { CompressionResult, ImageFileInfo } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image element: ' + e));
    img.src = src;
  });
}

export async function parseImageFile(file: File): Promise<ImageFileInfo> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(dataUrl);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(img.naturalWidth, img.naturalHeight);
  const aspectW = Math.round(img.naturalWidth / divisor);
  const aspectH = Math.round(img.naturalHeight / divisor);
  const aspectRatio = `${aspectW}:${aspectH}`;

  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type || 'image/jpeg',
    width: img.naturalWidth,
    height: img.naturalHeight,
    aspectRatio,
    dataUrl,
  };
}

/**
 * High-quality client-side image compression with target size search
 */
export async function compressImage(
  file: File,
  options: {
    quality?: number; // 0.05 to 1.0
    targetSizeKb?: number; // In Kilobytes (optional)
    outputType?: 'image/jpeg' | 'image/webp' | 'image/png';
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<CompressionResult> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(dataUrl);

  let { naturalWidth: width, naturalHeight: height } = img;
  if (options.maxWidth && width > options.maxWidth) {
    height = Math.round((height * options.maxWidth) / width);
    width = options.maxWidth;
  }
  if (options.maxHeight && height > options.maxHeight) {
    width = Math.round((width * options.maxHeight) / height);
    height = options.maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not obtain canvas 2D rendering context');

  // Preserve smooth interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Determine output mime type
  let mimeType = options.outputType;
  if (!mimeType) {
    mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  }

  // Handle white background fill for JPEG if source has transparency
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const getBlob = (q: number): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob || new Blob([], { type: mimeType }));
        },
        mimeType,
        q
      );
    });
  };

  // If a target size is requested, iteratively find the best quality setting
  if (options.targetSizeKb && options.targetSizeKb > 0) {
    const targetBytes = options.targetSizeKb * 1024;

    // PNG does not support lossy quality parameter in canvas.toBlob, so switch to WebP or JPEG if PNG cannot shrink
    if (mimeType === 'image/png') {
      mimeType = 'image/webp';
    }

    let minQ = 0.05;
    let maxQ = 0.98;
    let bestBlob: Blob | null = null;
    let bestQ = 0.8;
    let iterations = 0;

    while (iterations < 7) {
      const midQ = (minQ + maxQ) / 2;
      const testBlob = await getBlob(midQ);

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        bestQ = midQ;
        minQ = midQ; // Try to get higher quality while staying under target
      } else {
        maxQ = midQ; // File is too big, lower quality
      }
      iterations++;
    }

    // Fallback if even min quality didn't get below target
    if (!bestBlob) {
      bestBlob = await getBlob(0.08);
      bestQ = 0.08;
    }

    const targetHit = bestBlob.size <= targetBytes;
    const savings = Math.max(0, Math.round(((file.size - bestBlob.size) / file.size) * 100));
    const outDataUrl = URL.createObjectURL(bestBlob);

    let note: string | undefined;
    if (!targetHit) {
      note = `Target was ${options.targetSizeKb} KB, but minimum clean output reached ${formatBytes(
        bestBlob.size
      )}. Compressing further would cause extreme image distortion.`;
    }

    const ext = (mimeType as string) === 'image/webp' ? '.webp' : (mimeType as string) === 'image/png' ? '.png' : '.jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

    return {
      blob: bestBlob,
      dataUrl: outDataUrl,
      size: bestBlob.size,
      originalSize: file.size,
      savingsPercentage: savings,
      targetHit,
      actualQuality: Math.round(bestQ * 100),
      width,
      height,
      mimeType,
      fileName: `${baseName}_compressed${ext}`,
      note,
    };
  }

  // Regular quality-based compression
  const quality = options.quality ?? 0.8;
  const blob = await getBlob(quality);
  const outDataUrl = URL.createObjectURL(blob);
  const savings = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

  const ext = mimeType === 'image/webp' ? '.webp' : mimeType === 'image/png' ? '.png' : '.jpg';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

  return {
    blob,
    dataUrl: outDataUrl,
    size: blob.size,
    originalSize: file.size,
    savingsPercentage: savings,
    targetHit: true,
    actualQuality: Math.round(quality * 100),
    width,
    height,
    mimeType,
    fileName: `${baseName}_compressed${ext}`,
  };
}

/**
 * Resize image with precise dimensions and aspect ratio control
 */
export async function resizeImage(
  file: File,
  options: {
    width: number;
    height: number;
    outputType?: 'image/jpeg' | 'image/webp' | 'image/png';
    quality?: number;
  }
): Promise<CompressionResult> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(dataUrl);

  const targetWidth = Math.max(1, Math.round(options.width));
  const targetHeight = Math.max(1, Math.round(options.height));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const mimeType = options.outputType || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const quality = options.quality ?? 0.9;
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b || new Blob([], { type: mimeType })),
      mimeType,
      quality
    );
  });

  const outDataUrl = URL.createObjectURL(blob);
  const savings = Math.round(((file.size - blob.size) / file.size) * 100);

  const ext = mimeType === 'image/webp' ? '.webp' : mimeType === 'image/png' ? '.png' : '.jpg';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

  return {
    blob,
    dataUrl: outDataUrl,
    size: blob.size,
    originalSize: file.size,
    savingsPercentage: savings,
    targetHit: true,
    actualQuality: Math.round(quality * 100),
    width: targetWidth,
    height: targetHeight,
    mimeType,
    fileName: `${baseName}_${targetWidth}x${targetHeight}${ext}`,
  };
}

/**
 * Convert image between JPG, PNG, and WebP formats
 */
export async function convertImage(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality = 0.92
): Promise<CompressionResult> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (targetFormat === 'image/jpeg') {
    // Fill white background for JPEG conversions
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b || new Blob([], { type: targetFormat })),
      targetFormat,
      quality
    );
  });

  const outDataUrl = URL.createObjectURL(blob);
  const savings = Math.round(((file.size - blob.size) / file.size) * 100);

  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  const ext = extMap[targetFormat] || '.jpg';
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

  return {
    blob,
    dataUrl: outDataUrl,
    size: blob.size,
    originalSize: file.size,
    savingsPercentage: savings,
    targetHit: true,
    actualQuality: Math.round(quality * 100),
    width: img.naturalWidth,
    height: img.naturalHeight,
    mimeType: targetFormat,
    fileName: `${baseName}_converted${ext}`,
  };
}

/**
 * Generate a ZIP file containing multiple compressed items
 */
export async function createZipPackage(
  items: { name: string; blob: Blob }[]
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('unicorntools_batch');

  items.forEach((item) => {
    folder?.file(item.name, item.blob);
  });

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Trigger browser file download
 */
export function triggerDownload(urlOrBlob: string | Blob, fileName: string) {
  const url = typeof urlOrBlob === 'string' ? urlOrBlob : URL.createObjectURL(urlOrBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (typeof urlOrBlob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}
