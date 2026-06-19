export type Language = 'cpp' | 'java' | 'python' | 'typescript' | 'javascript' | 'c' | 'sql';

export enum ListType {
    Core = 'core',
    Blind75 = 'blind75',
    Blind150 = 'blind150',
    SqlBasics = 'sql-basics',
}

export const LIST_TYPE_LABELS: Record<string, string> = {
    'all': 'All Problems',
    [ListType.Core]: 'Core',
    [ListType.Blind75]: 'Blind 75',
    [ListType.Blind150]: 'Rulcode 150',
    [ListType.SqlBasics]: 'SQL Basics',
};

export const DIFFICULTY_MAP: Record<string, string> = {
    'beginner': 'Easy',
    'begineers': 'Easy',
    'beginners': 'Easy',
    'easy': 'Easy',

    'intermediate': 'Medium',
    'intermeditate': 'Medium',
    'intermediated': 'Medium',
    'medium': 'Medium',

    'advance': 'Hard',
    'advanced': 'Hard',
    'advacned': 'Hard',
    'expert': 'Hard',
    'hard': 'Hard'
};

export interface AlgorithmListItem {
    id: string;
    title: string; // or name
    slug?: string;
    category: string;
    difficulty: string;
    description: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    companies?: string[];
    listType?: string;
    listTypes?: string[];
    categories?: string[];
    problemType?: string;
    is_premium?: boolean;
    serial_no?: number;
    metadata?: any;
    controls?: any;
    published?: boolean;
    [key: string]: any;
}

export interface Algorithm {
    id: string;
    name: string;
    title: string;
    slug?: string;
    category: string;
    categories?: string[];
    difficulty: string;
    description: string;
    explanation: any; // JSON or string
    implementations: any; // JSON or string,
    test_cases: any;
    input_schema: any;
    problems_to_solve: any;
    tutorials: any;
    metadata: any;
    controls: any;
    list_type?: string;
    list_types?: string[];
    problemType?: string;
    db_setup?: string;
    is_premium?: boolean;
    serial_no?: number;
    timeComplexity?: string;
    spaceComplexity?: string;
    company_tags?: string[];
    published?: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}
