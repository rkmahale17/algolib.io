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

  let finalUserCode = userCode;
  if (language === 'typescript') {
    if (finalUserCode.includes('myReduce') && !finalUserCode.includes('interface Array')) {
      finalUserCode = `
declare global {
  interface Array<T> {
    myReduce<U>(callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
  }
}
` + finalUserCode;
    }
  }

  let runnerCode = `
// ==================== TEST HELPERS ====================
${tsDeclarations}
${TEST_HELPERS}

// ==================== USER CODE ====================
${finalUserCode}

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
    testCode = testCode.replace(/assert\s*\((.+?)\s*===\s*(.+?)\)\s*(;|$)/g, 'assertEquals($1, $2);');
    testCode = testCode.replace(/assert\s*\(\s*deepEqual\s*\((.+?),\s*(.+?)\)\s*\)\s*(;|$)/g, 'assertEquals($1, $2);');

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

export async function executeFrontendLocally(options: FrontendTestRunnerOptions): Promise<any> {
  const { userCode, testCases, language } = options;
  
  // Auto-fix arrayReduce and assert in test cases BEFORE sending to worker
  const sanitizedTestCases = testCases.map(tc => {
    let tcCode = tc.testCode || '';
    if (tcCode.includes('arrayReduce')) {
      tcCode = tcCode.replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*initialValue\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn, initialValue)')
                     .replace(/arrayReduce\s*\(\s*callbackFn\s*,\s*array\s*\)/g, 'array.myReduce(callbackFn)')
                     .replace(/arrayReduce/g, 'array.myReduce');
    }
    // Auto-fix assert(a === b) to assertEquals(a, b) for better error messages
    tcCode = tcCode.replace(/assert\s*\((.+?)\s*===\s*(.+?)\)\s*(;|$)/g, 'assertEquals($1, $2);');
    // Auto-fix assert(deepEqual(a, b)) to assertEquals(a, b)
    tcCode = tcCode.replace(/assert\s*\(\s*deepEqual\s*\((.+?),\s*(.+?)\)\s*\)\s*(;|$)/g, 'assertEquals($1, $2);');
    return { ...tc, testCode: tcCode };
  });

  return new Promise((resolve, reject) => {
    // 1. Build the Worker script string
    const workerScript = `
self.onmessage = async function(e) {
  const { userCode, testCases, language, testHelpers } = e.data;
  let codeToRun = userCode;
  
  if (language === 'typescript') {
    if (codeToRun.includes('myReduce') && !codeToRun.includes('interface Array')) {
      codeToRun = \\\`
declare global {
  interface Array<T> {
    myReduce<U>(callbackFn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
  }
}
\\\` + codeToRun;
    }
    
    try {
      importScripts('https://unpkg.com/@babel/standalone/babel.min.js');
      // Strip types
      codeToRun = Babel.transform(codeToRun, { filename: 'script.ts', presets: ['typescript'] }).code;
    } catch (err) {
      self.postMessage({ type: 'error', error: 'Compilation Error: ' + err.message });
      return;
    }
  }

  try {
    let functionBody = "return (async () => {\\n";
    functionBody += testHelpers + "\\n";
    functionBody += codeToRun + "\\n";
    functionBody += "const __testResults = [];\\n";
    
    testCases.forEach((tc, idx) => {
      functionBody += "try {\\n";
      functionBody += "  await (async () => {\\n";
      functionBody += "    " + tc.testCode + "\\n";
      functionBody += "  })();\\n";
      functionBody += "  __testResults.push({ name: " + JSON.stringify(tc.name) + ", testCode: " + JSON.stringify(tc.testCode) + ", status: 'pass', passed: true, error: null });\\n";
      functionBody += "} catch (e) {\\n";
      functionBody += "  __testResults.push({ name: " + JSON.stringify(tc.name) + ", testCode: " + JSON.stringify(tc.testCode) + ", status: 'fail', passed: false, error: e.stack || e.message || String(e) });\\n";
      functionBody += "}\\n";
    });
    
    functionBody += "return __testResults;\\n})();";

    const runAsync = new Function(functionBody);
    const __testResults = await runAsync();
    self.postMessage({ type: 'success', results: __testResults });
  } catch (err) {
    self.postMessage({ type: 'error', error: 'Runtime Error: ' + (err.message || String(err)) });
  }
};
`;

    // 2. Create blob and instantiate Worker
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    let isDone = false;
    
    // 3. Setup timeout (5 seconds)
    const timer = setTimeout(() => {
      if (!isDone) {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        reject(new Error('Execution Timeout: Code ran longer than 5 seconds. Check for infinite loops.'));
      }
    }, 5000);

    // 4. Listen for results
    worker.onmessage = (e) => {
      isDone = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      
      const { type, results, error } = e.data;
      if (type === 'error') {
        reject(new Error(error));
      } else {
        resolve(results);
      }
    };

    worker.onerror = (e) => {
      isDone = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      reject(new Error('Worker Error: ' + e.message));
    };

    // 5. Send payload
    worker.postMessage({
      userCode,
      testCases: sanitizedTestCases,
      language,
      testHelpers: TEST_HELPERS
    });
  });
}
