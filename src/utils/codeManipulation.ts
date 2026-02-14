import { Language } from '@/components/CodeRunner/LanguageSelector';

interface CandidateFunction {
    name: string;
    argCount: number;
    argsStr: string; // [NEW] Store the raw argument string (e.g., "int[] nums, int k")
    returnType?: string; // [NEW] Store return type
    isPublic: boolean;
    isSolutionValues: boolean;
    index: number; // Appearance order
}

export interface EntryFunctionInfo {
    name: string;
    argsStr: string;
    hasSolutionClass: boolean;
    returnType?: string;
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
 * Strips comments from code string based on language.
 */
export function stripComments(code: string, language: Language): string {
    if (language === 'python') {
        // Python: Strip # comments and '''/""" docstrings
        // Naive stripping of docstrings (non-greedy) and hash comments
        return code.replace(/'''[\s\S]*?'''|"""[\s\S]*?"""|#.*/g, "");
    }
    // Default (C/C++/Java/TS): Strip // and / * ... * /
    return code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
}

/**
 * Finds the best entry point function in the user code based on signature matching.
 */
export function findEntryFunction(
    userCode: string,
    language: Language,
    inputSchema: any[],
    metadataFunctionName?: string
): { name: string, argsStr: string, hasSolutionClass: boolean, returnType?: string } {

    // Detect if "class Solution" is present (naive check but effective for LeetCode style)
    const hasSolutionClass = /class\s+Solution/.test(userCode);

    // Work on code without comments to avoid false positive function matches
    const codeToScan = stripComments(userCode, language);

    const expectedArgCount = inputSchema.length;
    const candidates: CandidateFunction[] = [];

    switch (language) {
        case 'typescript':
            // defined as: function name(...) or const/let/var name = (...) => or name = function(...)
            // Simple heuristic to catch common definitions
            // Group 1: Name, Group 2: Args
            const tsRegex = /(?:function\s+(\w+)\s*\(([^)]*)\))|(?:(?:const|let|var)\s+(\w+)\s*=\s*(?:function\s*\(([^)]*)\)|\(([^)]*)\)\s*=>))/g;
            let tsMatch;
            while ((tsMatch = tsRegex.exec(codeToScan)) !== null) {
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
            while ((pyMatch = pyRegex.exec(codeToScan)) !== null) {
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
            // (.+?) : Return type (Lazy capture allows spaces, commas, refs, pointers without greediness)
            // (\w+) : Method Name
            // \s*\( : Start of args
            // ([^)]*) : Args content
            // \) : End of args
            const cStyleRegex = /(?:((?:public|private|protected|static)\s+)*)(.+?)\s+(\w+)\s*\(([^)]*)\)/g;

            let cMatch;
            while ((cMatch = cStyleRegex.exec(codeToScan)) !== null) {
                const modifiers = cMatch[1] || "";
                const returnType = cMatch[2].trim();
                const name = cMatch[3]; // Adjusted index due to lazy group
                const args = cMatch[4] || "";

                // Exclude keywords and known Class constructors
                if (/^(if|for|while|switch|catch|return|Node|ListNode|TreeNode|Interval|Solution)$/.test(name)) continue;

                candidates.push({
                    name: name,
                    argCount: countArguments(args),
                    argsStr: args,
                    returnType: returnType,
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
        // Fallback Strategy:
        // 1. If we found ANY candidates, try to find one that matches the metadata name (ignoring arg count).
        if (candidates.length > 0) {
            const nameMatch = candidates.find(c => c.name === metadataFunctionName);
            if (nameMatch) return { name: nameMatch.name, argsStr: nameMatch.argsStr, hasSolutionClass, returnType: nameMatch.returnType };

            // 2. If no name match, just return the first candidate (likely the main function)
            // This is better than returning a ghost name "valid" that causes compilation errors.
            return { name: candidates[0].name, argsStr: candidates[0].argsStr, hasSolutionClass, returnType: candidates[0].returnType };
        }

        // 3. If NO candidates found at all (parsing failed completely), return metadata name or default.
        if (metadataFunctionName) return { name: metadataFunctionName, argsStr: '', hasSolutionClass };
        return { name: 'solution', argsStr: '', hasSolutionClass };
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

    return { name: validCandidates[0].name, argsStr: validCandidates[0].argsStr, hasSolutionClass, returnType: validCandidates[0].returnType };
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
