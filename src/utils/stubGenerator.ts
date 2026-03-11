// Stub Generator Utility for Code Runner
// Generates complete function stubs with driver code for all supported languages

import { getDSDetails, DSName, SUPPORTED_DS } from '@/lib/dsa-registry';
export type Language = 'typescript' | 'python' | 'cpp' | 'java';

export interface InputField {
    name: string;
    type: 'number' | 'number[]' | 'string' | 'boolean';
    label?: string;
}

interface StubConfig {
    functionName: string;
    inputSchema: InputField[];
    returnType?: string;
    inputs?: Record<string, any>;
}

// Convert snake_case to camelCase for TypeScript/Java
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert camelCase to snake_case for Python/C++
function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

// Infer return type from function name or default to number[]
function inferReturnType(functionName: string, language: Language): string {
    const lowerName = functionName.toLowerCase();

    if (lowerName.includes('search') || lowerName.includes('find')) {
        return language === 'typescript' ? 'number' :
            language === 'python' ? 'int' :
                language === 'cpp' ? 'int' : 'int';
    }

    if (lowerName.includes('sum') || lowerName.includes('max') || lowerName.includes('min')) {
        return language === 'typescript' ? 'number' :
            language === 'python' ? 'int' :
                language === 'cpp' ? 'int' : 'int';
    }

    // Default to array return type - use List[int] for Python 3.8 compatibility
    return language === 'typescript' ? 'number[]' :
        language === 'python' ? 'List[int]' :
            language === 'cpp' ? 'vector<int>' : 'int[]';
}

// Map input type to language-specific type
function mapType(type: string, language: Language): string {
    const rawType = type.toLowerCase();
    const is2D = rawType.includes('[][]') || rawType.endsWith('2d');
    const is1D = (rawType.includes('[]') || rawType.endsWith('array')) && !is2D;

    // Normalize shorthand
    let base = rawType.replace(/[\[\]\d]/g, '');
    if (base === 'n') base = 'number';
    if (base === 's') base = 'string';
    if (base === 'b') base = 'boolean';
    if (base === 'c') base = 'char';

    const typeMap: Record<Language, Record<string, string>> = {
        typescript: {
            'number': 'number',
            'string': 'string',
            'boolean': 'boolean',
            'char': 'string'
        },
        python: {
            'number': 'int',
            'string': 'str',
            'boolean': 'bool',
            'char': 'str'
        },
        cpp: {
            'number': 'int',
            'string': 'string',
            'boolean': 'bool',
            'char': 'char'
        },
        java: {
            'number': 'int',
            'string': 'String',
            'boolean': 'boolean',
            'char': 'char'
        }
    };

    let mappedBase = typeMap[language][base] || base;

    // Handle C++ Pointers for DS
    if (language === 'cpp' && (base === 'listnode' || base === 'treenode' || base === 'graphnode' || base === 'trienode')) {
        mappedBase += '*';
    }

    if (is2D) {
        if (language === 'typescript') return `${mappedBase}[][]`;
        if (language === 'python') return `List[List[${mappedBase}]]`;
        if (language === 'cpp') return `vector<vector<${mappedBase}>>&`; // Pass complex types by ref
        if (language === 'java') return `${mappedBase}[][]`;
    }

    if (is1D) {
        if (language === 'typescript') return `${mappedBase}[]`;
        if (language === 'python') return `List[${mappedBase}]`;
        if (language === 'cpp') return `vector<${mappedBase}>&`;
        if (language === 'java') return `${mappedBase}[]`;
    }

    return mappedBase;
}

// Format value for language-specific syntax
function formatValue(value: any, type: string, language: Language): string {
    if (Array.isArray(value)) {
        const inner = value.map(v => formatValue(v, type.replace('[]', ''), language)).join(', ');
        if (language === 'java' || language === 'cpp') return `{${inner}}`;
        return `[${inner}]`;
    }

    const rawType = type.toLowerCase();
    if (rawType.includes('string') || rawType.includes('s')) {
        return JSON.stringify(value);
    }
    if (rawType.includes('char') || rawType.includes('c')) {
        if (language === 'python' || language === 'typescript') return JSON.stringify(value);
        return `'${value}'`;
    }
    if (rawType.includes('boolean') || rawType.includes('b')) {
        if (language === 'python') return value ? 'True' : 'False';
        return String(value);
    }

    return String(value);
}

