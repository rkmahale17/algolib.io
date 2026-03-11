import fs from 'fs';
import path from 'path';
import { algorithmsDB } from '../src/data/algorithmsDB';
import { algorithmImplementations } from '../src/data/algorithmImplementations';

// Helper function to extract YouTube creator from URL
function extractYouTubeCreator(url: string): string {
    if (url.includes('neetcode')) return 'NeetCode';
    if (url.includes('abdul')) return 'Abdul Bari';
    if (url.includes('tushar')) return 'Tushar Roy';
    if (url.includes('back-to-back-swe')) return 'Back To Back SWE';
    if (url.includes('william-fiset')) return 'William Fiset';
    return '';
}

// Helper function to generate test cases from inputSchema
function generateBasicTestCases(id: string, inputSchema: any[]): any[] {
    // If we have test cases in algorithmImplementations, use those
    const implData = algorithmImplementations[id];
    if (implData?.testCases && implData.testCases.length > 0) {
        return implData.testCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            output: tc.expectedOutput,
            complexityExpected: { space: '', time: '' },
            description: 'Test case'
        }));
    }
    return [];
}

// Helper function to populate explanation.io from test cases
function generateIOExamples(testCases: any[]): any[] {
    if (!testCases || testCases.length === 0) return [];

    return testCases.slice(0, 2).map(tc => ({
        input: JSON.stringify(tc.input),
        output: JSON.stringify(tc.expectedOutput || tc.output)
    }));
}

// Helper function to get note from algorithmImplementations
function getExplanationNote(id: string): string {
    const implData = algorithmImplementations[id];
    if (implData?.explanation?.problemStatement) {
        return implData.explanation.problemStatement;
    }
    return '';
}

function populateEntry(key: string, entry: any) {
    const updated = { ...entry };

    // 1. Populate availableLanguages from implementations
    if (entry.implementations && entry.implementations.length > 0) {
        const languages = entry.implementations.map((impl: any) => impl.lang);
        updated.availableLanguages = languages.join(',');
    }

    // 2. Populate tutorials.credits from URLs
    if (entry.tutorials && entry.tutorials.length > 0) {
        updated.tutorials = entry.tutorials.map((tutorial: any) => ({
            ...tutorial,
            credits: tutorial.credits || extractYouTubeCreator(tutorial.url)
        }));
    }

    // 3. Add test cases if empty
    if ((!entry.testCases || entry.testCases.length === 0) && entry.inputSchema) {
        const generatedTests = generateBasicTestCases(key, entry.inputSchema);
        if (generatedTests.length > 0) {
            updated.testCases = generatedTests;
        }
    }

    // 4. Populate explanation.io from test cases
    if ((!entry.explanation.io || entry.explanation.io.length === 0) && updated.testCases && updated.testCases.length > 0) {
        updated.explanation = {
            ...entry.explanation,
            io: generateIOExamples(updated.testCases)
        };
    }

    // 5. Populate explanation.note if empty
    if (!entry.explanation.note || entry.explanation.note === '') {
        const note = getExplanationNote(key);
        if (note) {
            updated.explanation = {
                ...entry.explanation,
                note
            };
        }
    }

    // 6. Populate inputSchema if missing and we have it in algorithmImplementations
    if ((!entry.inputSchema || entry.inputSchema.length === 0)) {
        const implData = algorithmImplementations[key];
        if (implData?.inputSchema && implData.inputSchema.length > 0) {
            updated.inputSchema = implData.inputSchema;
        }
    }

    return updated;
}

const populatedDB: Record<string, any> = {};

for (const key in algorithmsDB) {
    populatedDB[key] = populateEntry(key, algorithmsDB[key]);
}

// Read the original file to get the interface definition
const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), 'utf-8');
const interfaceMatch = originalFileContent.match(/export interface AlgorithmDB \{[\s\S]*?\n\}/);
const interfaceDef = interfaceMatch ? interfaceMatch[0] : '';

if (!interfaceDef) {
    console.error("Could not find AlgorithmDB interface definition.");
    process.exit(1);
}

const newContent = `
${interfaceDef}

export const algorithmsDB: Record<string, AlgorithmDB> = ${JSON.stringify(populatedDB, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), newContent);

console.log("Successfully populated algorithmsDB fields.");
console.log("Updated fields:");
console.log("- availableLanguages: derived from implementations");
console.log("- tutorials.credits: extracted from YouTube URLs");
console.log("- testCases: cross-referenced with algorithmImplementations");
console.log("- explanation.io: generated from test cases");
console.log("- explanation.note: populated from algorithmImplementations");
console.log("- inputSchema: populated from algorithmImplementations");
