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
  '/dsa/core',
  '/dsa/blind-75',
  '/dsa/rulcode-150',
  '/dsa/visual-library',
  '/dsa/pattern-guess',
  '/dsa/patterns',
  '/dsa/problems',
  '/dsa/roadmap',
  '/database/sql-basics',
  '/guides',
  '/complexity',
];



import { guidesData } from './src/data/guidesData';

const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);

const guideRoutes = guidesData.flatMap(category => {
  return category.guides.map(guide => {
    if (category.id === "time-complexity") return "/guides/time-complexity";
    if (category.id === "space-complexity") return "/guides/space-complexity";
    if (category.id === "fundamentals") return `/guides/fundamentals/${guide.slug}`;
    return `/guides/patterns/${guide.slug}`;
  });
});
async function generateSitemap() {
  console.log('Fetching algorithms from Supabase...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  console.log('Environment Debug:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    allKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables.');
    // Don't fail the build, just skip dynamic routes if strictly necessary, 
    // OR fail if it's critical. User request implies failure.
    // Let's keep failure but with better info.
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let { data: algorithms, error } = await supabase
    .from('algorithms')
    .select('id, list_type, metadata')
    .eq('published', true);

  if (error) {
    console.warn('Failed to query with published = true, falling back to selecting all:', error.message);
    const { data: fallbackAlgos, error: fallbackError } = await supabase
      .from('algorithms')
      .select('id, list_type, metadata');
    
    if (fallbackError) {
      console.error('Error fetching algorithms fallback:', fallbackError);
      process.exit(1);
    }
    algorithms = fallbackAlgos;
  }

  // All algorithms now use unified /problem/ route
  const problemRoutes = algorithms.map((algo) => `/problem/${algo.id}`);

  const allRoutes = [...staticRoutes, ...problemRoutes, ...guideRoutes];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'daily' :
      route.startsWith('/dsa/') ? 'weekly' :
        route.startsWith('/database/') ? 'weekly' :
          route.startsWith('/problem/') ? 'weekly' :
            route.startsWith('/blog/') ? 'weekly' :
              route.startsWith('/guides/') ? 'weekly' :
                'monthly'
    }</changefreq>
    <priority>${route === '/' ? '1.0' :
      route.startsWith('/dsa/') ? '0.9' :
        route.startsWith('/database/') ? '0.9' :
          route.startsWith('/problem/') ? '0.8' :
            route.startsWith('/blog/') ? '0.7' :
              route.startsWith('/guides/') ? '0.8' :
                route === '/complexity' ? '0.8' :
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
