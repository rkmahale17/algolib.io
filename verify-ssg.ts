import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');

console.log('\n🔍 Verifying SSG Output...\n');

// Check if dist exists
if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ folder not found. Run `npm run build` first.');
    process.exit(1);
}

// Test cases
const testPages = [
    { path: 'index.html', name: 'Home Page' },
    { path: 'algorithm/two-pointers/index.html', name: 'Two Pointers Algorithm' },
    { path: 'algorithm/sliding-window/index.html', name: 'Sliding Window Algorithm' },
    { path: 'about/index.html', name: 'About Page' },
    { path: 'sitemap.xml', name: 'Sitemap' }
];

let passCount = 0;
let failCount = 0;

for (const test of testPages) {
    const filePath = path.join(distPath, test.path);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${test.name}: File not found at ${test.path}`);
        failCount++;
        continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for content indicators
    const checks: Array<{ name: string; pass: boolean }> = [];
    
    if (test.path.includes('algorithm/')) {
        // Algorithm pages should have content
        checks.push({
            name: 'Has H1 heading',
            pass: content.includes('<h1>') && !content.includes('<h1></h1>')
        });
        checks.push({
            name: 'Has algorithm description',
            pass: content.includes('<strong>Description:</strong>')
        });
        checks.push({
            name: 'Has complexity info',
            pass: content.includes('Time Complexity') || content.includes('Space Complexity')
        });
        checks.push({
            name: 'Not empty root div',
            pass: !content.includes('<div id="root"><!--app-html--></div>')
        });
        checks.push({
            name: 'Has unique title',
            pass: content.includes('<title>') && !content.includes('<title>AlgoLib.io – Open-Source Algorithm Library')
        });
    } else if (test.path === 'sitemap.xml') {
        checks.push({
            name: 'Is valid XML',
            pass: content.includes('<?xml') && content.includes('<urlset')
        });
        checks.push({
            name: 'Has algorithm URLs',
            pass: content.includes('/algorithm/')
        });
    } else if (test.path === 'index.html') {
        // Home page should have rich content
        checks.push({
            name: 'Has main heading',
            pass: content.includes('<h1>') && content.includes('Master 72+ Algorithms')
        });
        checks.push({
            name: 'Has algorithm categories',
            pass: content.includes('Algorithm Categories')
        });
        checks.push({
            name: 'Has algorithm links',
            pass: content.includes('/algorithm/') && content.includes('<a href')
        });
        checks.push({
            name: 'Not empty root div',
            pass: !content.includes('<div id="root"><!--app-html--></div>')
        });
        checks.push({
            name: 'Has popular algorithms section',
            pass: content.includes('Popular Algorithms')
        });
    } else {
        // Static pages
        checks.push({
            name: 'Has title tag',
            pass: content.includes('<title>')
        });
        checks.push({
            name: 'Has meta description',
            pass: content.includes('<meta name="description"')
        });
        checks.push({
            name: 'Has content (not empty)',
            pass: !content.includes('<div id="root"><!--app-html--></div>')
        });
    }
    
    const allPassed = checks.every(c => c.pass);
    
    if (allPassed) {
        console.log(`✅ ${test.name}`);
        checks.forEach(c => console.log(`   ✓ ${c.name}`));
        passCount++;
    } else {
        console.log(`⚠️  ${test.name}`);
        checks.forEach(c => {
            if (c.pass) {
                console.log(`   ✓ ${c.name}`);
            } else {
                console.log(`   ✗ ${c.name}`);
            }
        });
        failCount++;
    }
    
    console.log('');
}

console.log('\n📊 Summary:');
console.log(`   ✅ Passed: ${passCount}/${testPages.length}`);
console.log(`   ❌ Failed: ${failCount}/${testPages.length}`);

if (failCount === 0) {
    console.log('\n🎉 All checks passed! Your SSG is working correctly.');
    console.log('   Next: Deploy and test with Google Crawler Simulator\n');
} else {
    console.log('\n⚠️  Some checks failed. Review the output above.\n');
    process.exit(1);
}
