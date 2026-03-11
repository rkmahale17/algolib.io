import { Language } from '@/components/CodeRunner/LanguageSelector';

/**
 * Splits C++ code into headers (includes, usings, defines) and the rest of the body.
 * This ensures headers stay in global scope when wrapping the rest in a namespace.
 */
export function splitCppCode(code: string): { headers: string, body: string } {
    const includeRegex = /^\s*(#include|using\s+namespace|#define|typedef|using\s+\w+\s*=)/;
    const lines = code.split('\n');
    let splitIdx = 0;
    let inComment = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (inComment) {
            if (trimmed.includes('*/')) inComment = false;
            splitIdx = i + 1;
            continue;
        }

        if (trimmed.startsWith('/*')) {
            inComment = !trimmed.includes('*/');
            splitIdx = i + 1;
            continue;
        }

        if (includeRegex.test(line) || trimmed === '' || trimmed.startsWith('//')) {
            splitIdx = i + 1;
            continue;
        }

        // Stop at first non-header, non-empty, non-comment line
        break;
    }

    return {
        headers: lines.slice(0, splitIdx).join('\n'),
        body: lines.slice(splitIdx).join('\n')
    };
}

/**
 * Extracts function signatures from C++ code to use as forward declarations.
 */
export function extractCppSignatures(code: string): string[] {
    const codeToScan = stripComments(code, 'cpp');

    // Identify top-level function/class signatures by skipping bodies
    let result = '';
    let i = 0;
    while (i < codeToScan.length) {
        if (codeToScan[i] === '{') {
            result += ' { } ';
            let depth = 1;
            i++;
            while (i < codeToScan.length && depth > 0) {
                if (codeToScan[i] === '{') depth++;
                else if (codeToScan[i] === '}') depth--;
                i++;
            }
        } else {
            result += codeToScan[i];
            i++;
        }
    }

    // Regex to match function definitions, excluding keywords like if/while/etc.
    // Matches signatures ending in { (which we replaced with { } above)
    const cStyleRegex = /(?:((?:public|private|protected|static)\s+)*)([\w<>:*&\[\]\s]+?)\s+(\w+)\s*\(([\s\S]*?)\)\s*\{/g;

    const signatures: string[] = [];
    const seenNames = new Set<string>();

    let match;
    while ((match = cStyleRegex.exec(result)) !== null) {
        const returnType = match[2].trim();
        const name = match[3].trim();
        const args = match[4].replace(/\s+/g, ' ').trim();

        const exclusionList = /^(if|for|while|switch|catch|return|Solution|main)$/;
        if (exclusionList.test(name)) continue;
        if (returnType.includes('~') || returnType.includes('class') || returnType.includes('struct') || returnType.includes('public') || returnType.includes('private')) continue;

        if (!seenNames.has(name)) {
            signatures.push(`${returnType} ${name}(${args});`);
            seenNames.add(name);
        }
    }
    return signatures;
}

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
        case 'cpp': {
            // Helper to extract the body of the first class/struct named 'Solution'
            const extractClassBody = (code: string): string | null => {
                const classStart = code.search(/\b(class|struct)\s+Solution\b/);
                if (classStart === -1) return null;
                let depth = 0;
                let bodyStart = -1;
                for (let i = classStart; i < code.length; i++) {
                    if (code[i] === '{') {
                        if (depth === 0) bodyStart = i + 1;
                        depth++;
                    } else if (code[i] === '}') {
                        depth--;
                        if (depth === 0 && bodyStart !== -1) {
                            return code.slice(bodyStart, i);
                        }
                    }
                }
                return null;
            };

            // Helper to strip all class/struct bodies from code (to scan only global functions)
            const stripClassBodies = (code: string): string => {
                let result = '';
                let depth = 0;
                let i = 0;
                // Simple approach: track brace depth, include code at depth 0 only
                while (i < code.length) {
                    if (code[i] === '{') {
                        depth++;
                        i++;
                    } else if (code[i] === '}') {
                        if (depth > 0) depth--;
                        i++;
                    } else if (depth === 0) {
                        result += code[i];
                        i++;
                    } else {
                        i++;
                    }
                }
                return result;
            };

            // Determine the code region to scan for functions
            let scanRegion: string;
            let insideClass = false;

            if (hasSolutionClass) {
                const classBody = extractClassBody(codeToScan);
                if (classBody) {
                    scanRegion = classBody;
                    insideClass = true;
                } else {
                    scanRegion = codeToScan;
                }
            } else {
                // Only scan global scope - strip class bodies to avoid picking up member methods
                scanRegion = stripClassBodies(codeToScan);
            }

            // Regex explanation:
            // ((?:public|private|protected|static)\s+)* : Optional modifiers
            // ([\w<>:*&\[\]\s]+?) : Return type (restrictive to avoid matching too much, now includes [])
            // (\w+) : Method Name
            // \s*\( : Start of args
            // ([\s\S]*?) : Args content (allowing multiline)
            // \) : End of args
            const cStyleRegex = /(?:((?:public|private|protected|static)\s+)*)([\w<>:*&\[\]\s]+?)\s+(\w+)\s*\(([\s\S]*?)\)/g;

            let cMatch;
            while ((cMatch = cStyleRegex.exec(scanRegion)) !== null) {
                const modifiers = cMatch[1] || '';
                const returnType = cMatch[2].trim();
                const name = cMatch[3];
                const args = cMatch[4] || '';

                // Exclude flow-control keywords and known constructors/type names
                const exclusionList = insideClass
                    ? /^(if|for|while|switch|catch|return|Solution)$/
                    : /^(if|for|while|switch|catch|return|Node|ListNode|TreeNode|Interval|Solution)$/;
                if (exclusionList.test(name)) continue;

                // Exclude destructor-like (~name)
                if (returnType.includes('~')) continue;

                candidates.push({
                    name,
                    argCount: countArguments(args),
                    argsStr: args,
                    returnType,
                    isPublic: modifiers.includes('public') || (!modifiers.includes('private') && insideClass),
                    isSolutionValues: name.toLowerCase().includes('solution') || name.toLowerCase() === 'solve',
                    index: cMatch.index
                });
            }
            break;
        }
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
    const commonTypes = '(?:int|void|boolean|char|double|float|long|short|String|List(?:<[^>]+>)?|Set(?:<[^>]+>)?|Map(?:<[^>]+>)?|TreeNode|ListNode)(?:\\[\\])*';
    // Look for: whitespace + Type + Name + ( ...
    // Negative lookbehind ensures we don't match if preceded by modifiers or keywords
    const defaultAccessRegex = new RegExp(`(?<!public|private|protected|static|new|return|case|default|transient|volatile|final|native|synchronized|abstract|strictfp)\\s+(${commonTypes})\\s+(\\w+)\\s*\\(`, 'g');

    userCodeClean = userCodeClean.replace(defaultAccessRegex, (match, type, name) => {
        return ` static ${type} ${name}(`;
    });

    return userCodeClean;
}

/**
 * Robustly extracts the type from a language-specific argument string.
 * e.g. "vector<int> &nums" -> "vector<int> &"
 * e.g. "List<Integer> list" -> "List<Integer>"
 */
export function extractType(arg: string, language: Language): string {
    const trimmed = arg.trim();
    if (language === 'python') {
        const parts = trimmed.split(':');
        return parts.length > 1 ? parts[1].trim() : 'any';
    }

    // C++/Java: Find the last identifier which is the variable name
    // Match anything before the last word. Handle refs/pointers for C++.
    // Improved regex: require either whitespace before the name OR it to be preceded by & or *
    // This prevents "char" being split into "c" and "har"
    const match = trimmed.match(/^(.+?)(?:\s+|(?=[&*]))(&|\*)?\s*\w+$/);
    if (match) {
        return (match[1] + (match[2] || '')).trim();
    }

    // Fallback: split by space and take everything but the last word
    const parts = trimmed.split(/\s+/);
    if (parts.length > 1) return parts.slice(0, parts.length - 1).join(' ');

    return trimmed;
}
