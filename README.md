# UnicornTools — Everyday Tools. Made Simple.

UnicornTools is a modern, high-performance, privacy-first online utility suite for image compression, resizing, format conversion, and technical inspection.

All image operations execute **100% locally on the user's device** using the HTML5 Canvas API and Web Workers. Zero file bytes are transmitted or stored on remote servers.

---

## Features & Utilities

1. **Image Compressor (`/tools/image-compressor`)**
   - Precise target file size search (e.g. 50 KB, 100 KB, 200 KB, 500 KB or custom).
   - Fine-grained quality slider (5% to 98%).
   - Interactive Before/After slider & side-by-side visual preview.
   - Intelligent degradation limits preventing extreme visual distortion.

2. **Image Resizer (`/tools/image-resizer`)**
   - Custom pixel dimensions with aspect ratio lock/unlock.
   - Standard presets for YouTube thumbnails (1280x720), Full HD (1920x1080), Passport (600x600), and Mobile Stories (1080x1920).
   - High-quality bicubic canvas resampling.

3. **Image Format Converter (`/tools/image-converter`)**
   - Fast format conversion between JPG, PNG, and WebP.
   - Preserves alpha transparency when converting between PNG and WebP.
   - Automatic clean white fill when converting transparent images to JPG.

4. **Image Size Checker (`/tools/image-size-checker`)**
   - In-depth technical metrics: exact dimensions, aspect ratio, file weight, megapixels.
   - Algorithmic compression potential forecasts (WebP, JPEG 80%, downscaled 1200px).
   - Instant clipboard report copying and `.txt` report download.

5. **Batch Image Compressor (`/tools/batch-image-compressor`)**
   - Multi-file drag-and-drop queue (10, 20, 50+ photos).
   - Individual progress tracking and per-file error resilience.
   - Single-click **Download All as ZIP** powered by JSZip.

6. **Local Session History & Re-processing**
   - Automatically tracks processed images within the current browser session.
   - Per-tool **Session History** panel showing output dimensions, file weight comparisons, and settings summaries.
   - **One-Click Re-download**: Instantly download any processed image again.
   - **One-Click Re-process**: Reload any previously processed file straight into the active tool workspace without looking for the file on your local drive.
   - **Global Session Drawer**: Accessible anytime from the top navigation header with a live processed file counter.

---

## Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 with custom dark mode variant
- **Typography:** Plus Jakarta Sans & JetBrains Mono
- **Icons:** Lucide React
- **Archive Generation:** JSZip
- **SEO & Compliance:** Schema.org JSON-LD WebApplication metadata, sitemap.xml, robots.txt, OpenGraph & Twitter Cards, GDPR/CCPA compliant cookie consent.

---

## Installation & Development

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/unicorntools.git
cd unicorntools

# Install dependencies
npm install

# Start development server
npm run dev
```

The application runs on `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APP_URL` | Canonical origin URL where the app is hosted | `https://unicorntools.app` |
| `VITE_ADSENSE_CLIENT_ID` | Optional Google AdSense Publisher ID (e.g., `ca-pub-1234567890`) | `""` |
| `VITE_CONTACT_EMAIL` | Public contact email address displayed across the site | `support@unicorntools.app` |
| `VITE_CONTACT_BACKEND_ENDPOINT`| Optional backend webhook URL for contact form submissions | `""` |

---

## Google AdSense Setup

1. Add your Google AdSense Publisher ID in `.env`:
   ```bash
   VITE_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
   ```
2. Update `/public/ads.txt` with your verified publisher ID:
   ```txt
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
3. Advertisements are placed in dedicated `AdSlot` components separated from download buttons and action triggers to prevent accidental clicks.

---

## Contact Form Configuration

- The contact form provides client-side and server-side validation, anti-bot honeypot protection, and accessible form labels.
- If `VITE_CONTACT_BACKEND_ENDPOINT` is configured, inquiries are dispatched via HTTP POST with JSON payload.
- Otherwise, inquiries are logged and validated with clear user feedback and fallback instructions to email the configured support address.

---

## Deployment Instructions

### Production Build

```bash
npm run build
```

This generates an optimized static bundle in the `dist/` directory.

### Deploying to Cloud Run / Vercel / Netlify / Firebase Hosting

The application is a standard Vite Single Page Application (SPA). Ensure single-page routing rewrites all unknown routes to `/index.html`.

For Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## License

Apache-2.0 License.