// Generate TypeScript stub with driver code
export function generateTypeScriptStub(config: StubConfig): string {
    const { functionName, inputSchema, returnType, inputs } = config;
    const funcName = toCamelCase(functionName);
    const retType = returnType || inferReturnType(funcName, 'typescript');

    // Generate function signature
    const params = inputSchema.map(field =>
        `${field.name}: ${mapType(field.type, 'typescript')}`
    ).join(', ');

    // Generate default return value
    const defaultReturn = retType.includes('[]') ? '[]' :
        retType === 'number' ? '0' :
            retType === 'string' ? '""' :
                retType === 'boolean' ? 'false' : 'null';

    let stub = `function ${funcName}(${params}): ${retType} {\n`;
    stub += `  // TODO: Implement the algorithm\n`;
    stub += `  return ${defaultReturn};\n`;
    stub += `}\n`;

    // Add driver code if inputs are provided
    if (inputs && Object.keys(inputs).length > 0) {
        stub += `\n// Driver Code (Auto-generated - DO NOT MODIFY)\n`;

        // Declare input variables
        inputSchema.forEach(field => {
            const value = inputs[field.name];
            if (value !== undefined) {
                const formattedValue = formatValue(value, field.type, 'typescript');
                stub += `const ${field.name} = ${formattedValue};\n`;
            }
        });

        // Call function and print result
        const args = inputSchema.map(f => f.name).join(', ');
        stub += `console.log(JSON.stringify(${funcName}(${args})));\n`;
    }

    return stub;
}

// Generate Python stub with driver code (Python 3.8 compatible)
export function generatePythonStub(config: StubConfig): string {
    const { functionName, inputSchema, returnType, inputs } = config;
    const funcName = toSnakeCase(functionName);
    const retType = returnType || inferReturnType(funcName, 'python');

    // Generate function signature
    const params = inputSchema.map(field =>
        `${field.name}: ${mapType(field.type, 'python')}`
    ).join(', ');

    // Generate default return value
    const defaultReturn = retType.includes('List') ? '[]' :
        retType === 'int' ? '0' :
            retType === 'str' ? '""' :
                retType === 'bool' ? 'False' : 'None';

    // Add typing import if needed
    let stub = '';
    if (retType.includes('List') || params.includes('List')) {
        stub += `from typing import List\n\n`;
    }

    stub += `def ${funcName}(${params}) -> ${retType}:\n`;
    stub += `    # TODO: Implement the algorithm\n`;
    stub += `    return ${defaultReturn}\n`;

    // Add driver code if inputs are provided
    if (inputs && Object.keys(inputs).length > 0) {
        stub += `\n# Driver Code (Auto-generated - DO NOT MODIFY)\n`;
        stub += `import json\n`;

        // Declare input variables
        inputSchema.forEach(field => {
            const value = inputs[field.name];
            if (value !== undefined) {
                const formattedValue = formatValue(value, field.type, 'python');
                stub += `${field.name} = ${formattedValue}\n`;
            }
        });

        // Call function and print result
        const args = inputSchema.map(f => f.name).join(', ');
        stub += `print(json.dumps(${funcName}(${args})))\n`;
    }

    return stub;
}

// Generate C++ stub with driver code (JSON output format)
export function generateCppStub(config: StubConfig): string {
    const { functionName, inputSchema, returnType, inputs } = config;
    const funcName = toCamelCase(functionName);
    const retType = returnType || inferReturnType(funcName, 'cpp');

    // Generate function signature
    const params = inputSchema.map(field =>
        `${mapType(field.type, 'cpp')} ${field.name}`
    ).join(', ');

    // Generate default return value
    const defaultReturn = retType.includes('vector') ? '{}' : '0';

    let stub = `#include <iostream>\n`;
    stub += `#include <vector>\n`;
    stub += `#include <string>\n`;
    stub += `using namespace std;\n\n`;

    // Add JSON output helper for vectors
    if (retType.includes('vector')) {
        stub += `// Helper function to print vector as JSON array\n`;
        stub += `void printVectorJSON(const vector<int>& v) {\n`;
        stub += `    cout << "[";\n`;
        stub += `    for(size_t i = 0; i < v.size(); i++) {\n`;
        stub += `        cout << v[i];\n`;
        stub += `        if(i < v.size() - 1) cout << ",";\n`;
        stub += `    }\n`;
        stub += `    cout << "]";\n`;
        stub += `}\n\n`;
    }

    stub += `${retType} ${funcName}(${params}) {\n`;
    stub += `    // TODO: Implement the algorithm\n`;
    stub += `    return ${defaultReturn};\n`;
    stub += `}\n`;

    // Add driver code if inputs are provided
    if (inputs && Object.keys(inputs).length > 0) {
        stub += `\n// Driver Code (Auto-generated - DO NOT MODIFY)\n`;
        stub += `int main() {\n`;

        // Declare input variables
        inputSchema.forEach(field => {
            const value = inputs[field.name];
            if (value !== undefined) {
                const formattedValue = formatValue(value, field.type, 'cpp');
                const varType = mapType(field.type, 'cpp').replace('&', '');
                stub += `    ${varType} ${field.name} = ${formattedValue};\n`;
            }
        });

        // Call function and print result in JSON format
        const args = inputSchema.map(f => f.name).join(', ');
        stub += `    auto result = ${funcName}(${args});\n`;

        if (retType.includes('vector')) {
            stub += `    printVectorJSON(result);\n`;
            stub += `    cout << endl;\n`;
        } else {
            stub += `    cout << result << endl;\n`;
        }

        stub += `    return 0;\n`;
        stub += `}\n`;
    }

    return stub;
}

