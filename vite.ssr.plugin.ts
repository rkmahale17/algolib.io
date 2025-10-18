import type { Plugin } from 'vite';
import { algorithms } from './src/data/algorithms';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';

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

            // 🔧 SANITIZATION: Remove any :8080 ports from URLs (including in href, src, content attributes)
            indexHtml = indexHtml.replace(/:8080/g, '');

            // 🔧 SANITIZATION: Convert any http:// to https:// for production URLs
            indexHtml = indexHtml.replace(
                /http:\/\/(qaalgo|prodalgolib|algolib\.io)/g,
                'https://$1'
            );

            // 🔧 SANITIZATION: Convert Cloud Run URLs to HTTPS
            indexHtml = indexHtml.replace(
                /http:\/\/([^\/]+\.run\.app)/g,
                'https://$1'
            );

            // 🔧 SANITIZATION: Remove any absolute URLs with ports and make them relative
            indexHtml = indexHtml.replace(
                /https?:\/\/[^\/\s"']+\.run\.app:?\d*/g,
                ''
            );

            // 🔧 SANITIZATION: Fix any malformed URLs like "http:path" or "https:path"
            indexHtml = indexHtml.replace(
                /(https?):([^\/])/g,
                '$1://$2'
            );

            // 🔧 SANITIZATION: Remove any localhost references with ports
            indexHtml = indexHtml.replace(
                /https?:\/\/localhost:?\d*/g,
                ''
            );

            // 🔧 SANITIZATION: Ensure <base> tag has correct href
            indexHtml = indexHtml.replace(
                /<base\s+href=["'][^"']*["']\s*\/?>/gi,
                '<base href="/" />'
            );

            // Debug logging
            if (indexHtml.includes(':8080')) {
                console.warn('⚠️  WARNING: Still found :8080 in HTML after sanitization!');
            }
            if (indexHtml.match(/http:\/\/(?!localhost)/)) {
                console.warn('⚠️  WARNING: Found non-localhost http:// URLs in HTML!');
            }
            if (indexHtml.match(/https?:[^\/]/)) {
                console.warn('⚠️  WARNING: Found malformed URLs (missing //) in HTML!');
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

            // Generate SEO-optimized HTML for each route
            for (const route of allRoutes) {
                try {
                    const routeDir = path.join(distPath, route.dir);

                    // Create directory recursively
                    fs.mkdirSync(routeDir, { recursive: true });

                    // Generate route-specific HTML with meta tags and content
                    let routeHtml = indexHtml;
                    
                    // Find algorithm data if this is an algorithm route
                    const algoMatch = route.path.match(/\/algorithm\/(.+)/);
                    if (algoMatch) {
                        const algoId = algoMatch[1];
                        const algo = algorithms.find((a: any) => a.id === algoId);
                        
                        if (algo) {
                            // Generate SEO content for algorithm pages
                            const seoContent = `
                                <div id="root">
                                    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>${algo.name}</h1>
                                        <p><strong>Category:</strong> ${algo.category}</p>
                                        <p><strong>Difficulty:</strong> ${algo.difficulty}</p>
                                        <p><strong>Description:</strong> ${algo.description}</p>
                                        <p><strong>Time Complexity:</strong> ${algo.timeComplexity}</p>
                                        <p><strong>Space Complexity:</strong> ${algo.spaceComplexity}</p>
                                        ${algo.problems && algo.problems.length > 0 ? `
                                            <h2>Related LeetCode Problems</h2>
                                            <ul>
                                                ${algo.problems.map((p: any) => `
                                                    <li>
                                                        <a href="${p.link}" target="_blank" rel="noopener">
                                                            ${p.number}. ${p.title} (${p.difficulty})
                                                        </a>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                            
                            // Replace the empty root div with content
                            routeHtml = routeHtml.replace(
                                /<div id="root"><!--app-html--><\/div>/,
                                seoContent
                            );
                            
                            // Update meta tags
                            const title = `${algo.name} - AlgoLib.io`;
                            const description = `${algo.description}. Time: ${algo.timeComplexity}, Space: ${algo.spaceComplexity}. Learn ${algo.name} algorithm with examples and LeetCode problems.`;
                            
                            routeHtml = routeHtml.replace(
                                /<title>[^<]*<\/title>/,
                                `<title>${title}</title>`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<meta name="description" content="[^"]*"/,
                                `<meta name="description" content="${description}"`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<meta property="og:title" content="[^"]*"/,
                                `<meta property="og:title" content="${title}"`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<meta property="og:description" content="[^"]*"/,
                                `<meta property="og:description" content="${description}"`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<link rel="canonical" href="[^"]*"/,
                                `<link rel="canonical" href="https://algolib.io${route.path}"`
                            );
                        }
                    } else {
                        // For static pages (about, privacy, etc.), add basic SEO content
                        const pageNames: Record<string, { title: string; description: string }> = {
                            '/about': {
                                title: 'About AlgoLib.io - Free Algorithm Library',
                                description: 'Learn about AlgoLib.io, a free and open-source algorithm library for competitive programming and coding interviews.'
                            },
                            '/privacy': {
                                title: 'Privacy Policy - AlgoLib.io',
                                description: 'Privacy policy for AlgoLib.io - how we handle your data and protect your privacy.'
                            },
                            '/terms': {
                                title: 'Terms of Service - AlgoLib.io',
                                description: 'Terms of service for using AlgoLib.io algorithm library.'
                            },
                            '/feedback': {
                                title: 'Feedback - AlgoLib.io',
                                description: 'Share your feedback and help us improve AlgoLib.io.'
                            },
                            '/auth': {
                                title: 'Sign In - AlgoLib.io',
                                description: 'Sign in to AlgoLib.io to track your progress and save your favorite algorithms.'
                            }
                        };
                        
                        const pageInfo = pageNames[route.path];
                        if (pageInfo) {
                            routeHtml = routeHtml.replace(
                                /<title>[^<]*<\/title>/,
                                `<title>${pageInfo.title}</title>`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<meta name="description" content="[^"]*"/,
                                `<meta name="description" content="${pageInfo.description}"`
                            );
                            
                            routeHtml = routeHtml.replace(
                                /<link rel="canonical" href="[^"]*"/,
                                `<link rel="canonical" href="https://algolib.io${route.path}"`
                            );
                        }
                    }

                    // Write the route-specific HTML
                    fs.writeFileSync(
                        path.join(routeDir, 'index.html'),
                        routeHtml,
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