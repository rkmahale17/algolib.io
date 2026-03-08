
const { generateTestRunner } = require('./src/utils/testRunnerGenerator');

const testCases = [
    {
        input: [[3, 1, 2]],
        expectedOutput: [1, 2, 3]
    }
];

const inputSchema = [{ name: 'nums', type: 'number[]' }];

try {
    console.log("=== JAVA RUNNER (unordered: true) ===");
    const javaRunner = generateTestRunner(
        "class Solution { public int[] sortArray(int[] nums) { return nums; } }",
        'java',
        testCases,
        inputSchema,
        'sortArray',
        { unordered: true }
    );
    console.log(javaRunner.includes('normalize(serializedActual, true)') ? "PASS: Java normalize call found" : "FAIL: Java normalize call missing");
    console.log(javaRunner.includes('if (obj instanceof long[])') ? "PASS: Java long[] support found" : "FAIL: Java long[] support missing");

    console.log("\n=== CPP RUNNER (unordered: true, multiExpected: true) ===");
    const cppRunner = generateTestRunner(
        "class Solution { public: vector<int> sortArray(vector<int>& nums) { return nums; } };",
        'cpp',
        [
            {
                input: [[1, 2]],
                expectedOutput: [[1, 2], [2, 1]]
            }
        ],
        inputSchema,
        'sortArray',
        { unordered: true, multiExpected: true }
    );

    console.log(cppRunner.includes('normalize(a, true)') ? "PASS: C++ normalize call found" : "FAIL: C++ normalize call missing");
    console.log(cppRunner.includes('expected_variants') ? "PASS: C++ multiExpected support found" : "FAIL: C++ multiExpected support missing");
    console.log(cppRunner.includes('std::sort(res.begin(), res.end()') ? "PASS: C++ sort logic found" : "FAIL: C++ sort logic missing");
} catch (e) {
    console.error("Error during generation:", e);
}
