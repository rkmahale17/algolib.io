import type { Plugin } from 'vite';
import React from 'react';
import { algorithms } from './src/data/algorithms';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
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
                /http:\/\/(qaalgo|prodalgolib|rulcode\.com)/g,
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
                path: `/problem/${data.id}`,
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
                            const title = `${algo.name} - RulCode.com`;
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
                                `<link rel="canonical" href="https://rulcode.com${route.path}"`
                            );
                        }
                    } else {
                        // For static pages, add SEO content with actual page content
                        const pageContent: Record<string, { title: string; description: string; content: string }> = {
                            '/about': {
                                title: 'About RulCode.com - Free & Open Source Algorithm Library',
                                description: 'RulCode.com is a free and open-source algorithm library with 72+ algorithms, interactive visualizations, and code snippets in Python, Java, C++, and TypeScript. Perfect for coding interviews and competitive programming.',
                                content: `
                                    <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>About RulCode.com</h1>
                                        <p>RulCode.com is a comprehensive, free, and open-source algorithm library designed to help developers master data structures and algorithms through interactive visualizations and clean code examples.</p>
                                        <h2>Our Mission</h2>
                                        <p>We believe that learning algorithms should be accessible to everyone. That's why we've created a platform that combines visual learning with practical code examples in multiple programming languages.</p>
                                        <h2>What We Offer</h2>
                                        <ul>
                                            <li><strong>72+ Algorithm Implementations</strong> - From basic sorting to advanced graph algorithms</li>
                                            <li><strong>Interactive Visualizations</strong> - See how algorithms work step-by-step</li>
                                            <li><strong>Multi-Language Support</strong> - Code snippets in Python, Java, C++, and TypeScript</li>
                                            <li><strong>LeetCode Problem Links</strong> - Practice with real interview questions</li>
                                            <li><strong>Complexity Analysis</strong> - Understand time and space complexity</li>
                                            <li><strong>100% Free & Open Source</strong> - No paywalls, no subscriptions</li>
                                        </ul>
                                        <h2>Perfect For</h2>
                                        <ul>
                                            <li>Coding interview preparation</li>
                                            <li>Competitive programming practice</li>
                                            <li>Computer science students</li>
                                            <li>Self-taught developers</li>
                                            <li>Algorithm enthusiasts</li>
                                        </ul>
                                    </div>
                                `
                            },
                            '/privacy': {
                                title: 'Privacy Policy - RulCode.com',
                                description: 'Privacy policy for RulCode.com - how we handle your data and protect your privacy while you learn algorithms.',
                                content: `
                                    <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>Privacy Policy</h1>
                                        <p>Last updated: October 2025</p>
                                        <h2>Your Privacy Matters</h2>
                                        <p>RulCode.com is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
                                        <h2>Information We Collect</h2>
                                        <p>We collect minimal information necessary to provide our services, including usage analytics to improve the platform.</p>
                                        <h2>How We Use Your Information</h2>
                                        <p>Your information is used solely to enhance your learning experience and improve our platform.</p>
                                    </div>
                                `
                            },
                            '/terms': {
                                title: 'Terms of Service - RulCode.com',
                                description: 'Terms of service for using RulCode.com algorithm library and educational platform.',
                                content: `
                                    <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>Terms of Service</h1>
                                        <p>Last updated: October 2025</p>
                                        <h2>Acceptance of Terms</h2>
                                        <p>By accessing RulCode.com, you agree to these terms of service.</p>
                                        <h2>Use of Service</h2>
                                        <p>RulCode.com is a free educational platform for learning algorithms and data structures.</p>
                                        <h2>Open Source</h2>
                                        <p>Our code is open source and available on GitHub for educational purposes.</p>
                                    </div>
                                `
                            },
                            '/feedback': {
                                title: 'Feedback - Help Us Improve RulCode.com',
                                description: 'Share your feedback and suggestions to help us improve RulCode.com algorithm library.',
                                content: `
                                    <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>We Value Your Feedback</h1>
                                        <p>Help us make RulCode.com better! Share your thoughts, suggestions, and bug reports.</p>
                                        <h2>What We're Looking For</h2>
                                        <ul>
                                            <li>Algorithm requests</li>
                                            <li>Feature suggestions</li>
                                            <li>Bug reports</li>
                                            <li>User experience improvements</li>
                                            <li>Content suggestions</li>
                                        </ul>
                                    </div>
                                `
                            },
                            '/auth': {
                                title: 'Sign In - RulCode.com',
                                description: 'Sign in to RulCode.com to track your progress, save favorite algorithms, and personalize your learning experience.',
                                content: `
                                    <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                                        <h1>Sign In to RulCode.com</h1>
                                        <p>Create an account to unlock personalized features and track your algorithm learning progress.</p>
                                        <h2>Benefits of Signing In</h2>
                                        <ul>
                                            <li>Track your learning progress</li>
                                            <li>Save favorite algorithms</li>
                                            <li>Personalized recommendations</li>
                                            <li>Bookmark problems for later</li>
                                        </ul>
                                    </div>
                                `
                            }
                        };

                        const pageInfo = pageContent[route.path];
                        if (pageInfo) {
                            // Inject content
                            routeHtml = routeHtml.replace(
                                /<div id="root"><!--app-html--><\/div>/,
                                `<div id="root">${pageInfo.content}</div>`
                            );

                            // Update meta tags
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
                                `<link rel="canonical" href="https://rulcode.com${route.path}"`
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

            // Generate rich SEO content for the home page
            try {
                console.log('\n📄 Generating home page SEO content...');

                // Group algorithms by category for better SEO
                const algorithmsByCategory: Record<string, any[]> = {};
                algorithms.forEach((algo: any) => {
                    if (!algorithmsByCategory[algo.category]) {
                        algorithmsByCategory[algo.category] = [];
                    }
                    algorithmsByCategory[algo.category].push(algo);
                });

                // Generate rich content for home page
                const homePageContent = `
                    <div id="root">
                        <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                            <h1>RulCode.com - Master 200+ Algorithms with Interactive Visualizations</h1>
                            <p style="font-size: 1.125rem; margin: 20px 0;">
                                Free and open-source algorithm library for developers, students, and competitive programmers. 
                                Learn data structures and algorithms with step-by-step visualizations, clean code examples in 
                                Python, Java, C++, and TypeScript, and direct links to LeetCode practice problems.
                            </p>
                            
                            <h2>Why RulCode.com?</h2>
                            <ul style="margin: 20px 0; line-height: 1.8;">
                                <li><strong>72+ Algorithm Implementations</strong> - Comprehensive coverage from basic to advanced</li>
                                <li><strong>Interactive Visualizations</strong> - See algorithms in action with step-by-step animations</li>
                                <li><strong>Multi-Language Code</strong> - Examples in Python, Java, C++, and TypeScript</li>
                                <li><strong>LeetCode Integration</strong> - Direct links to practice problems</li>
                                <li><strong>Complexity Analysis</strong> - Time and space complexity for every algorithm</li>
                                <li><strong>100% Free & Open Source</strong> - No paywalls, no subscriptions, forever free</li>
                            </ul>
                            
                            <h2>Algorithm Categories</h2>
                            ${Object.entries(algorithmsByCategory).map(([category, algos]) => `
                                <div style="margin: 30px 0;">
                                    <h3>${category}</h3>
                                    <ul style="line-height: 1.8;">
                                        ${algos.map((algo: any) => `
                                            <li>
                                                <a href="/problem/${algo.id}" style="color: #3b82f6; text-decoration: none;">
                                                    <strong>${algo.name}</strong>
                                                </a> - ${algo.description} 
                                                (Time: ${algo.timeComplexity}, Space: ${algo.spaceComplexity})
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                            
                            <h2>Perfect For</h2>
                            <ul style="margin: 20px 0; line-height: 1.8;">
                                <li><strong>Coding Interview Preparation</strong> - Master algorithms asked in FAANG interviews</li>
                                <li><strong>Competitive Programming</strong> - Learn techniques for Codeforces, AtCoder, and more</li>
                                <li><strong>Computer Science Students</strong> - Visual learning aids for DSA courses</li>
                                <li><strong>LeetCode Practice</strong> - Understand algorithms before solving problems</li>
                                <li><strong>Self-Taught Developers</strong> - Structured learning path for algorithms</li>
                            </ul>
                            
                            <h2>Popular Algorithms</h2>
                            <ul style="line-height: 1.8;">
                                <li><a href="/problem/two-pointers">Two Pointers</a> - Efficient array traversal technique</li>
                                <li><a href="/problem/sliding-window">Sliding Window</a> - Optimize subarray problems</li>
                                <li><a href="/problem/binary-search">Binary Search</a> - Fast search in sorted arrays</li>
                                <li><a href="/problem/dfs">Depth-First Search (DFS)</a> - Graph traversal algorithm</li>
                                <li><a href="/problem/bfs">Breadth-First Search (BFS)</a> - Level-order graph traversal</li>
                                <li><a href="/problem/dynamic-programming">Dynamic Programming</a> - Optimization technique</li>
                                <li><a href="/problem/dijkstra">Dijkstra's Algorithm</a> - Shortest path finding</li>
                                <li><a href="/problem/merge-sort">Merge Sort</a> - Efficient O(n log n) sorting</li>
                                <li><a href="/problem/quick-sort">Quick Sort</a> - Fast in-place sorting</li>
                                <li><a href="/problem/backtracking">Backtracking</a> - Solve constraint satisfaction problems</li>
                            </ul>
                            
                            <h2>Start Learning Today</h2>
                            <p style="font-size: 1.125rem; margin: 20px 0;">
                                Browse our complete collection of ${algorithms.length} algorithms, each with detailed explanations, 
                                complexity analysis, code implementations, and practice problems. All completely free and open source.
                            </p>
                        </div>
                    </div>
                `;

                // Update home page with rich content
                let homeHtml = indexHtml.replace(
                    /<div id="root"><!--app-html--><\/div>/,
                    homePageContent
                );

                // Update home page meta tags for better SEO
                homeHtml = homeHtml.replace(
                    /<title>[^<]*<\/title>/,
                    '<title>RulCode.com - Master 200+ Algorithms with Interactive Visualizations | Free & Open Source</title>'
                );

                homeHtml = homeHtml.replace(
                    /<meta name="description" content="[^"]*"/,
                    '<meta name="description" content="Learn data structures and algorithms with interactive visualizations. 72+ algorithms in Python, Java, C++, TypeScript. Perfect for coding interviews, LeetCode, and competitive programming. 100% free and open source."'
                );

                fs.writeFileSync(indexPath, homeHtml, 'utf-8');
                console.log('✓ Home page with rich SEO content');
            } catch (error) {
                console.error('❌ Failed to generate home page content:', error);
                // Fallback to sanitized version
                fs.writeFileSync(indexPath, indexHtml, 'utf-8');
            }

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