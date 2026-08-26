export interface FrontendTestCase {
  name: string;
  testCode: string;
  isSubmission?: boolean;
}

export interface FrontendTestRunnerOptions {
  userCode: string;
  testCases: FrontendTestCase[];
  language: 'javascript' | 'typescript';
  functionName?: string;
}

const TEST_HELPERS = `
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || typeof a !== 'object' || b == null || typeof b !== 'object') return false;
  let keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEquals(actual, expected, message = '') {
  if (!deepEqual(actual, expected)) {
    throw new Error(message || \`Expected \${JSON.stringify(expected)} but got \${JSON.stringify(actual)}\`);
  }
}

async function assertThrows(fn, message = 'Expected function to throw') {
  let threw = false;
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
  } catch (e) {
    threw = true;
  }
  if (!threw) {
    throw new Error(message || 'Expected function to throw');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createMockFn() {
  const mockFn = function(...args) {
    mockFn.called = true;
    mockFn.callCount++;
    mockFn.calls.push(args);
    mockFn.lastCalledWith = args;
    if (mockFn._impl) {
      return mockFn._impl(...args);
    }
    return mockFn._returnValue;
  };
  mockFn.called = false;
  mockFn.callCount = 0;
  mockFn.calls = [];
  mockFn.lastCalledWith = [];
  mockFn._returnValue = undefined;
  mockFn._impl = null;

  mockFn.mockReturnValue = function(val) {
    mockFn._returnValue = val;
    return mockFn;
  };
  mockFn.mockImplementation = function(fn) {
    mockFn._impl = fn;
    return mockFn;
  };
  mockFn.reset = function() {
    mockFn.called = false;
    mockFn.callCount = 0;
    mockFn.calls = [];
    mockFn.lastCalledWith = [];
    mockFn._returnValue = undefined;
    mockFn._impl = null;
  };

  return mockFn;
}
`;

export function generateFrontendTestRunner(options: FrontendTestRunnerOptions): string {
  const { userCode, testCases, language } = options;

  const tsDeclarations = language === 'typescript' ? `
// --- TS Declarations ---
declare var process: any;
// -----------------------
` : '';

  if (language === 'typescript') {
    if (userCode.includes('myReduce') && !userCode.includes('interface Array')) {
      userCode = `
declare global {
  interface Array<T> {
    myReduce<U>(callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
  }
}
` + userCode;
    }
  }

  let runnerCode = `
// ==================== TEST HELPERS ====================
${tsDeclarations}
${TEST_HELPERS}

// ==================== USER CODE ====================
${userCode}

// ==================== TEST RUNNER ====================
(async function runTests() {
  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Global test timeout exceeded (30s)')), 30000);
  });

  try {
    await Promise.race([
      (async () => {
`;

  testCases.forEach((tc, index) => {
    // Auto-fix arrayReduce test cases for frontend problems
    let testCode = tc.testCode || '';
    if (testCode.includes('arrayReduce')) {
        testCode = testCode.replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*initialValue\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn, initialValue)')
                           .replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn)')
                           .replace(/arrayReduce/g, 'array.myReduce');
    }

    runnerCode += `
        // Test: ${tc.name}
        try {
          await (async () => {
            ${testCode}
          })();
          results.push({ name: ${JSON.stringify(tc.name)}, status: 'pass', passed: true });
          passedCount++;
        } catch (e) {
          results.push({ name: ${JSON.stringify(tc.name)}, status: 'fail', passed: false, error: e.message || String(e) });
          failedCount++;
        }
`;
  });

  runnerCode += `
      })(),
      timeoutPromise
    ]);
  } catch (e) {
    console.error("Critical error during test execution:", e.message);
  } finally {
    console.log('\\n___TEST_RESULTS_START___');
    console.log(JSON.stringify(results));
    console.log('___TEST_RESULTS_END___');
    process.exit(0);
  }
})();
`;

  return runnerCode;
}

export function generateFrontendSubmissionRunner(options: FrontendTestRunnerOptions): string {
  const submissionTestCases = options.testCases.filter(tc => tc.isSubmission);
  return generateFrontendTestRunner({
    ...options,
    testCases: submissionTestCases.length > 0 ? submissionTestCases : options.testCases
  });
}
