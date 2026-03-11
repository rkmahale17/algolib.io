import fs from 'fs';

const filePath = 'src/data/exmple.json';
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);
const targetField = data[0].implementations;

console.log('Target field length:', targetField.length);

try {
    JSON.parse(targetField);
    console.log('✅ Successfully parsed nested JSON');
} catch (e: any) {
    console.error('❌ Parsing failed:', e.message);
    const match = e.message.match(/at position (\d+)/);
    if (match) {
        const pos = parseInt(match[1]);
        console.log('Error at position:', pos);
        console.log('Context around error:');
        console.log('-------------------');
        const start = Math.max(0, pos - 100);
        const end = Math.min(targetField.length, pos + 100);
        console.log(targetField.substring(start, end));
        console.log('-------------------');
        const chunk = targetField.substring(Math.max(0, pos - 5), Math.min(targetField.length, pos + 5));
        console.log('Hex codes:', chunk.split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
    }
}
