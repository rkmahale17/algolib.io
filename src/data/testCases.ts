/**
 * Test Cases for Algorithm Validation
 * 
 * This file stores predefined test cases for each algorithm.
 * Each algorithm has 4-6 test cases covering typical scenarios and edge cases.
 * Test cases include expected outputs to validate user code without calling reference implementation.
 */

export interface TestCase {
    input: any[];
    expectedOutput: any;
    description?: string;
}

export interface AlgorithmTestData {
    algorithmId: string;
    testCases: TestCase[];
    timeComplexity: string;
    spaceComplexity: string;
}

export const algorithmTestCases: Record<string, AlgorithmTestData> = {
    "two-sum": {
        algorithmId: "two-sum",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        testCases: [
            {
                input: [[2, 7, 11, 15], 9],
                expectedOutput: [0, 1],
                description: "Basic case - first two elements"
            },
            {
                input: [[3, 2, 4], 6],
                expectedOutput: [1, 2],
                description: "Elements in middle"
            },
            {
                input: [[3, 3], 6],
                expectedOutput: [0, 1],
                description: "Duplicate numbers"
            },
            {
                input: [[-1, -2, -3, -4, -5], -8],
                expectedOutput: [2, 4],
                description: "Negative numbers"
            },
            {
                input: [[1, 5, 3, 7, 9, 2], 10],
                expectedOutput: [0, 4],
                description: "Larger array"
            },
            {
                input: [[0, 4, 3, 0], 0],
                expectedOutput: [0, 3],
                description: "Target is zero"
            }
        ]
    },
    "best-time-to-buy-and-sell-stock": {
        algorithmId: "best-time-to-buy-and-sell-stock",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[7, 1, 5, 3, 6, 4]],
                expectedOutput: 5,
                description: "Buy at 1, sell at 6"
            },
            {
                input: [[7, 6, 4, 3, 1]],
                expectedOutput: 0,
                description: "Prices only decrease"
            },
            {
                input: [[1, 2]],
                expectedOutput: 1,
                description: "Minimum array size"
            },
            {
                input: [[2, 4, 1]],
                expectedOutput: 2,
                description: "Peak before valley"
            },
            {
                input: [[3, 2, 6, 5, 0, 3]],
                expectedOutput: 4,
                description: "Multiple peaks and valleys"
            },
            {
                input: [[1, 2, 3, 4, 5]],
                expectedOutput: 4,
                description: "Prices only increase"
            }
        ]
    },
    "contains-duplicate": {
        algorithmId: "contains-duplicate",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        testCases: [
            {
                input: [[1, 2, 3, 1]],
                expectedOutput: true,
                description: "Contains duplicate"
            },
            {
                input: [[1, 2, 3, 4]],
                expectedOutput: false,
                description: "No duplicates"
            },
            {
                input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]],
                expectedOutput: true,
                description: "Multiple duplicates"
            },
            {
                input: [[1]],
                expectedOutput: false,
                description: "Single element"
            },
            {
                input: [[-1, -1]],
                expectedOutput: true,
                description: "Negative duplicates"
            },
            {
                input: [[0, 1, 2, 3, 4, 5]],
                expectedOutput: false,
                description: "Sequential no duplicates"
            }
        ]
    },
    "maximum-subarray": {
        algorithmId: "maximum-subarray",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
                expectedOutput: 6,
                description: "Kadane's classic example"
            },
            {
                input: [[1]],
                expectedOutput: 1,
                description: "Single element"
            },
            {
                input: [[5, 4, -1, 7, 8]],
                expectedOutput: 23,
                description: "All positive except one"
            },
            {
                input: [[-1, -2, -3, -4]],
                expectedOutput: -1,
                description: "All negative numbers"
            },
            {
                input: [[1, 2, 3, 4, 5]],
                expectedOutput: 15,
                description: "All positive numbers"
            },
            {
                input: [[-2, -1]],
                expectedOutput: -1,
                description: "Two negative numbers"
            }
        ]
    },
    "product-of-array-except-self": {
        algorithmId: "product-of-array-except-self",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[1, 2, 3, 4]],
                expectedOutput: [24, 12, 8, 6],
                description: "Basic case"
            },
            {
                input: [[-1, 1, 0, -3, 3]],
                expectedOutput: [0, 0, 9, 0, 0],
                description: "Contains zero"
            },
            {
                input: [[1, 2]],
                expectedOutput: [2, 1],
                description: "Two elements"
            },
            {
                input: [[2, 3, 4, 5]],
                expectedOutput: [60, 40, 30, 24],
                description: "All positive"
            },
            {
                input: [[-1, -2, -3, -4]],
                expectedOutput: [-24, -12, -8, -6],
                description: "All negative"
            },
            {
                input: [[0, 0]],
                expectedOutput: [0, 0],
                description: "Multiple zeros"
            }
        ]
    },
    "maximum-product-subarray": {
        algorithmId: "maximum-product-subarray",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[2, 3, -2, 4]],
                expectedOutput: 6,
                description: "Mixed positive and negative"
            },
            {
                input: [[-2, 0, -1]],
                expectedOutput: 0,
                description: "Contains zero"
            },
            {
                input: [[-2]],
                expectedOutput: -2,
                description: "Single negative"
            },
            {
                input: [[2, -5, -2, -4, 3]],
                expectedOutput: 24,
                description: "Even negatives"
            },
            {
                input: [[0, 2]],
                expectedOutput: 2,
                description: "Zero at start"
            },
            {
                input: [[-2, 3, -4]],
                expectedOutput: 24,
                description: "Two negatives make positive"
            }
        ]
    },
    "find-minimum-in-rotated-sorted-array": {
        algorithmId: "find-minimum-in-rotated-sorted-array",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[3, 4, 5, 1, 2]],
                expectedOutput: 1,
                description: "Rotated array"
            },
            {
                input: [[4, 5, 6, 7, 0, 1, 2]],
                expectedOutput: 0,
                description: "Larger rotated array"
            },
            {
                input: [[11, 13, 15, 17]],
                expectedOutput: 11,
                description: "No rotation"
            },
            {
                input: [[2, 1]],
                expectedOutput: 1,
                description: "Two elements rotated"
            },
            {
                input: [[1]],
                expectedOutput: 1,
                description: "Single element"
            },
            {
                input: [[2, 3, 4, 5, 1]],
                expectedOutput: 1,
                description: "Minimum at end"
            }
        ]
    },
    "search-in-rotated-sorted-array": {
        algorithmId: "search-in-rotated-sorted-array",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[4, 5, 6, 7, 0, 1, 2], 0],
                expectedOutput: 4,
                description: "Target in rotated part"
            },
            {
                input: [[4, 5, 6, 7, 0, 1, 2], 3],
                expectedOutput: -1,
                description: "Target not found"
            },
            {
                input: [[1], 0],
                expectedOutput: -1,
                description: "Single element not found"
            },
            {
                input: [[1], 1],
                expectedOutput: 0,
                description: "Single element found"
            },
            {
                input: [[4, 5, 6, 7, 0, 1, 2], 5],
                expectedOutput: 1,
                description: "Target in sorted part"
            },
            {
                input: [[3, 1], 1],
                expectedOutput: 1,
                description: "Two elements rotated"
            }
        ]
    },
    "3sum": {
        algorithmId: "3sum",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        testCases: [
            {
                input: [[-1, 0, 1, 2, -1, -4]],
                expectedOutput: [[-1, -1, 2], [-1, 0, 1]],
                description: "Multiple triplets"
            },
            {
                input: [[0, 1, 1]],
                expectedOutput: [],
                description: "No triplets"
            },
            {
                input: [[0, 0, 0]],
                expectedOutput: [[0, 0, 0]],
                description: "All zeros"
            },
            {
                input: [[-2, 0, 1, 1, 2]],
                expectedOutput: [[-2, 0, 2], [-2, 1, 1]],
                description: "Two triplets"
            },
            {
                input: [[1, 2, -2, -1]],
                expectedOutput: [],
                description: "No valid triplets"
            },
            {
                input: [[-4, -1, -1, 0, 1, 2]],
                expectedOutput: [[-1, -1, 2], [-1, 0, 1]],
                description: "Negative and positive mix"
            }
        ]
    }
};

/**
 * Get test cases for a specific algorithm
 */
export const getTestCases = (algorithmId: string): AlgorithmTestData | undefined => {
    return algorithmTestCases[algorithmId];
};

/**
 * Check if test cases exist for an algorithm
 */
export const hasTestCases = (algorithmId: string): boolean => {
    return algorithmId in algorithmTestCases;
};
