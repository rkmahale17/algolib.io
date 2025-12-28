import { Language } from '@/components/CodeRunner/LanguageSelector';
import { findEntryFunction, ensureStaticMethods } from './codeManipulation';


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
    options?: { unordered?: boolean; multiExpected?: boolean }
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
    if (lang === 'python') {
        return jsonToPython(value);
    }
    if (lang === 'typescript') {
        return JSON.stringify(value);
    }

    // Legacy/Specific handling for Java/C++
    if (type === 'number' || type === 'boolean') return String(value);
    if (type === 'string') return JSON.stringify(value);
    if (Array.isArray(value)) { // Generic array handling for Java/C++ fallback
        if (lang === 'java') {
            // Check if target expects a List
            if (targetJavaType && targetJavaType.includes('List')) {
                if (value.length > 0 && typeof value[0] === 'string') {
                    return `Arrays.asList(${value.map(v => JSON.stringify(v)).join(', ')})`;
                }
                // List<Integer> etc - Autoboxing handles int -> Integer? Arrays.asList expects objects.
                return `Arrays.asList(${value.join(', ')})`;
            }

            // Detect dimensions and type for Java Array
            return formatJavaArrayLiteral(value, targetJavaType);
        }
        if (lang === 'cpp') {
            // Basic vector syntax
            return `{${value.join(', ')}}`;
        }
    }
    if (type === 'number[]') {
        if (lang === 'java') {
            if (targetJavaType && targetJavaType.includes('List')) {
                return `Arrays.asList(${value.join(', ')})`;
            }
            return formatJavaArrayLiteral(value, targetJavaType);
        }
        if (lang === 'cpp') return `{${value.join(', ')}}`;
        return `[${value.join(', ')}]`;
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
    let dimensions = 0;
    let current: any = arr;
    while (Array.isArray(current) && current.length > 0) {
        dimensions++;
        current = current[0];
    }

    // If empty array, or higher dimension empty array
    if (dimensions === 0 && Array.isArray(arr)) {
        // We need a type to return something valid, default to Object or int if unknown
        const type = (targetJavaType && targetJavaType.replace(/[\[\]]/g, '')) || 'int';
        return `new ${type}[0]`;
    }

    let type = 'int';

    // Check if target type specifies char or String or boolean
    if (targetJavaType) {
        if (targetJavaType.includes('char')) type = 'char';
        else if (targetJavaType.includes('String')) type = 'String';
        else if (targetJavaType.includes('boolean')) type = 'boolean';
        else if (targetJavaType.includes('double')) type = 'double';
        else if (targetJavaType.includes('long')) type = 'long';
    } else {
        // Infer from content
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
    options?: { unordered?: boolean; multiExpected?: boolean }
): string => {
    const entryInfo = findEntryFunction(userCode, 'typescript', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    const testCasesStr = testCases.map(tc => {
        const inputs = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'typescript')).join(', ');
        const expectedOutput = JSON.stringify(tc.expectedOutput);
        return `{ input: [${inputs}], expected: ${expectedOutput} }`;
    }).join(',\n  ');

    return `
/// <reference lib="esnext" />
${userCode}

// Test Runner
const testCases = [
  ${testCasesStr}
];

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
    const actual = ${userFuncName}.apply(null, tc.input);
    const end = Date.now();
    
    const isEqual = (a, b) => {
      const normalize = (val) => {
        if (!${!!options?.unordered}) return val;
        if (Array.isArray(val)) return [...val].sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y))).map(normalize);
        return val;
      };
      return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
    };

    let passed = false;
    if (${!!options?.multiExpected} && Array.isArray(tc.expected)) {
        passed = tc.expected.some(variant => isEqual(actual, variant));
    } else {
        passed = isEqual(actual, tc.expected);
    }

    return {
      status: passed ? 'pass' : 'fail',
      input: tc.input,
      expected: tc.expected,
      actual: actual,
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
    options?: { unordered?: boolean; multiExpected?: boolean }
): string => {
    const entryInfo = findEntryFunction(userCode, 'python', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    const testCasesStr = testCases.map(tc => {
        const inputs = tc.input.map(val => jsonToPython(val)).join(', ');
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
        
        def normalize(val):
            if not ${!!options?.unordered}:
                return val
            if isinstance(val, list):
                return sorted([normalize(x) for x in val], key=lambda x: json.dumps(x, sort_keys=True))
            return val

        def is_equal(a, b):
            return normalize(a) == normalize(b)

        passed = False
        if ${!!options?.multiExpected} and isinstance(tc['expected'], list):
            passed = any(is_equal(actual, variant) for variant in tc['expected'])
        else:
            passed = is_equal(actual, tc['expected'])
        
        sys.stdout = original_stdout # Restore stdout before appending result
        logs = captured_output.getvalue()
        
        results.append({
            "status": "pass" if passed else "fail",
            "input": to_json_serializable(tc['input']),
            "expected": to_json_serializable(tc['expected']),
            "actual": to_json_serializable(actual),
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
    options?: { unordered?: boolean; multiExpected?: boolean }
): string => {
    // 1. Find the correct entry function using signature matching
    const entryInfo = findEntryFunction(userCode, 'java', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    // 2. Ensure all helper methods are static (ONLY if not using class Solution)
    const userCodeClean = entryInfo.hasSolutionClass ? userCode : ensureStaticMethods(userCode);

    // 3. Parse Argument Types from User Code to handle List<T> vs T[]
    const rawArgs = splitJavaArgs(entryInfo.argsStr); // ["String s", "List<String> wordDict"]

    // Extract types from raw args (everything before the last space is roughly the type)
    const userArgTypes = rawArgs.map(arg => {
        const parts = arg.trim().split(/\s+/);
        if (parts.length < 2) return arg; // Fallback
        return parts.slice(0, parts.length - 1).join(' '); // "List<String>"
    });


    // Helper to infer Java literal from value
    // Replaced by global formatJavaArrayLiteral for recursion support
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
            return formatValue(val, inputSchema[i].type, 'java', targetType);
        }).join(', ');

        const expectedJavaLiteral = toJavaLiteral(tc.expectedOutput);

        return `
        {
            if (!first) System.out.print(",");
            first = false;
            try {
                long start = System.nanoTime();
                ${entryInfo.hasSolutionClass ? `Solution sol = new Solution();` : ''}
                Object actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
                long end = System.nanoTime();
                
                Object expected = ${expectedJavaLiteral};
                boolean passed = false;
                
                if (${!!options?.multiExpected}) {
                    if (expected instanceof List) {
                        List<?> variants = (List<?>) expected;
                        for (Object variant : variants) {
                            if (isEqual(actual, variant, ${!!options?.unordered})) {
                                passed = true;
                                break;
                            }
                        }
                    } else if (expected != null && expected.getClass().isArray()) {
                        int len = java.lang.reflect.Array.getLength(expected);
                        for (int i = 0; i < len; i++) {
                            Object variant = java.lang.reflect.Array.get(expected, i);
                            if (isEqual(actual, variant, ${!!options?.unordered})) {
                                passed = true;
                                break;
                            }
                        }
                    } else {
                        passed = isEqual(actual, expected, ${!!options?.unordered});
                    }
                } else {
                    passed = isEqual(actual, expected, ${!!options?.unordered});
                }
                
                System.out.print("{");
                System.out.print("\\"status\\":\\"" + (passed ? "pass" : "fail") + "\\",");
                System.out.print("\\"expected\\":" + toJson(expected) + ",");
                System.out.print("\\"actual\\":" + toJson(actual) + ",");
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
import java.util.HashSet;
public class Main {
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
        if (unordered) {
            // Primitive arrays need careful handling for sorting
            if (a instanceof int[] && b instanceof int[]) {
                int[] aArr = ((int[]) a).clone();
                int[] bArr = ((int[]) b).clone();
                Arrays.sort(aArr);
                Arrays.sort(bArr);
                return Arrays.equals(aArr, bArr);
            }
            // For others, use normalization (List/Object[])
            return toJson(normalize(a, true)).equals(toJson(normalize(b, true)));
        }
        
        if (a instanceof int[] && b instanceof int[]) return Arrays.equals((int[]) a, (int[]) b);
        if (a instanceof Object[] && b instanceof Object[]) return Arrays.deepEquals((Object[]) a, (Object[]) b);
        return Objects.equals(a, b);
    }

    private static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\\"" + ((String) obj).replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\\"";
        if (obj instanceof Character) return "\\"" + obj + "\\\"";
        if (obj instanceof Boolean || obj instanceof Number) return String.valueOf(obj);
        if (obj instanceof int[]) return Arrays.toString((int[]) obj);
        if (obj instanceof long[]) return Arrays.toString((long[]) obj);
        if (obj instanceof double[]) return Arrays.toString((double[]) obj);
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj);
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
    options?: { unordered?: boolean; multiExpected?: boolean }
): string => {
    const entryInfo = findEntryFunction(userCode, 'cpp', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    // Parse C++ argument types from the function signature
    // e.g., "vector<vector<char>>& grid, int k" -> ["vector<vector<char>>&", "int"]
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

    // Extract types from raw args (everything before the last space/identifier is the type)
    const userArgTypes = rawArgs.map(arg => {
        const trimmed = arg.trim();
        // Remove variable name - find the last word that's not part of type syntax
        // e.g., "vector<vector<char>>& grid" -> "vector<vector<char>>&"
        const match = trimmed.match(/^(.+?)\s+\w+$/);
        return match ? match[1] : trimmed;
    });

    // Helper to deduce C++ type from value, with optional target type hint
    const deduceCppType = (val: any, targetCppType?: string): string => {
        if (Array.isArray(val)) {
            if (val.length === 0) {
                // If we have a target type, use it for empty arrays
                if (targetCppType) {
                    // Extract the base type from target (e.g., "vector<vector<char>>" -> use it)
                    const cleanType = targetCppType.replace(/[&*\s]/g, '');
                    return cleanType;
                }
                return 'vector<int>'; // Default for empty array
            }
            const first = val[0];
            if (Array.isArray(first)) {
                // Nested vector
                const innerType = deduceCppType(first, targetCppType);
                return `vector<${innerType}>`;
            }
            // Check if target type specifies char
            if (targetCppType && targetCppType.includes('char')) {
                return 'vector<char>';
            }
            if (typeof first === 'string') return 'vector<string>';
            if (typeof first === 'boolean') return 'vector<bool>';
            return 'vector<int>';
        }
        if (typeof val === 'string') {
            // Check if target expects char
            if (targetCppType && targetCppType.includes('char') && val.length === 1) {
                return 'char';
            }
            return 'string';
        }
        if (typeof val === 'boolean') return 'bool';
        return 'int';
    };

    // Helper to format C++ literal, with type hint for char handling
    const formatCppLiteral = (val: any, isChar: boolean = false): string => {
        if (val === null || val === undefined) return "{}"; // Default for vectors/objects
        if (Array.isArray(val)) {
            const inner = val.map(v => formatCppLiteral(v, isChar)).join(', ');
            return `{${inner}}`;
        }
        if (typeof val === 'string') {
            if (isChar && val.length === 1) {
                return `'${val}'`; // Single char literal
            }
            return JSON.stringify(val); // String literal
        }
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        return String(val);
    };

    // Helper to find the common type across all test cases (to handle empty arrays correctly)
    const determineCommonCppType = (testCases: TestCase[]): string => {
        let maxDepth = 0;
        let innerType = 'int'; // Default to int

        const getDepthAndType = (val: any, currentDepth: number): void => {
            if (Array.isArray(val)) {
                if (val.length === 0) {
                    // Empty array, just record depth if it's deeper than what we've seen
                    if (currentDepth + 1 > maxDepth) maxDepth = currentDepth + 1;
                    return;
                }
                // Non-empty, recurse
                if (currentDepth + 1 > maxDepth) maxDepth = currentDepth + 1;
                val.forEach(v => getDepthAndType(v, currentDepth + 1));
            } else {
                // Leaf value
                if (typeof val === 'string') innerType = 'string';
                else if (typeof val === 'boolean') innerType = 'bool';
            }
        };

        testCases.forEach(tc => {
            getDepthAndType(tc.expectedOutput, 0);
        });

        // Reconstruct vector type based on depth
        let typeStr = innerType;
        for (let i = 0; i < maxDepth; i++) {
            typeStr = `vector<${typeStr}>`;
        }
        return typeStr;
    };

    const commonExpectedType = determineCommonCppType(testCases);

    const testCalls = testCases.map((tc, index) => {
        // Declare variables for inputs to avoid rvalue binding issues
        const inputDecls = tc.input.map((val, i) => {
            const targetType = userArgTypes[i] || '';
            const cppType = deduceCppType(val, targetType);
            const isCharType = targetType.includes('char');
            const valStr = formatCppLiteral(val, isCharType);
            return `${cppType} arg${i} = ${valStr};`;
        }).join('\n            ');

        const args = tc.input.map((_, i) => `arg${i}`).join(', ');

        // Use the common type for expected output
        const expectedValStr = formatCppLiteral(tc.expectedOutput);
        const expectedDecl = `${commonExpectedType} expected = ${expectedValStr};`;

        return `
        {
            if (!first) cout << ",";
            first = false;
            try {
                ${inputDecls}
                ${expectedDecl}
                ${entryInfo.hasSolutionClass ? 'Solution sol;' : ''}
                auto start = chrono::high_resolution_clock::now();
                auto actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
                auto end = chrono::high_resolution_clock::now();
                chrono::duration<double, milli> duration = end - start;
                
                auto is_equal = [&](auto a, auto b) {
                    if constexpr (${!!options?.unordered}) {
                        auto a_norm = a;
                        auto b_norm = b;
                        // Basic sort if it's a vector
                        if constexpr (is_vector_v<decltype(a)>) {
                            sort(a_norm.begin(), a_norm.end());
                            sort(b_norm.begin(), b_norm.end());
                        }
                        return a_norm == b_norm;
                    } else {
                        return a == b;
                    }
                };

                bool passed = false;
                if constexpr (${!!options?.multiExpected}) {
                    // For C++, variants would likely be in a vector
                    // We need a helper to iterate if expected is a vector of variants
                    // However, determing if expected is variants vs single output is tricky in C++
                    // Let's assume for now expected is a vector of variants if multiExpected is true
                    // For C++, variants are in a vector if multiExpected is true
                    // and we generated it from an array.
                    // If expected is a vector, we iterate it.
                    if constexpr (is_vector_v<decltype(expected)>) {
                        for (const auto& variant : expected) {
                            if (is_equal(actual, variant)) {
                                passed = true;
                                break;
                            }
                        }
                    } else {
                         passed = is_equal(actual, expected);
                    }
                } else {
                    passed = is_equal(actual, expected);
                }
                
                cout << "{" 
                     << "\\"status\\":\\"" << (passed ? "pass" : "fail") << "\\","
                     << "\\"expected\\":" << toJson(expected) << ","
                     << "\\"actual\\":" << toJson(actual) << ","
                     << "\\"time\\":" << duration.count()
                     << "}";
            } catch (...) {
                cout << "{\\"status\\":\\"error\\",\\"error\\":\\"Unknown Error\\"}";
            }
        }
    `;
    }).join('\n');

    return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <unordered_set> 
#include <climits>
#include <set>
#include <bitset>
#include <queue>
#include <unordered_map>
#include <type_traits>
#include <chrono>
using namespace std;

// Type traits for vector detection
template<typename T> struct is_vector : false_type {};
template<typename T, typename A> struct is_vector<vector<T, A>> : true_type {};
template<typename T> inline constexpr bool is_vector_v = is_vector<T>::value;

// Helper to convert values to JSON strings
template<typename T>
string toJson(const T& v) {
    if constexpr (is_same_v<T, string>) {
        return "\\"" + v + "\\"";
    } else if constexpr (is_same_v<T, char>) {
        return string("\\"") + v + "\\"";
    } else if constexpr (is_same_v<T, bool>) {
        return v ? "true" : "false";
    } else {
        return to_string(v);
    }
}

template<typename T>
string toJson(const vector<T>& v) {
    string res = "[";
    for (size_t i = 0; i < v.size(); ++i) {
        res += toJson(v[i]);
        if (i != v.size() - 1) res += ",";
    }
    res += "]";
    return res;
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
