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
            "logs": logs.split('\n') if logs else []
        })
    except Exception as e:
        sys.stdout = original_stdout # Restore stdout
        logs = captured_output.getvalue()
        results.append({
            "status": "error",
            "input": tc['input'],
            "error": str(e),
            "logs": logs.split('\n') if logs else []
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

    // Generate test case calls
    const testCalls = testCases.map(tc => {
        const args = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'java')).join(', ');
        const expectedOutput = JSON.stringify(tc.expectedOutput);
        return `
        try {
            long start = System.nanoTime();
            Object actual = ${userFuncName}(${args});
            long end = System.nanoTime();
            
            Object expected = ${expectedOutput};
            boolean passed;
            if (expected instanceof int[] && actual instanceof int[]) {
                passed = java.util.Arrays.equals((int[])expected, (int[])actual);
            } else {
                passed = java.util.Objects.equals(expected, actual);
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", passed ? "pass" : "fail");
            result.put("input", new Object[]{${args}});
            result.put("expected", expected);
            result.put("actual", actual);
            result.put("time", (end - start) / 1000000.0);
            results.add(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "error");
            result.put("error", e.toString());
            results.add(result);
        }
    `;
    }).join('\n');

    return `
import java.util.*;
import java.util.stream.*;

public class Main {
    ${userCodeClean}

    public static void main(String[] args) {
        return String.valueOf(o);
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

    const testCalls = testCases.map(tc => {
        const args = tc.input.map((val, i) => formatValue(val, inputSchema[i].type, 'cpp')).join(', ');
        // For C++, we need to handle expected output based on type
        const expectedVal = tc.expectedOutput;
        let expectedStr = '';
        if (Array.isArray(expectedVal)) {
            expectedStr = `{${expectedVal.join(', ')}}`;
        } else {
            expectedStr = String(expectedVal);
        }

        return `
        {
            auto expected = ${expectedStr};
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
