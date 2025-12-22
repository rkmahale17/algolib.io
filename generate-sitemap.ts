import { algorithms } from './src/data/algorithms';
import { blind75Problems } from './src/data/blind75';
import { blogPosts } from './src/data/blogPosts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://rulcode.com';

const staticRoutes = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  '/content-rights',
  '/feedback',
  '/auth',
  '/games',
  '/games/leaderboard',
  '/blind75',
  '/blog',
];

const algorithmRoutes = algorithms.map((algo) => `/problem/${algo.id}`);
const blind75Routes = blind75Problems.map((problem) => `/problem/${problem.slug}`);
const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);

// Game routes
const gameRoutes = [
  '/games/sort-hero',
  '/games/graph-explorer',
  '/games/stack-master',
  '/games/dp-puzzle',
  '/games/sliding-window',
  '/games/two-pointer',
];

const allRoutes = [...staticRoutes, ...algorithmRoutes, ...blind75Routes, ...blogRoutes, ...gameRoutes];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' :
    route.startsWith('/problem/') ? 'weekly' :
      route.startsWith('/blog/') ? 'weekly' :
        route.startsWith('/games/') ? 'weekly' :
          'monthly'
  }</changefreq>
    <priority>${route === '/' ? '1.0' :
    route.startsWith('/problem/') ? '0.8' :
      route.startsWith('/blog/') ? '0.7' :
        route.startsWith('/games/') ? '0.6' :
          '0.5'
  }</priority>
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
