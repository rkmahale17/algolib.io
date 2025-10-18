import type { Plugin } from 'vite';
import { algorithms } from './src/data/algorithms';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function prerenderPlugin(): Plugin {
    return {
        name: 'custom-prerender-plugin',
        apply: 'build',
        enforce: 'post',

        async closeBundle() {
            console.log('\n🚀 Starting prerender process...\n');

            const distPath = path.resolve(__dirname, 'dist');
            const indexPath = path.join(distPath, 'index.html');

            if (!fs.existsSync(distPath)) {
                console.error('❌ dist folder not found. Build may have failed.');
                return;
            }

            if (!fs.existsSync(indexPath)) {
                console.error('❌ index.html not found in dist folder.');
                return;
            }

            // Read the built index.html
            let indexHtml = fs.readFileSync(indexPath, 'utf-8');

            // 🔧 SANITIZATION: Remove any :8080 ports from URLs
            indexHtml = indexHtml.replace(/:8080/g, '');

            // 🔧 SANITIZATION: Convert any http:// to https:// for production URLs
            indexHtml = indexHtml.replace(
                /http:\/\/(qaalgo|prodalgolib|algolib\.io)/g,
                'https://$1'
            );

            // 🔧 SANITIZATION: Remove any absolute URLs and make them relative
            indexHtml = indexHtml.replace(
                /https?:\/\/[^\/]+\.run\.app:?\d*/g,
                ''
            );

            // Debug logging
            if (indexHtml.includes(':8080')) {
                console.warn('⚠️  WARNING: Still found :8080 in HTML after sanitization!');
            }
            if (indexHtml.match(/http:\/\/(?!localhost)/)) {
                console.warn('⚠️  WARNING: Found non-localhost http:// URLs in HTML!');
            }

            // Routes to prerender
            const staticRoutes = [
                { path: '/about', dir: 'about' },
                { path: '/privacy', dir: 'privacy' },
                { path: '/terms', dir: 'terms' },
                { path: '/feedback', dir: 'feedback' },
                { path: '/auth', dir: 'auth' },
            ];

            const algorithmRoutes = algorithms.map((data: { id: any; }) => ({
                path: `/algorithm/${data.id}`,
                dir: `algorithm/${data.id}`
            }));

            const allRoutes = [...staticRoutes, ...algorithmRoutes];

            console.log(`📄 Prerendering ${allRoutes.length} routes...\n`);

            let successCount = 0;
            let errorCount = 0;

            // Create directory and copy sanitized index.html for each route
            for (const route of allRoutes) {
                try {
                    const routeDir = path.join(distPath, route.dir);

                    // Create directory recursively
                    fs.mkdirSync(routeDir, { recursive: true });

                    // Write sanitized index.html
                    fs.writeFileSync(
                        path.join(routeDir, 'index.html'),
                        indexHtml,
                        'utf-8'
                    );

                    successCount++;
                    console.log(`✓ ${route.path}`);
                } catch (error) {
                    console.error(`❌ Failed to create route: ${route.path}`, error);
                    errorCount++;
                }
            }

            // Also update the main index.html with sanitized version
            fs.writeFileSync(indexPath, indexHtml, 'utf-8');

            console.log(`\n✅ Prerendering complete!`);
            console.log(`   Success: ${successCount} routes`);
            if (errorCount > 0) {
                console.log(`   Errors: ${errorCount} routes`);
            }
            console.log('   Main index.html also sanitized');
            console.log('');
        }
    };
}