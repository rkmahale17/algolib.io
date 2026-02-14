import { Language } from '@/components/CodeRunner/LanguageSelector';
import { findEntryFunction, ensureStaticMethods } from './codeManipulation';
import { getRegistryCode } from './testRunnerGenerator';

interface Judge0Options {
    unordered?: boolean;
    returnModifiedInput?: boolean;
    modifiedInputIndex?: number;
}

export const generateJudge0Runner = (
    userCode: string,
    language: Language,
    inputSchema: any[],
    entryFunctionName?: string,
    options?: Judge0Options
): string => {
    switch (language) {
        case 'typescript':
            return generateJsRunner(userCode, inputSchema, entryFunctionName, options);
        case 'python':
            return generatePythonRunner(userCode, inputSchema, entryFunctionName, options);
        case 'cpp':
            return generateCppRunner(userCode, inputSchema, entryFunctionName, options);
        case 'java':
            return generateJavaRunner(userCode, inputSchema, entryFunctionName, options);
        default:
            return userCode;
    }
};

const generateJsRunner = (
    userCode: string,
    inputSchema: any[],
    entryFunctionName?: string,
    options?: Judge0Options
) => {
    const entryInfo = findEntryFunction(userCode, 'typescript', inputSchema, entryFunctionName);
    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'typescript', userCode);

    return `
// Force module scope
export {};
${definitions}
${parsers}
${serializers}

${userCode}

// Judge0 Runner
const fs = require('fs');

const run = () => {
    try {
        const inputData = fs.readFileSync(0, 'utf-8').trim();
        if (!inputData) return;
        
        const input = JSON.parse(inputData);
        
        // Execute User Function
        const result = ${entryInfo.name}(...input);

        // Determine what to print
        let output = result;
        if (${options?.returnModifiedInput ? 'true' : 'false'}) {
            output = input[${options?.modifiedInputIndex ?? 0}];
        }

        // Serialization Logic
        const serialize = (val: any) => {
            ${requiredDS.includes('ListNode') ? `if (val && val instanceof ListNode) return listNodeToJson(val);` : ''}
            ${requiredDS.includes('TreeNode') ? `if (val && val instanceof TreeNode) return treeNodeToJson(val);` : ''}
            ${requiredDS.includes('Interval') ? `if (val && val instanceof Interval) return intervalToJson(val);
            if (Array.isArray(val) && val.length > 0 && val[0] instanceof Interval) return intervalArrayToJson(val);` : ''}
            ${requiredDS.includes('GraphNode') ? `if (val && (val instanceof Node || (typeof val === 'object' && 'neighbors' in val))) return graphNodeToJson(val);` : ''}
            ${requiredDS.includes('TrieNode') ? `if (val && val instanceof TrieNode) return trieNodeToJson(val);` : ''}
            return val;
        };

        const finalOutput = serialize(output);

        // Normalization (Sorting) if unordered
        const normalize = (val: any): any => {
            if (!${!!options?.unordered}) return val;
            if (Array.isArray(val)) {
                return val.map(normalize).sort((a, b) => {
                    return JSON.stringify(a).localeCompare(JSON.stringify(b));
                });
            }
            return val;
        };

        console.log(JSON.stringify(normalize(finalOutput)));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
`;
};

const generatePythonRunner = (
    userCode: string,
    inputSchema: any[],
    entryFunctionName?: string,
    options?: Judge0Options
) => {
    const entryInfo = findEntryFunction(userCode, 'python', inputSchema, entryFunctionName);
    const { definitions, parsers, serializers, requiredDS } = getRegistryCode(inputSchema, 'python', userCode);

    return `
import sys
import json
import collections

${definitions}
${parsers}
${serializers}

${userCode}

def to_json_serializable(val):
    if val is None: return None
    if isinstance(val, (bool, int, float, str)): return val
    if isinstance(val, list): return [to_json_serializable(x) for x in val]
    if isinstance(val, dict): return {str(k): to_json_serializable(v) for k, v in val.items()}
    ${requiredDS.includes('ListNode') ? `if 'ListNode' in globals() and isinstance(val, ListNode): return list_node_to_json(val)` : ''}
    ${requiredDS.includes('TreeNode') ? `if 'TreeNode' in globals() and isinstance(val, TreeNode): return tree_node_to_json(val)` : ''}
    ${requiredDS.includes('Interval') ? `if 'Interval' in globals() and isinstance(val, Interval): return interval_to_json(val)` : ''}
    ${requiredDS.includes('GraphNode') ? `if 'Node' in globals() and isinstance(val, Node): return graph_node_to_json(val)` : ''}
    return str(val)

def normalize(val):
    if not ${options?.unordered ? 'True' : 'False'}:
        return val
    if isinstance(val, list):
        try:
            return sorted([normalize(x) for x in val])
        except:
             return sorted([normalize(x) for x in val], key=lambda x: json.dumps(to_json_serializable(x), sort_keys=True))
    return val

if __name__ == "__main__":
    try:
        input_str = sys.stdin.read().strip()
        if not input_str: sys.exit(0)
        
        inputs = json.loads(input_str)
        
        # Execute
        result = ${entryInfo.name}(*inputs)
        
        # Handle In-Place
        if ${options?.returnModifiedInput ? 'True' : 'False'}:
            result = inputs[${options?.modifiedInputIndex ?? 0}]
            
        # Serialize & Normalize & Print
        serialized = to_json_serializable(result)
        normalized = normalize(serialized)
        
        print(json.dumps(normalized, separators=(',', ':')))
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)
`;
};

