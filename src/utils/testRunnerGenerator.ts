import { Language } from '@/components/CodeRunner/LanguageSelector';
import { findEntryFunction, ensureStaticMethods, stripComments } from './codeManipulation';
import { getDSDetails, DSName, SUPPORTED_DS } from '@/lib/dsa-registry';

export const getRegistryCode = (inputSchema: any[], language: Language, userCode: string) => {
    const required = new Set<DSName>();
    const types = inputSchema.map(i => i.type);

    // Also check explicit return type if possible, but for now scan input schema
    // We ideally need the Algo Meta to know the Return Type if it's a DS
    // But usually return type is same as input or standard.
    // For "Reverse Linked List", return is ListNode.
    // Hack: check if input has ListNode, assume we need it. 
    // If output is ListNode, we need it too.
    // We can just inject ALL DS present in headers/inputs.

    types.forEach(t => {
        if (!t) return;
        const typeStr = String(t).toLowerCase();
        SUPPORTED_DS.forEach(ds => {
            // Use regex for whole-word matching to avoid 'Node' matching 'TreeNode'
            // Escape special chars in DS name just in case (though currently they are simple)
            const dsLower = ds.toLowerCase();
            const escaped = dsLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`);
            if (regex.test(typeStr)) required.add(ds);
        });
    });

    // Fallback: Scan userCode for DS usage if Schema is empty or incomplete
    SUPPORTED_DS.forEach(ds => {
        // Check for presence of Class Name in user code (e.g. "ListNode")
        // Mapping: GraphNode -> Node
        let className = ds;
        if (ds === 'GraphNode') className = 'Node';

        // Simple check: if the code mentions the class name, we PROBABLY need the helpers.
        // We use word boundary to avoid partial matches
        const regex = new RegExp(`\\b${className}\\b`);
        if (regex.test(userCode)) {
            required.add(ds);
        }
    });

    // Cleanup: If both 'Node' and 'GraphNode' are present, remove 'Node'
    // because they map to the same underlying class and helpers, causing duplicates.
    // Since 'Node' is the alias for 'GraphNode', we can just use 'GraphNode' canonically.
    if (required.has('Node') && required.has('GraphNode')) {
        required.delete('Node');
    } else if (required.has('Node')) {
        // If only 'Node' is present, swap it to 'GraphNode' to ensure we use the main definition?
        // Actually, we added 'Node' to registry, so it has its own entry.
        // But if 'converters.ts' has duplicated function names (e.g. jsonToGraphNode), we have a problem.
        // Let's force 'Node' -> 'GraphNode' mapping here and ignore 'Node' key in registry for injection purposes relative to 'GraphNode'.
        required.delete('Node');
        required.add('GraphNode');
    }

    // If we have ListNode input, we likely need ListNode output serializer.
    // If we have TreeNode input, we likely need output serializer.

    let definitions = "";
    let parsers = "";
    let serializers = "";

    required.forEach(ds => {
        const details = getDSDetails(ds, language);
        if (details) {
            // Check if user code already defines it (robust check ignoring comments)
            // Regex explanations:
            // (^|\n): Start of string or newline
            // (?!\s*(\/\/|#|\*)): Lookahead to ensure line doesn't start with comment chars
            // \s*: Optional, variable indentation
            // (class|struct|def): Keywords (def for Python, class/struct for others)
            // \s+: At least one space
            // ${ds}: The class name
            // \b: Word boundary
            // Mapping DS Name to actual class name in definitions
            let className = ds;
            if (ds === 'GraphNode') className = 'Node';

            // Robust check: Strip comments first to avoid false positives (e.g. commented out definitions)
            const cleanUserCode = stripComments(userCode, language);

            const pattern = new RegExp(`(^|\\n)\\s*(class|struct|def)\\s+${className}\\b`, 'm');
            const alreadyDefined = pattern.test(cleanUserCode);

            if (!alreadyDefined) {
                definitions += details.definition + "\n";
            }
            parsers += details.parser + "\n";
            serializers += details.serializer + "\n";
        }
    });

    return { definitions, parsers, serializers, requiredDS: Array.from(required) };
};


interface TestCase {
    input: any[];
    expectedOutput: any;
}

/**
 * Generates a complete test runner that combines user code with test harness.
 * 
 * WHAT IS SENT TO THE JUDGE:
 * ===========================
 * The judge receives a COMPLETE, EXECUTABLE code file containing:
 * 1. User's function code (the solution they wrote)
 * 2. Generated test harness that:
 *    - Formats test case inputs according to the language (arrays, lists, etc.)
 *    - Calls the user's function with formatted inputs
 *    - Captures the actual output
 *    - Compares actual vs expected output
 *    - Returns results as JSON between markers: ___TEST_RESULTS_START___ and ___TEST_RESULTS_END___
 * 
 * COMPATIBILITY:
 * ==============
 * - TypeScript: Uses JSON.stringify for all values
 * - Python: Converts JSON to Python syntax (True/False/None, lists)
 * - Java: Uses formatJavaArrayLiteral for arrays (handles int[], int[][], String[][], char[][], etc.)
 * - C++: Uses vector initialization syntax with type deduction
 * 
 * 2D ARRAY HANDLING:
 * ==================
 * - Input schema supports: number[][], string[][], char[][]
 * - Test case format: input is an array, e.g., [[[1,2],[3,4]]] for a 2D array parameter
 * - Each language's formatValue/formatLiteral handles the nested structure appropriately
 */
export const generateTestRunner = (
    userCode: string,
    language: Language,
    testCases: TestCase[],
    inputSchema: any[],
    entryFunctionName?: string,
    options?: { unordered?: boolean; multiExpected?: boolean; returnModifiedInput?: boolean; modifiedInputIndex?: number }
): string => {
    switch (language) {
        case 'typescript':
            return generateTypeScriptRunner(userCode, testCases, inputSchema, entryFunctionName, options);
        case 'python':
            return generatePythonRunner(userCode, testCases, inputSchema, entryFunctionName, options);
        case 'java':
            return generateJavaRunner(userCode, testCases, inputSchema, entryFunctionName, options);
        case 'cpp':
            return generateCppRunner(userCode, testCases, inputSchema, entryFunctionName, options);
        default:
            return userCode;
    }
};

const formatValue = (value: any, type: string, lang: Language, targetJavaType?: string): string => {
    // DS Construction Helpers
    if (type.includes('ListNode')) {
        if (lang === 'typescript') return `jsonToListNode(${JSON.stringify(value)})`;
        if (lang === 'python') return `json_to_list_node(${jsonToPython(value)})`;
        if (lang === 'java') return `jsonToListNode(${JSON.stringify(JSON.stringify(value))})`; // Pass as JSON string
        if (lang === 'cpp') return `jsonToListNode(${formatValue(value, 'number[]', 'cpp')})`; // Pass as vector
    }
    if (type.includes('TreeNode')) {
        if (lang === 'typescript') return `jsonToTreeNode(${JSON.stringify(value)})`;
        if (lang === 'python') return `json_to_tree_node(${jsonToPython(value)})`;
        if (lang === 'java') return `arrayToTreeNode(${formatJavaArrayLiteral(value, 'Integer[]')})`;
        if (lang === 'cpp') return `jsonToTreeNode(${formatValue(value.map((v: any) => v === null ? "null" : String(v)), 'string[]', 'cpp')})`;
    }
    if (type.includes('Interval')) {
        if (type.includes('[]')) {
            // Array of Intervals
            if (lang === 'typescript') return `jsonToIntervalArray(${JSON.stringify(value)})`;
            if (lang === 'python') return `json_to_interval_array(${jsonToPython(value)})`;
            if (lang === 'java') return `jsonToIntervalArray(${formatJavaArrayLiteral(value, 'int[][]')})`;
            if (lang === 'cpp') return `jsonToIntervalArray(${formatValue(value, 'int[][]', 'cpp')})`;
        } else {
            if (lang === 'typescript') return `jsonToInterval(${JSON.stringify(value)})`;
            if (lang === 'python') return `json_to_interval(${jsonToPython(value)})`;
            if (lang === 'java') return `jsonToInterval(${formatJavaArrayLiteral(value, 'int[]')})`;
            if (lang === 'cpp') return `jsonToInterval(${formatValue(value, 'int[]', 'cpp')})`;
        }
    }

    if (type.includes('GraphNode') || type.includes('Node')) {
        const val = typeof value === 'string' ? JSON.parse(value) : value; // Handle potentially stringified inputs
        if (lang === 'typescript') return `jsonToGraphNode(${JSON.stringify(val)})`;
        if (lang === 'python') return `json_to_graph_node(${jsonToPython(val)})`;
        if (lang === 'java') return `jsonToGraphNode(${formatJavaArrayLiteral(val, 'int[][]')})`;
        if (lang === 'cpp') return `jsonToGraphNode(${formatValue(val, 'int[][]', 'cpp')})`;
    }
    if (type.includes('TrieNode')) {
        if (lang === 'typescript') return `jsonToTrieNode(${JSON.stringify(value)})`;
        if (lang === 'python') return `json_to_trie_node(${jsonToPython(value)})`;
        if (lang === 'java') return `jsonToTrieNode("${JSON.stringify(value).replace(/"/g, '\\"')}")`; // Fallback
        if (lang === 'cpp') return `jsonToTrieNode("${JSON.stringify(value).replace(/"/g, '\\"')}")`;
    }


    if (lang === 'python') {
        return jsonToPython(value);
    }
    if (lang === 'typescript') {
        return JSON.stringify(value);
    }

    // Legacy/Specific handling for Java/C++
    if (type === 'number' || type === 'boolean') return String(value);
    if (type === 'string') return JSON.stringify(value);
    if (type === 'number[]' || type === 'int[]') { // Added int[] for robustness
        if (lang === 'java') {
            if (targetJavaType && targetJavaType.includes('List')) {
                return `Arrays.asList(${value.join(', ')})`;
            }
            return formatJavaArrayLiteral(value, targetJavaType);
        }
        if (lang === 'cpp') {
            // Recursive vector syntax
            return `{${value.map(v => formatValue(v, 'number', 'cpp')).join(', ')}}`;
        }
        return `[${value.join(', ')}]`;
    }
    if (type.includes('[]')) {
        // Generic multi-dimensional array handling if not caught above
        if (lang === 'cpp' && Array.isArray(value)) {
            const subType = type.substring(0, type.lastIndexOf('[]'));
            return `{${value.map(v => formatValue(v, subType, 'cpp')).join(', ')}}`;
        }
    }

    if (Array.isArray(value)) { // Generic array handling for Java/C++ fallback (Moved to end)
        if (lang === 'java') {
            // Check if target expects a List
            if (targetJavaType && targetJavaType.includes('List')) {
                if (value.length > 0 && typeof value[0] === 'string') {
                    return `Arrays.asList(${value.map((v: any) => JSON.stringify(v)).join(', ')})`;
                }
                // List<Integer> etc - Autoboxing handles int -> Integer? Arrays.asList expects objects.
                return `Arrays.asList(${value.join(', ')})`;
            }

            // Detect dimensions and type for Java Array
            return formatJavaArrayLiteral(value, targetJavaType);
        }
        if (lang === 'cpp') {
            // Basic vector syntax - only reached if type didn't match [] patterns
            return `{${value.map(v => formatValue(v, 'any', 'cpp')).join(', ')}}`; // Use recursive formatting even here!
        }
    }
    return String(value);
};

/**
 * Recursively formats Java array literals for all dimensions.
 * 
 * HANDLES:
 * - 1D arrays: int[], String[], char[], boolean[]
 * - 2D arrays: int[][], String[][], char[][]
 * - Higher dimensions: int[][][], etc.
 * 
 * TYPE DETECTION:
 * - Uses targetJavaType hint if provided (e.g., "char[][]" from method signature)
 * - Falls back to inferring from actual values (string -> String, number -> int)
 * 
 * EXAMPLES:
 * - [1, 2, 3] -> "new int[]{1, 2, 3}"
 * - [[1, 2], [3, 4]] -> "new int[][]{{1, 2}, {3, 4}}"
 * - [["a", "b"], ["c", "d"]] -> "new String[][]{{"a", "b"}, {"c", "d"}}"
 * - [['1', '0'], ['0', '1']] with targetJavaType="char[][]" -> "new char[][]{{'1', '0'}, {'0', '1'}}"
 */
const formatJavaArrayLiteral = (arr: any[], targetJavaType?: string): string => {
    if (!Array.isArray(arr)) return String(arr);

    // 1. Determine base type and dimensions
    // 1. Determine base type and dimensions
    let dimensions = 0;

    // Use target dimensions if available (handles empty cases like [[]] -> int[][])
    if (targetJavaType) {
        const matches = targetJavaType.match(/\[\]/g);
        if (matches) dimensions = matches.length;
    }

    // If no target type provided, infer from data (risky for empty nested arrays but better than failure)
    if (dimensions === 0) {
        let current: any = arr;
        // Check depth based on structure, even if empty
        while (Array.isArray(current)) {
            dimensions++;
            if (current.length > 0) {
                current = current[0];
            } else {
                // If it's empty, we stop drilling but we counted this level.
                // e.g. [[]] -> dim 1 (outer), current=[], dim 2 (inner), current=undefined loop end.
                // Wait, if current is [], isArray is true.
                // Next iter: dim incremented to 2. current.length is 0.
                // If we assume valid homogenous array, we can stop here.
                // But for `[]` (dim 1) -> we want dim 1.
                // dim starts at 0.
                // 1. Array.isArray(arr) -> true. dim=1. length check?
                // For `[[]]`:
                // 1. current=arr. isArray=true. dim=1. len>0? yes. current=arr[0] ([]).
                // 2. current=[]. isArray=true. dim=2. len>0? no. BREAK.
                // result: dim=2. Correct.

                // For `[]`:
                // 1. current=[]. isArray=true. dim=1. len>0? no. BREAK.
                // result: dim=1. Correct.
                break;
            }
        }
    }

    // If empty array, and we have a target type, just return empty init
    // e.g. new int[0][] is valid? No, new int[0][0] or new int[][]{}
    if (arr.length === 0 && targetJavaType) {
        const typeName = targetJavaType.replace(/\[\]/g, ''); // int
        return `new ${targetJavaType.replace('[]', '[0]')}`; // new int[0][] ? No.
        // Better: new int[][]{}
    }

    // ... logic continues ... except I replaced lines 272-307.
    // I need to be careful with "type" inference too.

    let type = 'int';
    if (targetJavaType) {
        type = targetJavaType.replace(/\[\]/g, '');
    } else {
        // Infer from content
        let current: any = arr;
        // drill down to first element
        while (Array.isArray(current) && current.length > 0) current = current[0];

        if (typeof current === 'string') {
            type = current.length === 1 ? 'char' : 'String';
        } else if (typeof current === 'boolean') {
            type = 'boolean';
        } else if (typeof current === 'number' && !Number.isInteger(current)) {
            type = 'double';
        }
    }

    const brackets = '[]'.repeat(dimensions);

    const generateContent = (a: any[]): string => {
        if (a.length === 0) return '{}';
        if (!Array.isArray(a[0])) {
            if (type === 'String') return `{${a.map(v => JSON.stringify(v)).join(', ')}}`;
            if (type === 'char') return `{${a.map(v => `'${v}'`).join(', ')}}`;
            if (type === 'boolean') return `{${a.join(', ')}}`;
            return `{${a.join(', ')}}`;
        }
        return `{${a.map((sub: any) => generateContent(sub)).join(', ')}}`;
    };

    return `new ${type}${brackets}${generateContent(arr)}`;
};


const jsonToPython = (val: any): string => {
    if (val === null || val === undefined) return 'None';
    if (val === true) return 'True';
    if (val === false) return 'False';
    if (Array.isArray(val)) {
        return `[${val.map(jsonToPython).join(', ')}]`;
    }
    if (typeof val === 'object') {
        return `{${Object.entries(val).map(([k, v]) => `"${k}": ${jsonToPython(v)}`).join(', ')}}`;
    }
    if (typeof val === 'string') {
        return JSON.stringify(val); // Handles escaping quotes safely
    }
    return String(val);
};

const generateTypeScriptRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[],
    entryFunctionName?: string,
    options?: { unordered?: boolean; multiExpected?: boolean; returnModifiedInput?: boolean; modifiedInputIndex?: number }
): string => {
    const entryInfo = findEntryFunction(userCode, 'typescript', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'typescript', userCode);

    const testCasesStr = testCases.map(tc => {
        // Use modified formatValue which calls builders
        const inputs = tc.input.map((val, i) => formatValue(val, inputSchema[i]?.type || 'any', 'typescript')).join(', ');
        const expectedOutput = JSON.stringify(tc.expectedOutput);
        return `{ input: [${inputs}], expected: ${expectedOutput} }`;
    }).join(',\n  ');

    return `
// Force module scope to avoid collision with DOM 'Node'
export {};
/// <reference lib="esnext" />
${definitions}
${parsers}
${serializers}

${userCode}

// Test Runner
const testCases = [
  ${testCasesStr}
];

const safeStringify = (obj: any) => {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) return '[Circular]';
            cache.add(value);
        }
        return value;
    });
};

const results = testCases.map((tc, index) => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args) => {
      logs.push(args.map(a => {
          try { 
            return typeof a === 'object' ? JSON.stringify(a) : String(a); 
          } catch(e) { 
            return String(a); 
          }
      }).join(' '));
  };

  try {
    const start = Date.now();
    let actual = ${userFuncName}.apply(null, tc.input);
    const end = Date.now();
    
    // Support in-place algorithms (e.g. sortColors) where return is void but input is modified
    if (${options?.returnModifiedInput ? 'true' : 'false'}) {
        actual = tc.input[${options?.modifiedInputIndex ?? 0}];
    }
    
    // Auto-serialize result before comparison if it's a DS
    let serializedActual = actual;
    try {
        ${requiredDS.includes('ListNode') ? `if (actual instanceof ListNode) serializedActual = listNodeToJson(actual);` : ''}
        ${requiredDS.includes('TreeNode') ? `if (actual instanceof TreeNode) serializedActual = treeNodeToJson(actual);` : ''}
        ${requiredDS.includes('Interval') ? `if (actual instanceof Interval) serializedActual = intervalToJson(actual);
        if (Array.isArray(actual) && actual.length > 0 && actual[0] instanceof Interval) serializedActual = intervalArrayToJson(actual);` : ''}
        ${requiredDS.includes('GraphNode') ? `if ((actual instanceof Node) || (actual && typeof actual === 'object' && 'neighbors' in actual && 'val' in actual)) serializedActual = graphNodeToJson(actual as Node);` : ''}
        ${requiredDS.includes('TrieNode') ? `if (actual instanceof TrieNode) serializedActual = trieNodeToJson(actual);` : ''}
    } catch(e) { serializedActual = "Serialization Failed: " + (e as Error).message; }
    
    const isEqual = (a, b) => {
      const normalize = (val) => {
        if (!${!!options?.unordered}) return val;
        // Recursive sort for unordered comparison
        if (Array.isArray(val)) return [...val].sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y))).map(normalize);
        return val;
      };
      return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
    };

    let passed = false;
    ${options?.multiExpected ? `
    if (Array.isArray(tc.expected)) {
        passed = (tc.expected as any[]).some(variant => isEqual(serializedActual, variant));
    } else {
        passed = isEqual(serializedActual, tc.expected);
    }` : `
    passed = isEqual(serializedActual, tc.expected);
    `}

    return {
      status: passed ? 'pass' : 'fail',
      input: tc.input.map(i => {
         // Try serialized form for proper display in frontend
         try {
             ${requiredDS.includes('ListNode') ? `if (i instanceof ListNode) return listNodeToJson(i);` : ''}
             ${requiredDS.includes('TreeNode') ? `if (i instanceof TreeNode) return treeNodeToJson(i);` : ''}
             ${requiredDS.includes('Interval') ? `if (i instanceof Interval) return intervalToJson(i);
             if (Array.isArray(i) && i.length > 0 && i[0] instanceof Interval) return intervalArrayToJson(i);` : ''}
             ${requiredDS.includes('GraphNode') ? `if ((i instanceof Node) || (i && typeof i === 'object' && 'neighbors' in i && 'val' in i)) return graphNodeToJson(i as Node);` : ''}
             ${requiredDS.includes('TrieNode') ? `if (i instanceof TrieNode) return trieNodeToJson(i);` : ''}
         } catch(e) { return "Serialization Failed: " + (e as Error).message; }
         return safeStringify(i);
      }),
      expected: tc.expected,
      actual: serializedActual,
      time: end - start,
      logs: logs
    };
  } catch (e) {
    return {
      status: 'error',
      input: tc.input,
      error: e.message,
      logs: logs
    };
  } finally {
    console.log = originalLog;
  }
});

console.log('___TEST_RESULTS_START___');
console.log(JSON.stringify(results));
console.log('___TEST_RESULTS_END___');

`;
};

const generatePythonRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[],
    entryFunctionName?: string,
    options?: { unordered?: boolean; multiExpected?: boolean; returnModifiedInput?: boolean; modifiedInputIndex?: number }
): string => {
    const entryInfo = findEntryFunction(userCode, 'python', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'python', userCode);

    const testCasesStr = testCases.map(tc => {
        // Use modified formatValue which calls builders
        const inputs = tc.input.map((val, i) => formatValue(val, inputSchema[i]?.type || 'any', 'python')).join(', ');
        const expectedOutput = jsonToPython(tc.expectedOutput);
        return `{"input": [${inputs}], "expected": ${expectedOutput}}`;
    }).join(',\n    ');

    return `
import json
import time
import sys
import io
import math
import collections
from typing import List, Optional

${definitions}
${parsers}
${serializers}

${userCode}

# Test Runner
test_cases = [
    ${testCasesStr}
]

def to_json_serializable(val):
    if val is None:
        return None
    if val is True:
        return True
    if val is False:
        return False
    if isinstance(val, (int, float, str)):
        return val
    if isinstance(val, list):
        return [to_json_serializable(x) for x in val]
    if isinstance(val, dict):
        return {str(k): to_json_serializable(v) for k, v in val.items()}
    # Try using serializers if it's a known DS and not handled
    ${requiredDS.includes('ListNode') ? `if 'ListNode' in globals() and isinstance(val, ListNode): return list_node_to_json(val)` : ''}
    ${requiredDS.includes('TreeNode') ? `if 'TreeNode' in globals() and isinstance(val, TreeNode): return tree_node_to_json(val)` : ''}
    ${requiredDS.includes('Interval') ? `if 'Interval' in globals() and isinstance(val, Interval): return interval_to_json(val)` : ''}
    ${requiredDS.includes('GraphNode') ? `if 'Node' in globals() and isinstance(val, Node): return graph_node_to_json(val)` : ''}
    ${requiredDS.includes('TrieNode') ? `if 'TrieNode' in globals() and isinstance(val, TrieNode): return trie_node_to_json(val)` : ''}
    return str(val)

results = []
for tc in test_cases:
    captured_output = io.StringIO()
    original_stdout = sys.stdout
    sys.stdout = captured_output
    
    try:
        start = time.time()
        actual = ${userFuncName}(*tc['input'])
        end = time.time()
        
        # Support in-place algorithms
        if ${options?.returnModifiedInput ? 'True' : 'False'}:
            actual = tc['input'][${options?.modifiedInputIndex ?? 0}]
        
        # Auto-serialize result for comparison
        serialized_actual = actual
        ${requiredDS.includes('ListNode') ? `if 'ListNode' in globals() and isinstance(actual, ListNode): serialized_actual = list_node_to_json(actual)` : ''}
        ${requiredDS.includes('TreeNode') ? `if 'TreeNode' in globals() and isinstance(actual, TreeNode): serialized_actual = tree_node_to_json(actual)` : ''}
        ${requiredDS.includes('Interval') ? `if 'Interval' in globals() and isinstance(actual, Interval): serialized_actual = interval_to_json(actual)
        if isinstance(actual, list) and len(actual) > 0 and 'Interval' in globals() and isinstance(actual[0], Interval): serialized_actual = interval_array_to_json(actual)` : ''}
        ${requiredDS.includes('GraphNode') ? `if 'Node' in globals() and isinstance(actual, Node): serialized_actual = graph_node_to_json(actual)` : ''}
        ${requiredDS.includes('TrieNode') ? `if 'TrieNode' in globals() and isinstance(actual, TrieNode): serialized_actual = trie_node_to_json(actual)` : ''}

        def normalize(val):
            if not ${options?.unordered ? 'True' : 'False'}:
                return val
            if isinstance(val, list):
                # Try to sort, but handle non-comparable types via JSON string
                try:
                    return sorted([normalize(x) for x in val])
                except:
                   return sorted([normalize(x) for x in val], key=lambda x: json.dumps(to_json_serializable(x), sort_keys=True))
            return val

        def is_equal(a, b):
            return normalize(a) == normalize(b)

        passed = False
        if ${options?.multiExpected ? 'True' : 'False'} and isinstance(tc['expected'], list):
            passed = any(is_equal(serialized_actual, variant) for variant in tc['expected'])
        else:
            passed = is_equal(serialized_actual, tc['expected'])
        
        sys.stdout = original_stdout # Restore stdout before appending result
        logs = captured_output.getvalue()
        
        results.append({
            "status": "pass" if passed else "fail",
            "input": to_json_serializable(tc['input']),
            "expected": to_json_serializable(tc['expected']),
            "actual": to_json_serializable(serialized_actual),
            "time": (end - start) * 1000,
            "logs": logs.split('\\n') if logs else []
        })
    except Exception as e:
        sys.stdout = original_stdout # Restore stdout
        logs = captured_output.getvalue()
        results.append({
            "status": "error",
            "input": to_json_serializable(tc['input']),
            "error": str(e),
            "logs": logs.split('\\n') if logs else []
        })

print('___TEST_RESULTS_START___')
print(json.dumps(results))
print('___TEST_RESULTS_END___')
`;
};

