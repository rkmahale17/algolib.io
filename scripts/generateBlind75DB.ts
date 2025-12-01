
import { blind75Problems } from '../src/data/blind75';
import { blind75Implementations } from '../src/data/blind75Implementations';
import * as fs from 'fs';
import * as path from 'path';

function generate() {
    let output = '';

    for (const problem of blind75Problems) {
        const impl = blind75Implementations[problem.slug];
        if (!impl) {
            continue;
        }

        const difficultyMap: Record<string, string> = {
            'easy': 'easy',
            'medium': 'intermediate',
            'hard': 'advance'
        };

        const implementations = [];
        if (impl.typescript) {
            implementations.push({
                lang: 'typeScript',
                code: [
                    { codeType: 'optimize', code: impl.typescript },
                    { codeType: 'starter', code: '// TODO: Starter code' }
                ]
            });
        }
        if (impl.python) {
            implementations.push({
                lang: 'python',
                code: [
                    { codeType: 'optimize', code: impl.python },
                    { codeType: 'starter', code: '# TODO: Starter code' }
                ]
            });
        }
        if (impl.java) {
            implementations.push({
                lang: 'java',
                code: [
                    { codeType: 'optimize', code: impl.java },
                    { codeType: 'starter', code: '// TODO: Starter code' }
                ]
            });
        }
        if (impl.cpp) {
            implementations.push({
                lang: 'cpp',
                code: [
                    { codeType: 'optimize', code: impl.cpp },
                    { codeType: 'starter', code: '// TODO: Starter code' }
                ]
            });
        }

        const algo = {
            id: problem.slug,
            name: problem.title,
            title: problem.title,
            category: problem.category,
            explanation: {
                problemStatement: problem.description,
                io: [],
                constraints: [],
                note: impl.explanation,
                steps: [],
                useCase: problem.useCases ? problem.useCases.join(', ') : '',
                tips: []
            },
            companyTags: problem.companies,
            difficulty: difficultyMap[problem.difficulty] || 'intermediate',
            listType: 'blind75',
            visualizationUrl: '',
            commonNotes: '',
            commonWhiteBoard: '',
            implementations: implementations,
            overview: impl.explanation,
            timeComplexity: problem.timeComplexity,
            spaceComplexity: problem.spaceComplexity,
            tutorials: problem.youtubeUrl ? [{
                type: 'youtube',
                url: problem.youtubeUrl,
                credits: 'NeetCode',
                moreInfo: ''
            }] : [],
            likes: 0,
            dislikes: 0,
            problemsToSolve: {
                internal: [],
                external: [{
                    type: difficultyMap[problem.difficulty] || 'intermediate',
                    url: problem.leetcodeSearch,
                    title: 'LeetCode Problem'
                }]
            },
            imageUrls: [],
            testCases: [],
            inputSchema: [],
            availableLanguages: 'typeScript,python,java,cpp',
            editorialId: '',
            userCompletionGraphData: {
                attempted: 0,
                completed: 0
            },
            shareCount: 0
        };

        output += `  "${problem.slug}": ${JSON.stringify(algo, null, 4)},\n`;
    }

    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'blind75_entries.txt'), output);
    console.log('Generated blind75_entries.txt');
}

generate();
