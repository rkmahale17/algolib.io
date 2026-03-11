
import fs from 'fs';
import path from 'path';
import { algorithms } from '../src/data/algorithms';
import { algorithmImplementations } from '../src/data/algorithmImplementations';
import { blind75Problems } from '../src/data/blind75';
import { algorithmTestCases } from '../src/data/testCases';

// Define the new interface based on user requirements
interface AlgorithmDB {
    id: string;
    name: string;
    category: string;
    title: string;
    explanation: {
        problemStatement: string;
        io: { input: string; output: string }[];
        constraints: string[];
        note: string;
        steps: string[];
        useCase: string;
        tips: string[];
    };
    companyTags: string[];
    difficulty: 'easy' | 'intermediate' | 'advance' | 'MandatoryTODO';
    listType: 'coreAlgo' | 'blind75' | 'core+Blind75';
    visualizationUrl: string;
    commonNotes: string;
    commonWhiteBoard: string;
    implementations: {
        lang: 'java' | 'typeScript' | 'python' | 'cpp';
        code: {
            codeType: string;
            code: string;
        }[];
    }[];
    overview: string;
    timeComplexity: string;
    spaceComplexity: string;
    tutorials: {
        type: 'youtube';
        url: string;
        examples?: any;
        credits: string;
        moreInfo: string;
    }[];
    likes: number;
    dislikes: number;
    problemsToSolve: {
        internal: { type: string; url: string; title: string }[];
        external: { type: string; url: string; title: string }[];
    };
    imageUrls: { name: string; alt: string; url: string; size: string }[];
    testCases: { input: any; output: any; complexityExpected: { space: string; time: string } }[];
    inputSchema: { name: string; type: string; label?: string }[];
    availableLanguages: string;
    editorialId: string;
    userCompletionGraphData: {
        attempted: number;
        completed: number;
    };
    shareCount: number;
}

const db: Record<string, AlgorithmDB> = {};

// Helper to map difficulty
const mapDifficulty = (diff: string): AlgorithmDB['difficulty'] => {
    const d = diff.toLowerCase();
    if (d === 'beginner' || d === 'easy') return 'easy';
    if (d === 'intermediate' || d === 'medium') return 'intermediate';
    if (d === 'advanced' || d === 'hard') return 'advance';
    return 'intermediate';
};

// 1. Process Core Algorithms
algorithms.forEach(algo => {
    const impl = algorithmImplementations[algo.id];
    const testData = algorithmTestCases[algo.id];

    const entry: AlgorithmDB = {
        id: algo.id,
        name: algo.name,
        title: algo.name,
        category: algo.category,
        explanation: {
            problemStatement: algo.description || '',
            io: [], // To be filled if available in impl
            constraints: [],
            note: '',
            steps: impl?.explanation?.steps || [],
            useCase: impl?.explanation?.useCase || '',
            tips: impl?.explanation?.tips || []
        },
        companyTags: [],
        difficulty: mapDifficulty(algo.difficulty),
        listType: 'coreAlgo',
        visualizationUrl: '', // To be filled if we have a mapping
        commonNotes: '',
        commonWhiteBoard: '',
        implementations: [],
        overview: impl?.explanation?.overview || '',
        timeComplexity: algo.timeComplexity,
        spaceComplexity: algo.spaceComplexity,
        tutorials: algo.youtubeUrl ? [{
            type: 'youtube',
            url: algo.youtubeUrl,
            credits: '',
            moreInfo: ''
        }] : [],
        likes: 0,
        dislikes: 0,
        problemsToSolve: {
            internal: [],
            external: (algo.problems || []).map(p => ({
                type: mapDifficulty(p.difficulty),
                url: p.link,
                title: p.title
            }))
        },
        imageUrls: [],
        testCases: testData ? testData.testCases.map(tc => ({
            input: tc.input,
            output: tc.expectedOutput,
            complexityExpected: {
                time: testData.timeComplexity,
                space: testData.spaceComplexity
            }
        })) : [],
        inputSchema: impl?.inputSchema || [],
        availableLanguages: '',
        editorialId: '',
        userCompletionGraphData: {
            attempted: 0,
            completed: 0
        },
        shareCount: 0
    };

    // Helper to add code
    const addCode = (lang: AlgorithmDB['implementations'][0]['lang'], type: string, code: string) => {
        let existing = entry.implementations.find(i => i.lang === lang);
        if (!existing) {
            existing = { lang, code: [] };
            entry.implementations.push(existing);
        }
        existing.code.push({ codeType: type, code });
    };

    // Add implementations if available
    if (impl) {
        if (impl.code) {
            if (impl.code.typescript) addCode('typeScript', 'optimize', impl.code.typescript);
            if (impl.code.python) addCode('python', 'optimize', impl.code.python);
            if (impl.code.java) addCode('java', 'optimize', impl.code.java);
            if (impl.code.cpp) addCode('cpp', 'optimize', impl.code.cpp);
        }
        if (impl.starterCode) {
            if (impl.starterCode.typescript) addCode('typeScript', 'starter', impl.starterCode.typescript);
            if (impl.starterCode.python) addCode('python', 'starter', impl.starterCode.python);
            if (impl.starterCode.java) addCode('java', 'starter', impl.starterCode.java);
            if (impl.starterCode.cpp) addCode('cpp', 'starter', impl.starterCode.cpp);
        }
    }

    db[algo.id] = entry;
});

