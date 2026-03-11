
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'algorithmsDB.ts');
const entriesPath = path.join(process.cwd(), 'scripts', 'blind75_entries.txt');

const dbContent = fs.readFileSync(dbPath, 'utf-8');
const entriesContent = fs.readFileSync(entriesPath, 'utf-8');

// Find the last closing brace of the object
// The file ends with "};" or "};\n"
const lastBraceIndex = dbContent.lastIndexOf('};');

if (lastBraceIndex === -1) {
    console.error('Could not find closing brace in algorithmsDB.ts');
    process.exit(1);
}

// Check if we need a comma. The last entry usually doesn't have a comma.
// We'll look backwards from lastBraceIndex to find the last closing brace of an item "}"
// and check if there's a comma after it.
// But simpler: just insert a comma before the new content, and if the previous item already had one, 
// valid JS allows trailing commas, or double commas might be an issue but usually not in object literals if empty?
// No, double commas ",," is a syntax error.

// Let's just insert ", \n" + entriesContent before the last "};"
// This assumes the previous item didn't have a trailing comma, or if it did, we might have ", ,".
// Most formatters remove trailing comma on the last item.
// Let's check the file content again. It ended with "  }\n};".
// So we can replace "\n};" with ",\n" + entriesContent + "};"

const newContent = dbContent.substring(0, lastBraceIndex) +
    ",\n" +
    entriesContent +
    "\n};";

fs.writeFileSync(dbPath, newContent);
console.log('Successfully appended Blind 75 entries to algorithmsDB.ts');
