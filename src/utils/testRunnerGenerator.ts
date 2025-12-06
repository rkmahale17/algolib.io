import { Language } from '@/components/CodeRunner/LanguageSelector';
import { AlgorithmImplementation } from '@/data/algorithmImplementations';

interface TestCase {
    input: any[];
    expectedOutput: any;
}

export const generateTestRunner = (
    userCode: string,
    language: Language,
    testCases: TestCase[],
    inputSchema: any[]
): string => {
    switch (language) {
        case 'typescript':
            return generateTypeScriptRunner(userCode, testCases, inputSchema);
        case 'python':
            return generatePythonRunner(userCode, testCases, inputSchema);
        case 'java':
            return generateJavaRunner(userCode, testCases, inputSchema);
        case 'cpp':
            return generateCppRunner(userCode, testCases, inputSchema);
        default:
            return userCode;
    }
};

const formatValue = (value: any, type: string, lang: Language): string => {
    if (type === 'number' || type === 'boolean') return String(value);
    if (type === 'string') return `"${value}"`;
    if (type === 'number[]') {
        if (lang === 'java') return `new int[]{${value.join(', ')}}`;
        if (lang === 'cpp') return `{${value.join(', ')}}`;
        return `[${value.join(', ')}]`;
    }
    return String(value);
};

const generateTypeScriptRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[]
): string => {
    const userFuncName = userCode.match(/function\s+(\w+)/)?.[1] || 'solution';

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
    inputSchema: any[]
): string => {
    const userFuncName = userCode.match(/def\s+(\w+)/)?.[1] || 'solution';

    const testCasesStr = testCases.map(tc => {
        const inputs = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'python')).join(', ');
        const expectedOutput = JSON.stringify(tc.expectedOutput);
        return `{"input": [${inputs}], "expected": ${expectedOutput}}`;
    }).join(',\n    ');

    return `
import json
import time
import sys
import io
from typing import List

${userCode}

# Test Runner
test_cases = [
    ${testCasesStr}
]

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
            "input": tc['input'],
            "expected": tc['expected'],
            "actual": actual,
            "time": (end - start) * 1000,
            "logs": logs.split('\\n') if logs else []
        })
    except Exception as e:
        sys.stdout = original_stdout # Restore stdout
        logs = captured_output.getvalue()
        results.append({
            "status": "error",
            "input": tc['input'],
            "error": str(e),
            "logs": logs.split('\\n') if logs else []
        })

print('___TEST_RESULTS_START___')
print(json.dumps(results))
print('___TEST_RESULTS_END___')
`;
};

const generateJavaRunner = (
    userCode: string,
    testCases: TestCase[],
    inputSchema: any[]
): string => {
    // Extract user function signature
    const userFuncName = userCode.match(/(\w+)\s*\(/)?.[1] || 'solution';

    // Prepare user code: needs to be static
    let userCodeClean = userCode;
    if (!userCodeClean.includes('static')) {
        userCodeClean = userCodeClean.replace('public ', 'public static ');
    }

    // Helper to infer Java literal from value
    const toJavaLiteral = (val: any): string => {
        if (Array.isArray(val)) {
            // Heuristic for array type
            if (val.length > 0 && typeof val[0] === 'string') {
                return `new String[]{${val.map(v => `"${v}"`).join(', ')}}`;
            }
            // default to int array
            return `new int[]{${val.join(', ')}}`;
        }
        if (typeof val === 'string') return `"${val}"`;
        return String(val);
    };

    // Generate test case calls
    const testCalls = testCases.map(tc => {
        const args = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'java')).join(', ');
        const expectedJavaLiteral = toJavaLiteral(tc.expectedOutput);

        return `
        {
            try {
                long start = System.nanoTime();
                Object actual = ${userFuncName}(${args});
                long end = System.nanoTime();
                
                Object expected = ${expectedJavaLiteral};
                boolean passed;
                
                if (expected instanceof int[] && actual instanceof int[]) {
                    passed = Arrays.equals((int[])expected, (int[])actual);
                } else if (expected instanceof String[] && actual instanceof String[]) {
                    passed = Arrays.equals((String[])expected, (String[])actual);
                } else {
                    passed = Objects.equals(expected, actual);
                }
                
                String formattedExpected = String.valueOf(expected);
                if (expected instanceof int[]) formattedExpected = Arrays.toString((int[])expected);
                if (expected instanceof String[]) formattedExpected = Arrays.toString((String[])expected);
                
                String formattedActual = String.valueOf(actual);
                if (actual instanceof int[]) formattedActual = Arrays.toString((int[])actual);
                if (actual instanceof String[]) formattedActual = Arrays.toString((String[])actual);
                
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
    inputSchema: any[]
): string => {
    const userFuncName = userCode.match(/(\w+)\s*\(/)?.[1] || 'solution';

    // Helper to map schema type to C++ type
    const getCppType = (schemaType: string): string => {
        if (schemaType === 'number[]') return 'vector<int>';
        if (schemaType === 'string[]') return 'vector<string>';
        if (schemaType === 'number') return 'int';
        if (schemaType === 'boolean') return 'bool';
        if (schemaType === 'string') return 'string';
        return 'auto';
    };

    const testCalls = testCases.map((tc, index) => {
        // Declare variables for inputs to avoid rvalue binding issues
        const inputDecls = tc.input.map((val, i) => {
            const cppType = getCppType(inputSchema[i].type);
            const valStr = formatValue(val, inputSchema[i].type, 'cpp');
            return `${cppType} arg${i} = ${valStr};`;
        }).join('\n            ');

        const args = tc.input.map((_, i) => `arg${i}`).join(', ');

        // Handle expected output type mapping
        let expectedDecl = '';
        if (Array.isArray(tc.expectedOutput)) {
            // Heuristic: check first element type or default to int
            const isStringArray = tc.expectedOutput.length > 0 && typeof tc.expectedOutput[0] === 'string';
            const type = isStringArray ? 'vector<string>' : 'vector<int>';
            const valStr = `{${tc.expectedOutput.map((v: any) => formatValue(v, isStringArray ? 'string' : 'number', 'cpp')).join(', ')}}`;
            expectedDecl = `${type} expected = ${valStr};`;
        } else {
            const type = getCppType(typeof tc.expectedOutput);
            // Note: typeof gives 'number', 'string', 'boolean' which matches simplistic schema types roughly
            // Better to use actual value
            const valStr = formatValue(tc.expectedOutput, typeof tc.expectedOutput as any, 'cpp');
            expectedDecl = `auto expected = ${valStr};`;
        }

        return `
        {
            ${inputDecls}
            ${expectedDecl}
            auto actual = ${userFuncName}(${args});
            
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
