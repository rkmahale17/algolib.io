import { Language } from '@/components/CodeRunner/LanguageSelector';

interface CandidateFunction {
    name: string;
    argCount: number;
    argsStr: string; // [NEW] Store the raw argument string (e.g., "int[] nums, int k")
    isPublic: boolean;
    isSolutionValues: boolean;
    index: number; // Appearance order
}

export interface EntryFunctionInfo {
    name: string;
    argsStr: string;
}

/**
 * Counts arguments in a function signature string, handling nested generics/parentheses.
 * e.g. "int a, List<Integer> b" -> 2
 */
function countArguments(argsStr: string): number {
    if (!argsStr || argsStr.trim() === '') return 0;

    let count = 1;
    let depth = 0; // Parentheses/Angle brackets depth

    for (const char of argsStr) {
        if (char === '<' || char === '(' || char === '[') depth++;
        else if (char === '>' || char === ')' || char === ']') depth--;
        else if (char === ',' && depth === 0) count++;
    }

    return count;
}

/**
 * Finds the best entry point function in the user code based on signature matching.
 */
/**
 * Finds the best entry point function in the user code based on signature matching.
 */
export function findEntryFunction(
    userCode: string,
    language: Language,
    inputSchema: any[],
    metadataFunctionName?: string
): EntryFunctionInfo {
    const expectedArgCount = inputSchema.length;
    const candidates: CandidateFunction[] = [];

    switch (language) {
        case 'typescript':
            // defined as: function name(...) or const/let/var name = (...) => or name = function(...)
            // Simple heuristic to catch common definitions
            // Group 1: Name, Group 2: Args
            const tsRegex = /(?:function\s+(\w+)\s*\(([^)]*)\))|(?:(?:const|let|var)\s+(\w+)\s*=\s*(?:function\s*\(([^)]*)\)|\(([^)]*)\)\s*=>))/g;
            let tsMatch;
            while ((tsMatch = tsRegex.exec(userCode)) !== null) {
                const name = tsMatch[1] || tsMatch[3];
                const args = tsMatch[2] || tsMatch[4] || tsMatch[5] || "";
                if (name) {
                    candidates.push({
                        name,
                        argCount: countArguments(args),
                        argsStr: args,
                        isPublic: true, // TS functions are effectively public in this context
                        isSolutionValues: name.toLowerCase().includes('solution') || name.toLowerCase() === 'solve',
                        index: tsMatch.index
                    });
                }
            }
            break;

        case 'python':
            // def name(...):
            const pyRegex = /def\s+(\w+)\s*\(([^)]*)\)/g;
            let pyMatch;
            while ((pyMatch = pyRegex.exec(userCode)) !== null) {
                candidates.push({
                    name: pyMatch[1],
                    argCount: countArguments(pyMatch[2]),
                    argsStr: pyMatch[2],
                    isPublic: true,
                    isSolutionValues: pyMatch[1].toLowerCase().includes('solution') || pyMatch[1].toLowerCase() === 'solve',
                    index: pyMatch.index
                });
            }
            break;

        case 'java':
        case 'cpp':
            // public type name(...) or type name(...)
            // We scan for typical C-style function headers. 
            // Exclude keywords like if, for, while, switch, catch

            // Regex explanation:
            // ((?:public|private|protected|static)\s+)* : Optional modifiers
            // (?:[\w<>[\]]+\s+) : Return type (simplified)
            // (\w+) : Method Name
            // \s*\( : Start of args
            // ([^)]*) : Args content
            // \) : End of args
            const cStyleRegex = /(?:((?:public|private|protected|static)\s+)*)(?:[\w<>[\]]+\s+)(\w+)\s*\(([^)]*)\)/g;

            let cMatch;
            while ((cMatch = cStyleRegex.exec(userCode)) !== null) {
                const modifiers = cMatch[1] || "";
                const name = cMatch[2];
                const args = cMatch[3] || "";

                // Exclude keywords
                if (/^(if|for|while|switch|catch)$/.test(name)) continue;

                candidates.push({
                    name: name,
                    argCount: countArguments(args),
                    argsStr: args,
                    isPublic: modifiers.includes('public'),
                    isSolutionValues: name.toLowerCase().includes('solution') || name.toLowerCase() === 'solve',
                    index: cMatch.index
                });
            }
            break;
    }

    // Filter Step: Must match argument count
    const validCandidates = candidates.filter(c => c.argCount === expectedArgCount);

    if (validCandidates.length === 0) {
        // Fallback: If no valid signature match, try to use the first found function 
        // that matches naive regex from before (legacy behavior)
        // Or if metadata name is present but signature didn't match (maybe parsing error?), return it anyway.
        if (metadataFunctionName) return { name: metadataFunctionName, argsStr: '' };

        // Ultimate fallback to existing naive logic if our parser fails completely
        // Return 'solution' as a safe default if absolutely nothing is found
        return candidates.length > 0 ? { name: candidates[0].name, argsStr: candidates[0].argsStr } : { name: 'solution', argsStr: '' };
    }

    // Ranking Logic
    // 1. Metadata Function Name Match
    // 2. Name is 'solution' or 'solve'
    // 3. Public (for Java/Cpp)
    // 4. Order (prefer later defined? or earlier? usually Solution is the "main" one).
    // Let's trust 'Solution' naming convention heavily.

    validCandidates.sort((a, b) => {
        // 1. Exact Metadata Match
        if (metadataFunctionName) {
            if (a.name === metadataFunctionName) return -1;
            if (b.name === metadataFunctionName) return 1;
        }

        // 2. Name "solution"
        if (a.isSolutionValues && !b.isSolutionValues) return -1;
        if (!a.isSolutionValues && b.isSolutionValues) return 1;

        // 3. Public Modifier (Java/Cpp)
        if (a.isPublic && !b.isPublic) return -1;
        if (!a.isPublic && b.isPublic) return 1;

        // 4. Stability (preserve order or pick first?)
        return a.index - b.index;
    });

    return { name: validCandidates[0].name, argsStr: validCandidates[0].argsStr };
}

/**
 * Ensures all methods in Java code are static to avoid context errors.
 */
export function ensureStaticMethods(userCode: string): string {
    let userCodeClean = userCode;

    // Normalize "static public" to "public static"
    userCodeClean = userCodeClean.replace(/static\s+(public|private|protected)/g, '$1 static');

    // 1. explicit modifiers: public/private/protected
    userCodeClean = userCodeClean.replace(/(public|private|protected)\s+(?!static|class|interface|enum|record)/g, '$1 static ');

    // 2. default access modifier (heuristic)
    const commonTypes = 'int|void|boolean|char|double|float|long|short|String|List(?:<[^>]+>)?|Set(?:<[^>]+>)?|Map(?:<[^>]+>)?|TreeNode|ListNode';
    // Look for: whitespace + Type + Name + ( ...
    // Negative lookbehind ensures we don't match if preceded by modifiers or keywords
    const defaultAccessRegex = new RegExp(`(?<!public|private|protected|static|new|return|case|default|transient|volatile|final|native|synchronized|abstract|strictfp)\\s+(${commonTypes})\\s+(\\w+)\\s*\\(`, 'g');

    userCodeClean = userCodeClean.replace(defaultAccessRegex, (match, type, name) => {
        return ` static ${type} ${name}(`;
    });

    return userCodeClean;
}
