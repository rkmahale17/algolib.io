import fs from 'fs';
import path from 'path';
import { algorithmsDB } from '../src/data/algorithmsDB';

// Helper function to extract function signature and generate starter code
function generateStarterCode(optimizedCode: string, lang: string): string {
    const lines = optimizedCode.trim().split('\n');

    if (lang === 'typeScript') {
        // Extract function signature (first line usually)
        const signatureMatch = optimizedCode.match(/^(function\s+\w+\([^)]*\):\s*[^{]+|class\s+\w+\s*\{)/);
        if (signatureMatch) {
            const signature = signatureMatch[0];
            if (signature.startsWith('class')) {
                // For classes, extract constructor and methods
                return optimizedCode.split('\n').slice(0, 3).join('\n') + '\n  // TODO: Implement\n}';
            } else {
                // For functions
                const returnTypeMatch = signature.match(/:\s*([^{]+)$/);
                const returnType = returnTypeMatch ? returnTypeMatch[1].trim() : 'any';

                // Determine default return value
                let defaultReturn = 'null';
                if (returnType.includes('number')) defaultReturn = '0';
                if (returnType.includes('boolean')) defaultReturn = 'false';
                if (returnType.includes('string')) defaultReturn = '""';
                if (returnType.includes('[]')) defaultReturn = '[]';
                if (returnType === 'void') defaultReturn = '';

                const returnStatement = defaultReturn ? `\n  return ${defaultReturn};` : '';
                return `${signature} {\n  // TODO: Implement${returnStatement}\n}`;
            }
        }
    } else if (lang === 'python') {
        // Extract function/class signature
        const signatureMatch = optimizedCode.match(/^(def\s+\w+\([^)]*\)\s*->\s*[^:]+:|class\s+\w+:)/m);
        if (signatureMatch) {
            const signature = signatureMatch[0];
            if (signature.startsWith('class')) {
                return optimizedCode.split('\n').slice(0, 3).join('\n') + '\n    # TODO: Implement\n    pass';
            } else {
                const returnTypeMatch = signature.match(/->\s*([^:]+):/);
                const returnType = returnTypeMatch ? returnTypeMatch[1].trim() : 'None';

                let defaultReturn = 'None';
                if (returnType.includes('int')) defaultReturn = '0';
                if (returnType.includes('bool')) defaultReturn = 'False';
                if (returnType.includes('str')) defaultReturn = '""';
                if (returnType.includes('List')) defaultReturn = '[]';

                const returnStatement = defaultReturn !== 'None' ? `\n    return ${defaultReturn}` : '\n    pass';
                return `${signature}\n    # TODO: Implement${returnStatement}`;
            }
        }
    } else if (lang === 'java') {
        // Extract method/class signature
        const signatureMatch = optimizedCode.match(/^(public\s+[\w\[\]<>]+\s+\w+\([^)]*\)|class\s+\w+)/m);
        if (signatureMatch) {
            const signature = signatureMatch[0];
            if (signature.startsWith('class')) {
                return optimizedCode.split('\n').slice(0, 3).join('\n') + '\n    // TODO: Implement\n}';
            } else {
                const returnTypeMatch = signature.match(/public\s+([\w\[\]<>]+)\s+\w+/);
                const returnType = returnTypeMatch ? returnTypeMatch[1].trim() : 'void';

                let defaultReturn = 'null';
                if (returnType === 'int' || returnType === 'long') defaultReturn = '0';
                if (returnType === 'boolean') defaultReturn = 'false';
                if (returnType === 'double' || returnType === 'float') defaultReturn = '0.0';
                if (returnType === 'void') defaultReturn = '';
                if (returnType.includes('[]')) defaultReturn = 'null';

                const returnStatement = defaultReturn ? `\n    return ${defaultReturn};` : '';
                return `${signature} {\n    // TODO: Implement${returnStatement}\n}`;
            }
        }
    } else if (lang === 'cpp') {
        // Extract function/class signature
        const signatureMatch = optimizedCode.match(/^([\w<>]+\s+\w+\([^)]*\)|class\s+\w+|struct\s+\w+)/m);
        if (signatureMatch) {
            const signature = signatureMatch[0];
            if (signature.startsWith('class') || signature.startsWith('struct')) {
                return optimizedCode.split('\n').slice(0, 3).join('\n') + '\n    // TODO: Implement\n};';
            } else {
                const returnTypeMatch = signature.match(/^([\w<>]+)\s+\w+/);
                const returnType = returnTypeMatch ? returnTypeMatch[1].trim() : 'void';

                let defaultReturn = 'nullptr';
                if (returnType === 'int' || returnType === 'long') defaultReturn = '0';
                if (returnType === 'bool') defaultReturn = 'false';
                if (returnType === 'double' || returnType === 'float') defaultReturn = '0.0';
                if (returnType === 'void') defaultReturn = '';
                if (returnType.includes('vector')) defaultReturn = '{}';

                const returnStatement = defaultReturn ? `\n    return ${defaultReturn};` : '';
                return `${signature} {\n    // TODO: Implement${returnStatement}\n}`;
            }
        }
    }

    // Fallback: just add TODO comment
    return lines[0] + ' {\n  // TODO: Implement\n}';
}

function addStarterCode(entry: any) {
    const updated = { ...entry };

    if (entry.implementations && entry.implementations.length > 0) {
        updated.implementations = entry.implementations.map((impl: any) => {
            const updatedImpl = { ...impl };

            // Check if starter code exists
            const starterIndex = impl.code.findIndex((c: any) => c.codeType === 'starter');
            const hasStarter = starterIndex !== -1;

            // Check if it's a placeholder (contains only TODO comment)
            const isPlaceholder = hasStarter && (
                impl.code[starterIndex].code === '// TODO: Starter code' ||
                impl.code[starterIndex].code === '# TODO: Starter code' ||
                impl.code[starterIndex].code.trim().length < 20
            );

            if (!hasStarter || isPlaceholder) {
                // Find the optimized code
                const optimizedCode = impl.code.find((c: any) => c.codeType === 'optimize');

                if (optimizedCode) {
                    // Generate starter code
                    const starterCode = generateStarterCode(optimizedCode.code, impl.lang);

                    if (isPlaceholder) {
                        // Replace the placeholder
                        updatedImpl.code = impl.code.map((c: any, idx: number) =>
                            idx === starterIndex ? { codeType: 'starter', code: starterCode } : c
                        );
                    } else {
                        // Add starter code to the implementations
                        updatedImpl.code = [
                            ...impl.code,
                            {
                                codeType: 'starter',
                                code: starterCode
                            }
                        ];
                    }
                }
            }

            return updatedImpl;
        });
    }

    return updated;
}

const updatedDB: Record<string, any> = {};

for (const key in algorithmsDB) {
    updatedDB[key] = addStarterCode(algorithmsDB[key]);
}

// Read the original file to get the interface definition
const originalFileContent = fs.readFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), 'utf-8');
const interfaceMatch = originalFileContent.match(/export interface AlgorithmDB \{[\s\S]*?\n\}/);
const interfaceDef = interfaceMatch ? interfaceMatch[0] : '';

if (!interfaceDef) {
    console.error("Could not find AlgorithmDB interface definition.");
    process.exit(1);
}

const newContent = `
${interfaceDef}

export const algorithmsDB: Record<string, AlgorithmDB> = ${JSON.stringify(updatedDB, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/algorithmsDB.ts'), newContent);

console.log("Successfully added/replaced starter code for all algorithms.");