// Generate Java stub with driver code (JSON output format)
export function generateJavaStub(config: StubConfig): string {
    const { functionName, inputSchema, returnType, inputs } = config;
    const funcName = toCamelCase(functionName);
    const retType = returnType || inferReturnType(funcName, 'java');

    // Generate function signature
    const params = inputSchema.map(field =>
        `${mapType(field.type, 'java')} ${field.name}`
    ).join(', ');

    // Generate default return value
    const defaultReturn = retType.includes('[]') ? 'new int[]{}' :
        retType === 'int' ? '0' :
            retType === 'String' ? '""' :
                retType === 'boolean' ? 'false' : 'null';

    let stub = `import java.util.*;\n\n`;
    stub += `public class Main {\n`;

    // Add JSON output helper for arrays
    if (retType.includes('[]')) {
        stub += `    // Helper method to print array as JSON\n`;
        stub += `    private static void printArrayJSON(int[] arr) {\n`;
        stub += `        System.out.print("[");\n`;
        stub += `        for(int i = 0; i < arr.length; i++) {\n`;
        stub += `            System.out.print(arr[i]);\n`;
        stub += `            if(i < arr.length - 1) System.out.print(",");\n`;
        stub += `        }\n`;
        stub += `        System.out.println("]");\n`;
        stub += `    }\n\n`;
    }

    stub += `    public static ${retType} ${funcName}(${params}) {\n`;
    stub += `        // TODO: Implement the algorithm\n`;
    stub += `        return ${defaultReturn};\n`;
    stub += `    }\n`;

    // Add driver code if inputs are provided
    if (inputs && Object.keys(inputs).length > 0) {
        stub += `\n    // Driver Code (Auto-generated - DO NOT MODIFY)\n`;
        stub += `    public static void main(String[] args) {\n`;

        // Declare input variables
        inputSchema.forEach(field => {
            const value = inputs[field.name];
            if (value !== undefined) {
                const varType = mapType(field.type, 'java');
                const formattedValue = formatValue(value, field.type, 'java');

                if (field.type === 'number[]') {
                    stub += `        ${varType} ${field.name} = new int[]${formattedValue};\n`;
                } else {
                    stub += `        ${varType} ${field.name} = ${formattedValue};\n`;
                }
            }
        });

        // Call function and print result in JSON format
        const args = inputSchema.map(f => f.name).join(', ');
        stub += `        ${retType} result = ${funcName}(${args});\n`;

        if (retType.includes('[]')) {
            stub += `        printArrayJSON(result);\n`;
        } else {
            stub += `        System.out.println(result);\n`;
        }

        stub += `    }\n`;
    }

    stub += `}\n`;

    return stub;
}

// Main function to generate stub for any language
export function generateStub(
    language: Language,
    functionName: string,
    inputSchema: InputField[],
    inputs?: Record<string, any>,
    returnType?: string
): string {
    const config: StubConfig = {
        functionName,
        inputSchema,
        returnType,
        inputs
    };

    // Inject Definitions
    const required = new Set<DSName>();

    const checkType = (t: string) => {
        if (!t) return;
        const typeStr = String(t).toLowerCase();
        SUPPORTED_DS.forEach(ds => {
            // Use regex for whole-word matching to avoid 'Node' matching 'TreeNode'
            // Escape special chars in DS name just in case
            const dsLower = ds.toLowerCase();
            const escaped = dsLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`);
            if (regex.test(typeStr)) required.add(ds);
        });
    };

    inputSchema.forEach(i => checkType(i.type));
    if (returnType) checkType(returnType);

    // Heuristic: specific problem names that imply a DS
    if (functionName.toLowerCase().includes('clonegraph')) {
        required.add('Node');
    }

    let definitions = "";
    required.forEach(ds => {
        const details = getDSDetails(ds, language);
        if (details) {
            definitions += details.definition + "\n\n";
        }
    });

    let stub = "";
    switch (language) {
        case 'typescript':
            stub = generateTypeScriptStub(config);
            break;
        case 'python':
            stub = generatePythonStub(config);
            break;
        case 'cpp':
            stub = generateCppStub(config);
            break;
        case 'java':
            stub = generateJavaStub(config);
            break;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }

    return definitions + stub;
}
