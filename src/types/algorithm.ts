export enum ListType {
    Core = 'core',
    Blind75 = 'blind75',
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
