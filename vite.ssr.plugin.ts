import type { Plugin } from 'vite';
import { algorithms } from './src/data/algorithms';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// vite-plugin-prerender.ts






// Import your algorithm IDs


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function prerenderPlugin(): Plugin {
    return {
        name: 'custom-prerender-plugin',
        apply: 'build',
        enforce: 'post', // Run after other plugins

        async closeBundle() {
            console.log('\n🚀 Starting prerender process...\n');

            const distPath = path.resolve(__dirname, 'dist');
            const indexPath = path.join(distPath, 'index.html');

            // Check if dist folder exists
            if (!fs.existsSync(distPath)) {
                console.error('❌ dist folder not found. Build may have failed.');
                return;
            }

            // Check if index.html exists
            if (!fs.existsSync(indexPath)) {
                console.error('❌ index.html not found in dist folder.');
                return;
            }

            // Read the built index.html
            const indexHtml = fs.readFileSync(indexPath, 'utf-8');

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

            // Create directory and copy index.html for each route
            for (const route of allRoutes) {
                try {
                    const routeDir = path.join(distPath, route.dir);

                    // Create directory recursively
                    fs.mkdirSync(routeDir, { recursive: true });

                    // Write index.html
                    fs.writeFileSync(
                        path.join(routeDir, 'index.html'),
                        indexHtml,
                        'utf-8'
                    );

                    successCount++;
                } catch (error) {
                    console.error(`❌ Failed to create route: ${route.path}`, error);
                    errorCount++;
                }
            }

            console.log(`\n✅ Prerendering complete!`);
            console.log(`   Success: ${successCount} routes`);
            if (errorCount > 0) {
                console.log(`   Errors: ${errorCount} routes`);
            }
            console.log('');
        }
    };
}