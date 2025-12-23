import { blogPosts } from './src/data/blogPosts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

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
  '/games',
  '/games/leaderboard',
  '/blind75',
  '/blog',
];

// Game routes
const gameRoutes = [
  '/games/sort-hero',
  '/games/graph-explorer',
  '/games/stack-master',
  '/games/dp-puzzle',
  '/games/sliding-window',
  '/games/two-pointer',
];

const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);

async function generateSitemap() {
  console.log('Fetching algorithms from Supabase...');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  console.log('Environment Debug:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    allKeys: Object.keys(process.env).filter(k => k.startsWith('VITE_'))
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables.');
    // Don't fail the build, just skip dynamic routes if strictly necessary, 
    // OR fail if it's critical. User request implies failure.
    // Let's keep failure but with better info.
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: algorithms, error } = await supabase
    .from('algorithms')
    .select('id, list_type, metadata');

  if (error) {
    console.error('Error fetching algorithms:', error);
    process.exit(1);
  }

  // All algorithms now use unified /problem/ route
  const problemRoutes = algorithms.map((algo) => `/problem/${algo.id}`);

  const allRoutes = [...staticRoutes, ...problemRoutes, ...blogRoutes, ...gameRoutes];

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
}

generateSitemap();