// 2. Process Blind 75
blind75Problems.forEach(prob => {
    const existingId = prob.algorithmId;

    if (existingId && db[existingId]) {
        // Update existing
        db[existingId].listType = 'core+Blind75';
        // Merge tags
        if (prob.companies) {
            db[existingId].companyTags = Array.from(new Set([...db[existingId].companyTags, ...prob.companies]));
        }
        // Merge problems
        if (prob.leetcodeSearch) {
            // Check if already exists
            const exists = db[existingId].problemsToSolve.external.some(p => p.url === prob.leetcodeSearch);
            if (!exists) {
                db[existingId].problemsToSolve.external.push({
                    type: mapDifficulty(prob.difficulty),
                    url: prob.leetcodeSearch,
                    title: prob.title
                });
            }
        }
    } else {
        // Create new entry for Blind 75 problem if it doesn't map to a core algo
        // Use slug as ID
        const id = prob.slug;
        // Check if we already created it (duplicates in list?)
        if (db[id]) return;

        // Try to find implementation by slug/id if possible, or leave empty
        // We don't have a direct map for blind75 implementations in the imports above unless we import blind75Implementations
        // But for now, let's create the entry.

        const entry: AlgorithmDB = {
            id: id,
            name: prob.title,
            title: prob.title,
            category: prob.category,
            explanation: {
                problemStatement: prob.description,
                io: [],
                constraints: [],
                note: '',
                steps: [],
                useCase: '',
                tips: []
            },
            companyTags: prob.companies || [],
            difficulty: mapDifficulty(prob.difficulty),
            listType: 'blind75',
            visualizationUrl: '',
            commonNotes: '',
            commonWhiteBoard: '',
            implementations: [], // We'd need to fetch these from somewhere else if available
            overview: '',
            timeComplexity: prob.timeComplexity,
            spaceComplexity: prob.spaceComplexity,
            tutorials: prob.youtubeUrl ? [{
                type: 'youtube',
                url: prob.youtubeUrl,
                credits: '',
                moreInfo: ''
            }] : [],
            likes: 0,
            dislikes: 0,
            problemsToSolve: {
                internal: [],
                external: [{
                    type: mapDifficulty(prob.difficulty),
                    url: prob.leetcodeSearch,
                    title: prob.title
                }]
            },
            imageUrls: [],
            testCases: [], // Might be in testCases.ts under this ID?
            inputSchema: [],
            availableLanguages: '',
            editorialId: '',
            userCompletionGraphData: {
                attempted: 0,
                completed: 0
            },
            shareCount: 0
        };

        // Check if test cases exist for this ID
        const testData = algorithmTestCases[id];
        if (testData) {
            entry.testCases = testData.testCases.map(tc => ({
                input: tc.input,
                output: tc.expectedOutput,
                complexityExpected: {
                    time: testData.timeComplexity,
                    space: testData.spaceComplexity
                }
            }));
        }

        db[id] = entry;
    }
});

// Generate the file content
const content = `
export interface AlgorithmDB {
  id: string;
  name: string;
  category: string;
  title: string;
  explanation: {
    problemStatement: string;
    io: { input: string; output: string }[];
    constraints: string[];
    note: string;
    steps: string[];
    useCase: string;
    tips: string[];
  };
  companyTags: string[];
  difficulty: 'easy' | 'intermediate' | 'advance' | 'MandatoryTODO';
  listType: 'coreAlgo' | 'blind75' | 'core+Blind75';
  visualizationUrl: string;
  commonNotes: string;
  commonWhiteBoard: string;
  implementations: {
    lang: 'java' | 'typeScript' | 'python' | 'cpp';
    code: {
      codeType: string;
      code: string;
    }[];
  }[];
  overview: string;
  timeComplexity: string;
  spaceComplexity: string;
  tutorials: {
    type: 'youtube';
    url: string;
    examples?: any;
    credits: string;
    moreInfo: string;
  }[];
  likes: number;
  dislikes: number;
  problemsToSolve: {
    internal: { type: string; url: string; title: string }[];
    external: { type: string; url: string; title: string }[];
  };
  imageUrls: { name: string; alt: string; url: string; size: string }[];
  testCases: { input: any; output: any; complexityExpected: { space: string; time: string } }[];
  inputSchema: { name: string; type: string; label?: string }[];
  availableLanguages: string;
  editorialId: string;
  userCompletionGraphData: {
    attempted: number;
    completed: number;
  };
  shareCount: number;
}

export const algorithmsDB: Record<string, AlgorithmDB> = ${JSON.stringify(db, null, 2)};
`;

const outputPath = path.join(process.cwd(), 'src', 'data', 'algorithmsDB.ts');
fs.writeFileSync(outputPath, content);

console.log(`Successfully generated algorithmsDB.ts with ${Object.keys(db).length} entries.`);
