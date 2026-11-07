export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Privacy' | 'Compression' | 'Troubleshooting';
}

export const FAQS: FAQItem[] = [
  {
    category: 'Privacy',
    question: 'Are my images uploaded to a server or stored online?',
    answer:
      'No. All image operations in UnicornTools—including compression, resizing, format conversion, and metadata inspection—run entirely inside your web browser using HTML5 Canvas and Web Worker technology. Your private photos never leave your device, are never transmitted to our servers, and cannot be accessed by anyone else.',
  },
  {
    category: 'General',
    question: 'Is UnicornTools completely free to use?',
    answer:
      'Yes! All tools on UnicornTools are 100% free with no hidden charges, watermarks, or subscription paywalls. There are no limits on the number of images you can process.',
  },
  {
    category: 'General',
    question: 'Do I need to create an account or register to use the tools?',
    answer:
      'No registration, login, or email address is required. You can start using every tool immediately upon opening the page.',
  },
  {
    category: 'Compression',
    question: 'Which image formats are supported?',
    answer:
      'We currently support the most common web image formats: JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp). You can upload any of these formats and convert seamlessly between them.',
  },
  {
    category: 'Compression',
    question: 'How do I compress an image to a specific target file size (e.g. 50 KB or 100 KB)?',
    answer:
      'Select the Image Compressor, upload your photo, and click on one of the quick presets (50 KB, 100 KB, 200 KB, 500 KB) or type your desired kilobyte threshold into the "Target Size" field. Our engine will calculate the optimal compression ratio automatically to get as close as possible without unacceptable visual loss.',
  },
  {
    category: 'Compression',
    question: 'How do I resize an image to specific dimensions?',
    answer:
      'Open the Image Resizer, drop your file, and type your desired Width and Height in pixels. By default, "Maintain Aspect Ratio" is enabled so changing one dimension adjusts the other proportionately. You can also pick from popular presets like Social Media Profile (400x400), YouTube Thumbnail (1280x720), or Full HD (1920x1080).',
  },
  {
    category: 'Compression',
    question: 'How does format conversion work, and is transparency preserved?',
    answer:
      'Open the Image Format Converter, upload your file, and pick your target format (WebP, PNG, or JPG). When converting from PNG to WebP or vice versa, transparent backgrounds are fully preserved. If you convert transparent images to JPG, a clean white background is automatically applied because the JPG format does not support alpha channels.',
  },
  {
    category: 'Compression',
    question: 'Can I compress multiple images at the same time?',
    answer:
      'Yes, use the Batch Image Compressor tool. You can select multiple files or drag a group of images into the dropzone. Once compressed, you can download individual files or click "Download All as ZIP" to receive a single organized zip archive created directly in your browser.',
  },
  {
    category: 'Troubleshooting',
    question: 'What should I do if an image fails to load or process?',
    answer:
      'Ensure your file is a valid JPG, PNG, or WebP image and that the file size is within your device’s available browser memory (we recommend files under 50 MB for smooth client-side processing). If a file hangs, try refreshing the tab or clearing browser cache.',
  },
  {
    category: 'Troubleshooting',
    question: 'Why did my image not reach the exact target KB size I specified?',
    answer:
      'Every image has an inherent entropy threshold (density of edges, gradients, and fine textures). If an image has extremely high detail or large dimensions, shrinking it to a very low target (e.g. 20 KB) might require dropping quality to unusable levels. In such cases, UnicornTools stops at the cleanest attainable threshold and notifies you with clear recommendations to resize the dimensions first.',
  },
];
