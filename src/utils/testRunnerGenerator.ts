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
    entryFunctionName?: string
): string => {
    switch (language) {
        case 'typescript':
            return generateTypeScriptRunner(userCode, testCases, inputSchema, entryFunctionName);
        case 'python':
            return generatePythonRunner(userCode, testCases, inputSchema, entryFunctionName);
        case 'java':
            return generateJavaRunner(userCode, testCases, inputSchema, entryFunctionName);
        case 'cpp':
            return generateCppRunner(userCode, testCases, inputSchema, entryFunctionName);
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
    if (!Array.isArray(arr)) return String(arr); // Should not happen given usage, but safe guard

    // 1. Determine base type and dimensions
    let dimensions = 0;
    let current = arr;
    while (Array.isArray(current) && current.length > 0) {
        dimensions++;
        current = current[0];
    }
    // If empty array, default to int[] (or we need context, but int[] is safe for empty usually)
    if (dimensions === 0 && Array.isArray(arr)) {
        return 'new int[]{}';
    }

    let type = 'int';

    // Check if target type specifies char
    if (targetJavaType && targetJavaType.includes('char')) {
        type = 'char';
    } else if (typeof current === 'string') {
        type = 'String';
    }

    if (typeof current === 'boolean') type = 'boolean';
    // Add other types if needed (double etc)

    // Construct the "new Type[][]..." prefix
    const brackets = '[]'.repeat(dimensions);

    // Recursive content generation
    const generateContent = (a: any[]): string => {
        if (a.length === 0) return '{}';
        if (!Array.isArray(a[0])) {
            // Leaf array
            if (type === 'String') {
                return `{${a.map(v => JSON.stringify(v)).join(', ')}}`;
            } else if (type === 'char') {
                // For char, wrap single characters in single quotes
                return `{${a.map(v => `'${v}'`).join(', ')}}`;
            }
            return `{${a.join(', ')}}`;
        }
        // Nested array
        return `{${a.map((sub: any) => generateContent(sub)).join(', ')}}`;
    };

    return `new ${type}${brackets}${generateContent(arr)}`;
};


const jsonToPython = (val: any): string => {
    if (val === null) return 'None';
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
    entryFunctionName?: string
): string => {
    const entryInfo = findEntryFunction(userCode, 'typescript', inputSchema, entryFunctionName);
    const userFuncName = entryInfo.name;

    const testCasesStr = testCases.map(tc => {
        const inputs = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'typescript')).join(', ');
        const expectedOutput = JSON.stringify(tc.expectedOutput);
        return `{ input: [${inputs}], expected: ${expectedOutput} }`;
    }).join(',\n  ');

    return `
/// <reference lib="es2015" />
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
    const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
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
    entryFunctionName?: string
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
        
        # Compare logic (simple equality for now)
        passed = actual == tc['expected']
        
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
    entryFunctionName?: string
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
        if (Array.isArray(val)) {
            return formatJavaArrayLiteral(val);
        }
        if (typeof val === 'string') return JSON.stringify(val);
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
            try {
                long start = System.nanoTime();
                ${entryInfo.hasSolutionClass ? `Solution sol = new Solution();` : ''}
                Object actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
                long end = System.nanoTime();
                
                Object expected = ${expectedJavaLiteral};
                boolean passed;
                
                if (expected instanceof int[] && actual instanceof int[]) {
                    passed = Arrays.equals((int[])expected, (int[])actual);
                } else if (expected instanceof String[] && actual instanceof String[]) {
                    passed = Arrays.equals((String[])expected, (String[])actual);
                } else if (expected instanceof int[][] && actual instanceof int[][]) {
                    passed = Arrays.deepEquals((int[][])expected, (int[][])actual);
                } else if (expected instanceof String[][] && actual instanceof String[][]) {
                    passed = Arrays.deepEquals((String[][])expected, (String[][])actual);
                } else {
                    passed = Objects.equals(expected, actual);
                }
                
                String formattedExpected = String.valueOf(expected);
                if (expected instanceof int[]) formattedExpected = Arrays.toString((int[])expected);
                if (expected instanceof String[]) formattedExpected = Arrays.toString((String[])expected);
                if (expected instanceof int[][]) formattedExpected = Arrays.deepToString((int[][])expected);
                if (expected instanceof String[][]) formattedExpected = Arrays.deepToString((String[][])expected);
                
                String formattedActual = String.valueOf(actual);
                if (actual instanceof int[]) formattedActual = Arrays.toString((int[])actual);
                if (actual instanceof String[]) formattedActual = Arrays.toString((String[])actual);
                if (actual instanceof int[][]) formattedActual = Arrays.deepToString((int[][])actual);
                if (actual instanceof String[][]) formattedActual = Arrays.deepToString((String[][])actual);
                
                System.out.print("{");
                System.out.print("\\"status\\":\\"" + (passed ? "pass" : "fail") + "\\",");
                System.out.print("\\"expected\\":" + formattedExpected + ",");
                System.out.print("\\"actual\\":" + formattedActual + ",");
                System.out.print("\\"time\\":" + ((end - start) / 1000000.0));
                System.out.print("},");
            } catch (Exception e) {
                System.out.print("{");
                System.out.print("\\"status\\":\\"error\\",");
                System.out.print("\\"error\\":\\"" + e.toString().replace("\\"", "\\\\\\"") + "\\"");
                System.out.print("},");
            }
        }`;
    }).join('\n');

    return `
import java.util.*;
import java.util.stream.*;
import java.util.HashSet;
public class Main {
    ${userCodeClean}

    public static void main(String[] args) {
        System.out.println("___TEST_RESULTS_START___");
        System.out.print("[");
        ${testCalls}
        System.out.print("{}]"); // Dummy last element to handle trailing comma
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
    entryFunctionName?: string
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
            ${inputDecls}
            ${expectedDecl}
            ${entryInfo.hasSolutionClass ? 'Solution sol;' : ''}
            auto actual = ${entryInfo.hasSolutionClass ? 'sol.' : ''}${userFuncName}(${args});
            
            bool passed = (expected == actual);
            
            cout << "{" 
                 << "\\"status\\":\\"" << (passed ? "pass" : "fail") << "\\","
                 << "\\"expected\\":" << expected << ","
                 << "\\"actual\\":" << actual
                 << "},";
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
using namespace std;

// Helper to print vectors
template<typename T>
ostream& operator<<(ostream& os, const vector<T>& v) {
    os << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        os << v[i];
        if (i != v.size() - 1) os << ", ";
    }
    os << "]";
    return os;
}

${userCode}

int main() {
    cout << "___TEST_RESULTS_START___" << endl;
    cout << "[";
    ${testCalls}
    cout << "{}]" << endl; // Dummy last element to handle comma
    cout << "___TEST_RESULTS_END___" << endl;
    return 0;
}
`;
};
