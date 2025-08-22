# GitHub Pages Performance Optimization Guide

Since GitHub Pages doesn't support `.htaccess` files, here are alternative approaches to optimize caching and performance:

## 1. File Naming Strategy for Cache Busting

Update your file references to include version numbers:

```html
<!-- Instead of: -->
<link rel="stylesheet" href="style.css" />
<script src="main.js"></script>

<!-- Use versioned files: -->
<link rel="stylesheet" href="style.css?v=1.0.1" />
<script src="main.js?v=1.0.1"></script>
```

## 2. GitHub Actions for Asset Optimization

Create `.github/workflows/optimize.yml`:

```yaml
name: Optimize Assets

on:
  push:
    branches: [ main ]

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install -g imagemin-cli imagemin-webp imagemin-avif
        npm install -g terser clean-css-cli
    
    - name: Optimize images
      run: |
        imagemin assets/*.jpg --out-dir=assets/ --plugin=webp
        imagemin assets/*.jpg --out-dir=assets/ --plugin=avif
    
    - name: Minify CSS and JS
      run: |
        cleancss -o style.min.css style.css
        terser main.js -o main.min.js
    
    - name: Commit optimized files
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add .
        git commit -m "Optimize assets" || exit 0
        git push
```

## 3. Service Worker for Advanced Caching

Create `sw.js` in your root directory:

```javascript
const CACHE_NAME = 'portfolio-v1.0.1';
const urlsToCache = [
  '/',
  '/style.css',
  '/main.js',
  '/assets/Myphoto.webp',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

Then register it in your HTML:

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
</script>
```

## 4. Image Conversion Commands

Use these commands to create WebP and AVIF versions:

```bash
# Convert to WebP
cwebp -q 85 assets/Myphoto.jpg -o assets/Myphoto.webp

# Convert to AVIF
avifenc --min 20 --max 30 assets/Myphoto.jpg assets/Myphoto.avif

# Create multiple sizes
cwebp -q 85 -resize 400 0 assets/Myphoto.jpg -o assets/Myphoto-400.webp
cwebp -q 85 -resize 600 0 assets/Myphoto.jpg -o assets/Myphoto-600.webp
cwebp -q 85 -resize 800 0 assets/Myphoto.jpg -o assets/Myphoto-800.webp
```

## 5. Alternative Hosting Platforms

For better caching control, consider migrating to:

- **Netlify**: Supports `_headers` file and automatic asset optimization
- **Vercel**: Built-in performance optimizations and edge caching
- **Cloudflare Pages**: Advanced caching rules and image optimization

## 6. CDN Integration

Use a CDN like Cloudflare to proxy your GitHub Pages:

1. Point your domain to Cloudflare
2. Set up page rules for caching:
   - `yoursite.com/*.css` → Cache Level: Cache Everything, Edge TTL: 1 year
   - `yoursite.com/*.js` → Cache Level: Cache Everything, Edge TTL: 1 year
   - `yoursite.com/*.jpg` → Cache Level: Cache Everything, Edge TTL: 1 year

## 7. Performance Monitoring

Add Google Analytics or Core Web Vitals monitoring:

```html
<!-- Core Web Vitals -->
<script>
  import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
</script>
```