/**
 * Splits a Java argument string into individual argument types.
 * e.g. "String s, List<String> wordDict" -> ["String s", "List<String> wordDict"]
 */
const splitJavaArgs = (argsStr: string): string[] => {
    if (!argsStr || argsStr.trim() === '') return [];

    const args: string[] = [];
    let current = '';
    let depth = 0;

    for (const char of argsStr) {
        if (char === '<' || char === '(' || char === '[') depth++;
        else if (char === '>' || char === ')' || char === ']') depth--;

        if (char === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) args.push(current.trim());
    return args;
};

const generateJavaRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[],
    entryFunctionName?: string,
    options?: { unordered?: boolean; multiExpected?: boolean; returnModifiedInput?: boolean; modifiedInputIndex?: number }
): string => {
    console.log("DEBUG: generateJavaRunner options:", options);
    // 1. Find the correct entry function using signature matching
    const entryInfo = findEntryFunction(userCode, 'java', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    // 2. Ensure all helper methods are static (ONLY if not using class Solution)
    const userCodeClean = entryInfo.hasSolutionClass ? userCode : ensureStaticMethods(userCode);

    // Auto-detect inplace from schema if not provided in options
    let returnModifiedInput = options?.returnModifiedInput;
    let modifiedInputIndex = options?.modifiedInputIndex ?? 0;

    if (returnModifiedInput === undefined) {
        const inplaceIdx = inputSchema.findIndex(i => i.inplace === true || String(i.inplace) === 'true');
        if (inplaceIdx !== -1) {
            returnModifiedInput = true;
            modifiedInputIndex = inplaceIdx;
        }
    }

    // 3. Parse Argument Types from User Code to handle List<T> vs T[]
    const rawArgs = splitJavaArgs(entryInfo.argsStr); // ["String s", "List<String> wordDict"]

    // Extract types from raw args
    const userArgTypes = rawArgs.map(arg => {
        const parts = arg.trim().split(/\s+/);
        if (parts.length < 2) return arg;
        return parts.slice(0, parts.length - 1).join(' ');
    });

    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'java', userCode);

    // Helper to infer Java literal from value
    const toJavaLiteral = (val: any): string => {
        if (val === null || val === undefined) return "null";
        if (Array.isArray(val)) {
            return formatJavaArrayLiteral(val);
        }
        if (typeof val === "string") return JSON.stringify(val);
        return String(val);
    };

    // Generate test case calls
    const testCalls = testCases.map(tc => {
        const args = tc.input.map((val, i) => {
            // Pass the inferred user argument type to formatValue
            const targetType = userArgTypes[i] || ''; // e.g. "List<String>"
            return formatValue(val, inputSchema[i]?.type || 'any', 'java', targetType);
        }).join(', ');

        const expectedJavaLiteral = toJavaLiteral(tc.expectedOutput);

        return `
        {
            if (!first) System.out.print(",");
            first = false;
            try {
                long start = System.nanoTime();
                ${entryInfo.hasSolutionClass ? `Solution sol = new Solution();` : ''}
                
                // Declare arguments
                ${tc.input.map((val, i) => {
            const type = userArgTypes[i] || 'Object';
            return `${type} arg${i} = ${formatValue(val, inputSchema[i]?.type || 'any', 'java', userArgTypes[i] || '')};`;
        }).join('\n                ')}

                Object actual;
                // Support in-place algorithms (void return type)
                ${returnModifiedInput ? `
                    ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${tc.input.map((_, i) => `arg${i}`).join(', ')});
                    actual = arg${modifiedInputIndex};
                ` : `
                    actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${tc.input.map((_, i) => `arg${i}`).join(', ')});
                `}

                // Auto-serialize result if it is a DS
                Object serializedActual = actual;
                ${requiredDS.includes('ListNode') ? `if (actual instanceof ListNode) serializedActual = listNodeToArray((ListNode)actual);` : ''}
                ${requiredDS.includes('TreeNode') ? `if (actual instanceof TreeNode) serializedActual = treeNodeToArray((TreeNode)actual);` : ''}
                ${requiredDS.includes('Interval') ? `if (actual instanceof Interval) serializedActual = intervalToJson((Interval)actual);
                if (actual instanceof Interval[]) serializedActual = intervalArrayToJson((Interval[])actual);` : ''}
                ${requiredDS.includes('GraphNode') ? `if (actual instanceof Node) serializedActual = graphNodeToJson((Node)actual);` : ''}

                long end = System.nanoTime();
                
                Object expected = ${expectedJavaLiteral};
                boolean passed = false;
                
                if (${!!options?.multiExpected}) {
                    if (expected instanceof List) {
                        List<?> variants = (List<?>) expected;
                        for (Object variant : variants) {
                            if (isEqual(serializedActual, variant, ${!!options?.unordered})) {
                                passed = true;
                                break;
                            }
                        }
                    } else if (expected != null && expected.getClass().isArray()) {
                        int len = java.lang.reflect.Array.getLength(expected);
                        for (int i = 0; i < len; i++) {
                            Object variant = java.lang.reflect.Array.get(expected, i);
                            if (isEqual(serializedActual, variant, ${!!options?.unordered})) {
                                passed = true;
                                break;
                            }
                        }
                    } else {
                        passed = isEqual(serializedActual, expected, ${!!options?.unordered});
                    }
                } else {
                    passed = isEqual(serializedActual, expected, ${!!options?.unordered});
                }
                
                System.out.print("{");
                System.out.print("\\"status\\":\\"" + (passed ? "pass" : "fail") + "\\",");
                System.out.print("\\"expected\\":" + toJson(expected) + ",");
                System.out.print("\\"actual\\":" + toJson(serializedActual) + ",");
                System.out.print("\\"time\\":" + ((end - start) / 1000000.0));
                System.out.print("}");
            } catch (Exception e) {
                System.out.print("{");
                System.out.print("\\"status\\":\\"error\\",");
                System.out.print("\\"error\\":\\"" + e.toString().replace("\\\"", "\\\\\\\"") + "\\"");
                System.out.print("}");
            }
        }`;
    }).join('\n');

    return `
import java.util.*;
import java.util.stream.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.HashSet;
import java.util.HashMap;
 import java.util.Queue;
  import java.util.LinkedList;
public class Main {
    ${definitions}
    ${parsers}
    ${serializers}
    
    ${userCodeClean}

    private static Object normalize(Object obj, boolean unordered) {
        if (!unordered || obj == null) return obj;
        if (obj instanceof List) {
            List<Object> list = new ArrayList<>((List<?>) obj);
            for (int i = 0; i < list.size(); i++) {
                list.set(i, normalize(list.get(i), unordered));
            }
            list.sort((a, b) -> toJson(a).compareTo(toJson(b)));
            return list;
        }
        if (obj.getClass().isArray()) {
            if (obj instanceof int[]) {
                int[] arr = (int[]) obj;
                Arrays.sort(arr);
                return arr;
            }
            if (obj instanceof Object[]) {
                Object[] arr = (Object[]) obj;
                for (int i = 0; i < arr.length; i++) {
                    arr[i] = normalize(arr[i], unordered);
                }
                Arrays.sort(arr, (a, b) -> toJson(a).compareTo(toJson(b)));
                return arr;
            }
        }
        return obj;
    }

    private static boolean isEqual(Object a, Object b, boolean unordered) {
        // If unordered, we must normalize and compare JSON
        if (unordered) {
            return toJson(normalize(a, true)).equals(toJson(normalize(b, true)));
        }
        
        // Robust comparison: Convert both to JSON string and compare
        // This handles List vs Array, int[] vs Integer[], etc. automatically
        return toJson(a).equals(toJson(b));
    }

    private static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\\"" + ((String) obj).replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\\"";
        if (obj instanceof Character) return "\\"" + obj + "\\\"";
        if (obj instanceof Boolean || obj instanceof Number) return String.valueOf(obj);
        
        if (obj instanceof int[]) {
            int[] arr = (int[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) sb.append(arr[i]).append(i == arr.length - 1 ? "" : ",");
            return sb.append("]").toString();
        }
        if (obj instanceof long[]) {
            long[] arr = (long[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) sb.append(arr[i]).append(i == arr.length - 1 ? "" : ",");
            return sb.append("]").toString();
        }
        if (obj instanceof double[]) {
            double[] arr = (double[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) sb.append(arr[i]).append(i == arr.length - 1 ? "" : ",");
            return sb.append("]").toString();
        }
        if (obj instanceof boolean[]) {
            boolean[] arr = (boolean[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) sb.append(arr[i]).append(i == arr.length - 1 ? "" : ",");
            return sb.append("]").toString();
        }
        if (obj instanceof char[]) {
            char[] arr = (char[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                sb.append("\\"").append(arr[i]).append("\\"").append(i == arr.length - 1 ? "" : ",");
            }
            return sb.append("]").toString();
        }
        if (obj instanceof Object[]) {
            Object[] arr = (Object[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                sb.append(toJson(arr[i])).append(i == arr.length - 1 ? "" : ",");
            }
            return sb.append("]").toString();
        }
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                sb.append(toJson(list.get(i))).append(i == list.size() - 1 ? "" : ",");
            }
            return sb.append("]").toString();
        }
        return "\\"" + String.valueOf(obj).replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\\"";
    }

    public static void main(String[] args) {
        System.out.println("___TEST_RESULTS_START___");
        System.out.print("[");
        boolean first = true;
        ${testCalls}
        System.out.print("]");
        System.out.println();
        System.out.println("___TEST_RESULTS_END___");
    }
}
`;
};

const generateCppRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[],
    entryFunctionName?: string,
    options?: { unordered?: boolean; multiExpected?: boolean; returnModifiedInput?: boolean; modifiedInputIndex?: number }
): string => {
    const entryInfo = findEntryFunction(userCode, 'cpp', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    // Parse C++ argument types from the function signature
    const splitCppArgs = (argsStr: string): string[] => {
        if (!argsStr || argsStr.trim() === '') return [];
        const args: string[] = [];
        let current = '';
        let depth = 0;
        for (const char of argsStr) {
            if (char === '<' || char === '(') depth++;
            else if (char === '>' || char === ')') depth--;

            if (char === ',' && depth === 0) {
                args.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        if (current.trim()) args.push(current.trim());
        return args;
    };

    const rawArgs = splitCppArgs(entryInfo.argsStr);

    const userArgTypes = rawArgs.map(arg => {
        const trimmed = arg.trim();
        const match = trimmed.match(/^(.+?)\s+\w+$/);
        return match ? match[1] : trimmed;
    });

    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'cpp', userCode);

    // Helper to deduce C++ type from value, with optional target type hint
    const deduceCppType = (val: any, targetCppType?: string): string => {
        if (targetCppType?.includes('ListNode')) return 'ListNode*';
        if (targetCppType?.includes('TreeNode')) return 'TreeNode*';
        if (targetCppType?.includes('Node') || targetCppType?.includes('GraphNode')) return 'Node*';
        if (targetCppType?.includes('Interval')) {
            if (targetCppType.includes('vector')) return 'vector<Interval>';
            return 'Interval';
        }

        if (Array.isArray(val)) {
            if (val.length === 0) {
                if (targetCppType) {
                    const cleanType = targetCppType.replace(/[&*\s]/g, '');
                    return cleanType;
                }
                return 'vector<int>';
            }
            const first = val[0];
            if (Array.isArray(first)) {
                // Remove recursive call ambiguity by explicitly handling C++ vector syntax deduction
                const innerType = deduceCppType(first, targetCppType?.replace('vector<', '').replace('>', ''));
                return `vector<${innerType}>`;
            }
            if (targetCppType && targetCppType.includes('char')) {
                return 'vector<char>';
            }
            if (typeof first === 'string') return 'vector<string>';
            if (typeof first === 'boolean') return 'vector<bool>';
            return 'vector<int>';
        }
        if (typeof val === 'string') {
            if (targetCppType && targetCppType.includes('char') && val.length === 1) {
                return 'char';
            }
            return 'string';
        }
        if (typeof val === 'boolean') return 'bool';
        return 'int';
    };

    // Helper to format C++ literal
    const formatCppLiteral = (val: any, isChar: boolean = false): string => {
        if (val === null || val === undefined) return "{}";
        if (Array.isArray(val)) {
            const inner = val.map(v => formatCppLiteral(v, isChar)).join(', ');
            return `{${inner}}`;
        }
        if (typeof val === 'string') {
            if (isChar && val.length === 1) {
                return `'${val}'`;
            }
            return JSON.stringify(val);
        }
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        return String(val);
    };

    // Common type determination logic reused?
    // We can rely on deduceCppType for variables.

    // For expected output, if it's a DS, we need to compare against json (vector<int> etc).
    // So "expected" variable should be vector<int>.
    // deduceCppType([1,2,3]) -> vector<int>.
    // So if expectedOutput is JSON array, it generates vector<int>.
    // This matches serializer output.

    const testCalls = testCases.map((tc, index) => {
        // Declare variables for inputs
        const inputDecls = tc.input.map((val, i) => {
            const targetType = userArgTypes[i] || ''; // e.g. "ListNode*"
            // If targetType is ListNode*, formatValue returns jsonToListNode(...) string.
            // But we need to declare variable: "ListNode* arg0 = ..."

            const cppType = deduceCppType(val, targetType);

            // Should pass 'cpp' language to formatValue to get jsonToListNode(...)
            const type = inputSchema[i]?.type || 'any';
            const valStr = formatValue(val, type, 'cpp');

            return `${cppType} arg${i} = ${valStr};`;
        }).join('\n            ');

        const args = tc.input.map((_, i) => `arg${i}`).join(', ');

        const expectedValStr = formatCppLiteral(tc.expectedOutput);

        // Expected type is vector<int> usually for simple DS
        // But if Array<Array>...
        const expectedType = deduceCppType(tc.expectedOutput);
        const expectedDecl = `${expectedType} expected = ${expectedValStr};`;

        // Logic for execution line:
        // If in-place (returnModifiedInput=true), the function might return void.
        // So we execute: userFunc(args); auto actual = arg0;
        // Else: auto actual = userFunc(args);

        let executionBlock = '';
        if (options?.returnModifiedInput) {
            executionBlock = `
                 ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
                 auto actual = arg${options?.modifiedInputIndex ?? 0};
             `;
        } else {
            executionBlock = `
                 auto actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
             `;
        }

        return `
        {
            if (!first) cout << ",";
            first = false;
            try {
                ${inputDecls}
                ${expectedDecl}
                ${entryInfo.hasSolutionClass ? 'Solution sol;' : ''}
                auto start = chrono::high_resolution_clock::now();
                ${executionBlock}
                
                // Auto-serialize result
                auto get_serialized = [&](auto& val) {
                    using T = std::remove_reference_t<decltype(val)>;
                    using TP = std::remove_pointer_t<T>;
                    if constexpr (false) {}
                    ${requiredDS.includes('ListNode') ? `else if constexpr (std::is_same_v<T, ListNode*>) return listNodeToJson(val);` : ''}
                    ${requiredDS.includes('TreeNode') ? `else if constexpr (std::is_same_v<T, TreeNode*>) return treeNodeToJson(val);` : ''}
                    ${requiredDS.includes('Interval') ? `else if constexpr (std::is_same_v<T, Interval>) return intervalToJson(val);
                    else if constexpr (std::is_same_v<T, std::vector<Interval>>) return intervalArrayToJson(val);` : ''}
                    ${requiredDS.includes('GraphNode') ? `else if constexpr (std::is_same_v<T, Node*>) return graphNodeToJson(val);` : ''}
                    else return val; 
                };
                auto serializedActual = get_serialized(actual);

                auto end = chrono::high_resolution_clock::now();
                chrono::duration<double, milli> duration = end - start;
                
                auto is_equal = [&](auto a, auto b) {
                     // Simple structural equality for vectors/primitives
                     // If unordered custom logic needed, add here
                     if constexpr (${!!options?.unordered}) {
                         auto a_norm = a;
                         auto b_norm = b;
                         std::sort(a_norm.begin(), a_norm.end());
                         std::sort(b_norm.begin(), b_norm.end());
                         return a_norm == b_norm;
                     }
                     return a == b;
                };

                bool passed = false;
                passed = is_equal(serializedActual, expected);

                cout << "{";
                cout << "\\"status\\":\\"" << (passed ? "pass" : "fail") << "\\",";
                cout << "\\"expected\\":"; printJSON(expected); cout << ",";
                cout << "\\"actual\\":"; printJSON(serializedActual); cout << ",";
                cout << "\\"time\\":" << duration.count();
                cout << "}";

            } catch (...) {
                cout << "{";
                cout << "\\"status\\":\\"error\\",";
                cout << "\\"error\\":\\"Runtime Error\\"";
                cout << "}";
            }
        }`;
    }).join('\n');

    return `
#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <algorithm>
#include <queue>
#include <map>
#include <type_traits>
#include <sstream>
#include <unordered_set>
#include <unordered_map>
using namespace std;

${definitions}
${parsers}
${serializers}


// Helper to check if type is vector
template<typename T> struct is_vector : std::false_type {};
template<typename T> struct is_vector<std::vector<T>> : std::true_type {};
template<typename T> inline constexpr bool is_vector_v = is_vector<T>::value;

// Forward decl
template<typename T> string toJson(const T& val);

template<typename T>
string toJson(const T& val) {
    if constexpr (std::is_same_v<T, bool>) {
        return val ? "true" : "false";
    } else if constexpr (std::is_arithmetic_v<T>) {
        return to_string(val);
    } else if constexpr (std::is_same_v<T, string>) {
        return "\\"" + val + "\\"";
    } else if constexpr (std::is_same_v<T, char>) {
        return "\\"" + string(1, val) + "\\"";
    } else if constexpr (is_vector_v<T>) {
        string res = "[";
        for (size_t i = 0; i < val.size(); ++i) {
            res += toJson(val[i]);
            if (i != val.size() - 1) res += ",";
        }
        res += "]";
        return res;
    } else {
        return "{}"; // Fallback
    }
}

template<typename T>
void printJSON(const T& val) {
    cout << toJson(val);
}


${userCode}

int main() {
    cout << "___TEST_RESULTS_START___" << endl;
    cout << "[";
    bool first = true;
    ${testCalls}
    cout << "]";
    cout << endl;
    cout << "___TEST_RESULTS_END___" << endl;
    return 0;
}
`;
};
