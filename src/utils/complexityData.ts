
export type ComplexityType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)';

export const generateComplexityData = (n: number, type: ComplexityType) => {
    const data = [];
    const step = Math.max(1, Math.floor(n / 20)); // Generate ~20 points for smoothness

    for (let i = 1; i <= n; i += step) {
        let value = 0;
        switch (type) {
            case 'O(1)':
                value = 1;
                break;
            case 'O(log n)':
                value = Math.log2(i);
                break;
            case 'O(n)':
                value = i;
                break;
            case 'O(n log n)':
                value = i * Math.log2(i);
                break;
            case 'O(n^2)':
                value = i * i;
                break;
        }
        data.push({ n: i, steps: value });
    }
    return data;
};

export const complexityConfig: Record<ComplexityType, { title: string; color: string; description: string; detailedDescription: string; examples: string[] }> = {
    'O(1)': {
        title: 'Constant Time',
        color: '#22c55e', // green-500
        description: 'Execution time remains the same regardless of input size.',
        detailedDescription: "Constant time algorithms are the gold standard for performance. No matter if your input has 10 items or 10 billion, these operations take the exact same amount of time. They typically involve direct access to elements or simple arithmetic calculations.",
        examples: [
            "Accessing an array element by index: arr[i]",
            "Inserting a node at the head of a linked list",
            "Pushing/Popping from a Stack",
            "Checking if a number is even or odd",
            "Looking up a value in a Hash Map (average case)"
        ]
    },
    'O(log n)': {
        title: 'Logarithmic Time',
        color: '#3b82f6', // blue-500
        description: 'Execution time grows slowly as input size increases.',
        detailedDescription: "Logarithmic time implies that the problem space is halved at every step. This makes these algorithms extremely efficient for massive datasets. Doubling the input size only adds a single extra step to the computation.",
        examples: [
            "Binary Search in a sorted array",
            "Operations in a Balanced Binary Search Tree (Insert, Delete, Search)",
            "Calculating x^n using Binary Exponentiation",
            "Finding the largest prime factor of a number (efficiently)",
            "Searching in a Skip List"
        ]
    },
    'O(n)': {
        title: 'Linear Time',
        color: '#eab308', // yellow-500
        description: 'Execution time grows proportionally with input size.',
        detailedDescription: "Linear time means the algorithm must visit every element in the input at least once. If you double the input size, the time taken effectively doubles. This is common for iterating through arrays or lists.",
        examples: [
            "Linear Search: Finding an item in an unsorted array",
            "Traversing a Linked List to find the length",
            "Comparing two strings for equality",
            "Bucket Sort (in certain conditions)",
            "Finding the Maximum or Minimum element in an array"
        ]
    },
    'O(n log n)': {
        title: 'Linearithmic Time',
        color: '#f97316', // orange-500
        description: 'Common in efficient sorting algorithms.',
        detailedDescription: "Linearithmic time is slightly slower than linear time but much faster than quadratic time. It often arises in divide-and-conquer algorithms where the problem is split (log n) and results are combined (n steps). It is the benchmark for efficient general-purpose sorting.",
        examples: [
            "Merge Sort: Divide and Conquer sorting",
            "Quick Sort: Efficient sorting (average case)",
            "Heap Sort: Using a binary heap",
            "Timsort: Used in Python's sorted() and Java's Arrays.sort()",
            "Building a Segment Tree"
        ]
    },
    'O(n^2)': {
        title: 'Quadratic Time',
        color: '#ef4444', // red-500
        description: 'Performance degrades significantly with large inputs.',
        detailedDescription: "Quadratic time usually involves nested loops where for every element, you iterate through every other element. While acceptable for small inputs, these algorithms become painfully slow as N grows, making them unsuitable for large scale data processing.",
        examples: [
            "Bubble Sort: Swapping adjacent elements repeatedly",
            "Selection Sort: Finding minimum element repeatedly",
            "Insertion Sort: Inserting elements into sorted subarray",
            "Checking for duplicates in an array using nested loops",
            "Traversing a 2D array (Matrix) of size N x N"
        ]
    }
};
