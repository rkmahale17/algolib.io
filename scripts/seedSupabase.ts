import { createClient } from '@supabase/supabase-js';
import { algorithmsDB } from '../src/data/algorithmsDB';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    console.error('Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.');
    console.error('You can find it in your Supabase project settings under API > service_role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAlgorithms() {
    console.log('Starting seed process...');

    const algorithms = Object.values(algorithmsDB);

    for (const algo of algorithms) {
        console.log(`Seeding algorithm: ${algo.name}`);

        const { error } = await supabase
            .from('algorithms')
            .upsert({
                id: algo.id,
                title: algo.title,
                name: algo.name,
                category: algo.category,
                difficulty: algo.difficulty,
                description: algo.explanation.problemStatement,
                explanation: algo.explanation,
                implementations: algo.implementations,
                problems_to_solve: algo.problemsToSolve,
                test_cases: algo.testCases,
                input_schema: algo.inputSchema,
                tutorials: algo.tutorials,
                metadata: {
                    likes: algo.likes,
                    dislikes: algo.dislikes,
                    visualizationUrl: algo.visualizationUrl,
                    commonNotes: algo.commonNotes,
                    commonWhiteBoard: algo.commonWhiteBoard,
                    companyTags: algo.companyTags,
                    listType: algo.listType,
                    overview: algo.overview,
                    timeComplexity: algo.timeComplexity,
                    spaceComplexity: algo.spaceComplexity,
                    availableLanguages: algo.availableLanguages,
                    editorialId: algo.editorialId,
                    userCompletionGraphData: algo.userCompletionGraphData,
                    shareCount: algo.shareCount,
                    imageUrls: algo.imageUrls
                }
            });

        if (error) {
            console.error(`Error seeding ${algo.name}:`, error);
        } else {
            console.log(`Successfully seeded ${algo.name}`);
        }
    }

    console.log('Seed process completed.');
}

seedAlgorithms();
