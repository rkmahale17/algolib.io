
import { generateTestRunner } from './src/utils/testRunnerGenerator';

// Mock types
interface TestCase {
    input: any[];
    expectedOutput: any;
}

const runTest = () => {
    const userCode = `
    function solve(nums: number[]): void {
        // Do nothing, so nums remains []
    }
    `;

    const testCases: TestCase[] = [
        { input: [[]], expectedOutput: [] } // Empty array test case
    ];

    const inputSchema = [{ type: 'integer[]', name: 'nums' }];

    const runnerCode = generateTestRunner(
        userCode,
        'typescript',
        testCases,
        inputSchema,
        'solve',
        { returnModifiedInput: true, modifiedInputIndex: 0 }
    );

    console.log("--------------- GENERATED CODE ---------------");
    console.log(runnerCode);
    console.log("----------------------------------------------");

    // We can't easily eval the code because it has exports and specific environment assumptions.
    // But we can inspect the generated logic for the inplace check.
};

runTest();