const generateCppRunner = (
    userCode: string,
    inputSchema: any[],
    entryFunctionName?: string,
    options?: Judge0Options
) => {
    // Basic C++ runner assuming space-separated inputs or custom parser
    // This is hard to robustly generate without knowing "exact" input format logic for C++
    // For now, implementing basic primitive reading (int, string, vector<int>)

    // We'll generate a `readInput` helper based on schema
    const { definitions, parsers, serializers } = getRegistryCode(inputSchema, 'cpp', userCode);
    const entryInfo = findEntryFunction(userCode, 'cpp', inputSchema, entryFunctionName);

    let readerCode = ``;
    let callerArgs = ``;

    inputSchema.forEach((schema, idx) => {
        const type = schema.type;
        const varName = `arg${idx}`;
        if (type === 'number' || type === 'int') {
            readerCode += `    int ${varName}; cin >> ${varName};\n`;
        } else if (type === 'string') {
            readerCode += `    string ${varName}; cin >> ${varName};\n`;
        } else if (type === 'number[]' || type === 'int[]') {
            readerCode += `    int size${idx}; cin >> size${idx};\n`;
            readerCode += `    vector<int> ${varName}(size${idx});\n`;
            readerCode += `    for(int i=0; i<size${idx}; ++i) cin >> ${varName}[i];\n`;
        } else {
            // Fallback: Assume string prevents compilation error, but won't work for complex types
            readerCode += `    // Complex type ${type} reader not fully implemented\n`;
            readerCode += `    ${type} ${varName};\n`;
        }
        callerArgs += (idx > 0 ? ', ' : '') + varName;
    });

    return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>

using namespace std;

${definitions}
${parsers} // May include helpers
${serializers}

${userCode}

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

${readerCode}

    // Execute
    ${entryInfo.name}(${callerArgs});

    // In-Place: Print modified arg
    // Only support modified input 0 for now or void return implicit check
    // Assuming output is arg${options?.modifiedInputIndex ?? 0}
    
    // Printer for vector<int> (Hardcoded for now as example)
    // In real implementation, we need a generic printer or schema-based printer
    
    // User requested strategy: "normalized output"
    // We need to print arg${options?.modifiedInputIndex ?? 0}
    
    // TODO: Generate printer based on type of arg${options?.modifiedInputIndex ?? 0}
    auto& result = arg${options?.modifiedInputIndex ?? 0};
    
    // Basic Vector Printer (JSON format: [1,2,3])
    cout << "[";
    for(size_t i=0; i<result.size(); ++i) {
        cout << result[i] << (i == result.size()-1 ? "" : ",");
    }
    cout << "]";
    
    return 0;
}
`;
};

const generateJavaRunner = (
    userCode: string,
    inputSchema: any[],
    entryFunctionName?: string,
    options?: Judge0Options
) => {
    const entryInfo = findEntryFunction(userCode, 'java', inputSchema, entryFunctionName);
    const { definitions, parsers, serializers } = getRegistryCode(inputSchema, 'java', userCode);

    // Similar strategy to C++: scanner-based reading
    let readerCode = ``;
    let callerArgs = ``;

    inputSchema.forEach((schema, idx) => {
        const type = schema.type;
        const varName = `arg${idx}`;
        if (type === 'number' || type === 'int') {
            readerCode += `        int ${varName} = scanner.nextInt();\n`;
        } else if (type === 'string') {
            readerCode += `        String ${varName} = scanner.next();\n`;
        } else if (type === 'number[]' || type === 'int[]') {
            readerCode += `        int size${idx} = scanner.nextInt();\n`;
            readerCode += `        int[] ${varName} = new int[size${idx}];\n`;
            readerCode += `        for(int i=0; i<size${idx}; i++) ${varName}[i] = scanner.nextInt();\n`;
        } else {
            readerCode += `        // ${type} reader not fully implemented\n`;
            readerCode += `        Object ${varName} = null;\n`;
        }
        callerArgs += (idx > 0 ? ', ' : '') + varName;
    });

    const isSolutionClass = entryInfo.hasSolutionClass;

    return `
import java.util.*;
import java.io.*;

public class Main {
    ${definitions}
    ${parsers}
    
    // Helper to print array as JSON [1,2,3]
    static void printArray(int[] arr) {
        System.out.print("[");
        for(int i=0; i<arr.length; i++) {
            System.out.print(arr[i] + (i == arr.length-1 ? "" : ","));
        }
        System.out.print("]");
    }

    ${!isSolutionClass ? userCode : ''}

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNext()) return;

${readerCode}

        ${isSolutionClass ? `
        ${userCode}
        Solution sol = new Solution();
        sol.${entryInfo.name}(${callerArgs});
        ` : `
        ${entryInfo.name}(${callerArgs});
        `}

        // Output Result (Assuming arg${options?.modifiedInputIndex ?? 0} is int[])
        printArray(arg${options?.modifiedInputIndex ?? 0});
    }
}
`;
};
