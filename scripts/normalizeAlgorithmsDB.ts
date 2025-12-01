
import fs from 'fs';
import path from 'path';
import { algorithmsDB } from '../src/data/algorithmsDB';

// Define the target interface structure (for reference/defaults)
const defaultExplanation = {
  problemStatement: "",
  io: [],
  constraints: [],
  note: "",
  steps: [],
  useCase: "",
  tips: []
};

const defaultProblemsToSolve = {
  internal: [],
  external: []
};

const defaultUserCompletionGraphData = {
  attempted: 0,
  completed: 0
};

function normalizeEntry(key: string, entry: any) {
  return {
    id: entry.id || key,
    name: entry.name || "",
    category: entry.category || "",
    title: entry.title || "",
    explanation: {
      problemStatement: entry.explanation?.problemStatement || "",
      io: entry.explanation?.io || [],
      constraints: entry.explanation?.constraints || [],
      note: entry.explanation?.note || "",
      steps: entry.explanation?.steps || [],
      useCase: entry.explanation?.useCase || "",
      tips: entry.explanation?.tips || []
    },
    companyTags: entry.companyTags || [],
    difficulty: entry.difficulty || "easy",
    listType: entry.listType || "coreAlgo",
    visualizationUrl: entry.visualizationUrl || "",
    commonNotes: entry.commonNotes || "",
    commonWhiteBoard: entry.commonWhiteBoard || "",
    implementations: entry.implementations || [],
    overview: entry.overview || "",
    timeComplexity: entry.timeComplexity || "",
    spaceComplexity: entry.spaceComplexity || "",
    tutorials: entry.tutorials || [],
    likes: entry.likes || 0,
    dislikes: entry.dislikes || 0,
    problemsToSolve: {
      internal: entry.problemsToSolve?.internal || [],
      external: entry.problemsToSolve?.external || []
    },
    imageUrls: entry.imageUrls || [],
    testCases: entry.testCases || [],
    inputSchema: entry.inputSchema || [],
    availableLanguages: entry.availableLanguages || "",
    editorialId: entry.editorialId || "",
    userCompletionGraphData: {
      attempted: entry.userCompletionGraphData?.attempted || 0,
      completed: entry.userCompletionGraphData?.completed || 0
    },
    shareCount: entry.shareCount || 0
  };
}

const normalizedDB: Record<string, any> = {};

for (const key in algorithmsDB) {
  normalizedDB[key] = normalizeEntry(key, algorithmsDB[key]);
}

// Read the original file to get the interface definition
const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), 'utf-8');
const interfaceMatch = originalFileContent.match(/export interface AlgorithmDB \{[\s\S]*?\}/);
const interfaceDef = interfaceMatch ? interfaceMatch[0] : '';

if (!interfaceDef) {
  console.error("Could not find AlgorithmDB interface definition.");
  process.exit(1);
}

const newContent = `
${interfaceDef}

export const algorithmsDB: Record<string, AlgorithmDB> = ${JSON.stringify(normalizedDB, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), newContent);

console.log("Successfully normalized algorithmsDB.");
