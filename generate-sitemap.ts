import { algorithms } from './src/data/algorithms';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://algolib.io';

const staticRoutes = [
    '/',
    '/about',
    '/privacy',
    '/terms',
    '/feedback',
    '/auth',
];

const algorithmRoutes = algorithms.map((algo) => `/algorithm/${algo.id}`);

const allRoutes = [...staticRoutes, ...algorithmRoutes];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' : route.startsWith('/algorithm/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/algorithm/') ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write to public folder (will be copied to dist during build)
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ Generated sitemap with ${allRoutes.length} URLs`);
console.log(`   Saved to: public/sitemap.xml`);
