export enum ListType {
    Core = 'core',
    Blind75 = 'blind-75',
    CoreAndBlind75 = 'core+blind75',
}

export const LIST_TYPE_LABELS: Record<ListType, string> = {
    [ListType.Core]: 'Core Algorithms',
    [ListType.Blind75]: 'Blind 75',
    [ListType.CoreAndBlind75]: 'Core + Blind 75',
};

export const LIST_TYPE_OPTIONS = [
    { value: ListType.Core, label: LIST_TYPE_LABELS[ListType.Core] },
    { value: ListType.CoreAndBlind75, label: LIST_TYPE_LABELS[ListType.CoreAndBlind75] },
]; ``
export const LIST_TYPE_OPTIONS_ADMIN = [
    { value: ListType.Core, label: LIST_TYPE_LABELS[ListType.Core] },
    { value: ListType.Blind75, label: LIST_TYPE_LABELS[ListType.Blind75] },
    { value: ListType.CoreAndBlind75, label: LIST_TYPE_LABELS[ListType.CoreAndBlind75] },
];

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
    serial_no?: number;
    [key: string]: any;
}

export interface Algorithm {
    id: string;
    name: string;
    title: string;
    slug?: string;
    category: string;
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
    serial_no?: number;
    timeComplexity?: string;
    spaceComplexity?: string;
    company_tags?: string[];
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}
