import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  s: string;
  center: number;
  left: number;
  right: number;
  palindrome: string;
  count: number;
  expandType: 'odd' | 'even' | null;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
  foundPalindromes: string[];
}

export const PalindromicSubstringsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "aaa";
  
  const steps: Step[] = [
    {
      s,
      center: -1,
      left: -1,
      right: -1,
      palindrome: '',
      count: 0,
      expandType: null,
      variables: { s: 'aaa' },
      message: "Start: Count all palindromic substrings. Expand around each center",
      lineNumber: 1,
      foundPalindromes: []
    },
    {
      s,
      center: 0,
      left: 0,
      right: 0,
      palindrome: 'a',
      count: 1,
      expandType: 'odd',
      variables: { center: 0, type: 'odd', palindrome: 'a', count: 1 },
      message: "Center=0 (odd): 'a' is palindrome. Count = 1",
      lineNumber: 14,
      foundPalindromes: ['a']
    },
    {
      s,
      center: 1,
      left: 1,
      right: 1,
      palindrome: 'a',
      count: 2,
      expandType: 'odd',
      variables: { center: 1, type: 'odd', palindrome: 'a', count: 2 },
      message: "Center=1 (odd): 'a' is palindrome. Count = 2",
      lineNumber: 14,
      foundPalindromes: ['a', 'a']
    },
    {
      s,
      center: 1,
      left: 0,
      right: 2,
      palindrome: 'aaa',
      count: 3,
      expandType: 'odd',
      variables: { center: 1, left: 0, right: 2, palindrome: 'aaa', count: 3 },
      message: "Expand: 'aaa' is palindrome. Count = 3",
      lineNumber: 10,
      foundPalindromes: ['a', 'a', 'aaa']
    },
    {
      s,
      center: 0,
      left: 0,
      right: 1,
      palindrome: 'aa',
      count: 4,
      expandType: 'even',
      variables: { center: 0, type: 'even', palindrome: 'aa', count: 4 },
      message: "Center=0 (even): 'aa' is palindrome. Count = 4",
      lineNumber: 10,
      foundPalindromes: ['a', 'a', 'aaa', 'aa']
    },
    {
      s,
      center: 1,
      left: 1,
      right: 2,
      palindrome: 'aa',
      count: 5,
      expandType: 'even',
      variables: { center: 1, type: 'even', palindrome: 'aa', count: 5 },
      message: "Center=1 (even): 'aa' is palindrome. Count = 5",
      lineNumber: 10,
      foundPalindromes: ['a', 'a', 'aaa', 'aa', 'aa']
    },
    {
      s,
      center: 2,
      left: 2,
      right: 2,
      palindrome: 'a',
      count: 6,
      expandType: 'odd',
      variables: { center: 2, type: 'odd', palindrome: 'a', count: 6 },
      message: "Center=2 (odd): 'a' is palindrome. Count = 6",
      lineNumber: 14,
      foundPalindromes: ['a', 'a', 'aaa', 'aa', 'aa', 'a']
    },
    {
      s,
      center: -1,
      left: -1,
      right: -1,
      palindrome: '',
      count: 6,
      expandType: null,
      variables: { totalCount: 6 },
      message: "Complete! Total palindromic substrings: 6. Time: O(n²), Space: O(1)",
      lineNumber: 17,
      foundPalindromes: ['a', 'a', 'aaa', 'aa', 'aa', 'a']
    }
  ];

  const code = `function countSubstrings(s: string): number {
  let count = 0;
  
  function expandAroundCenter(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++; // Found a palindrome
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    // Odd length palindromes
    expandAroundCenter(i, i);
    // Even length palindromes
    expandAroundCenter(i, i + 1);
  }
  
  return count;
}`;

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => setCurrentStepIndex(0);

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleReset} disabled={currentStepIndex === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepBack} disabled={currentStepIndex === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4 overflow-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Palindromic Substrings</h3>

            <div className="space-y-4">
              {/* String */}
              <div>
                <div className="text-sm font-semibold mb-2">String:</div>
                <div className="flex gap-1">
                  {currentStep.s.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 flex items-center justify-center rounded font-mono text-2xl font-bold ${
                        idx === currentStep.center
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary'
                          : idx >= currentStep.left && idx <= currentStep.right && currentStep.left !== -1
                          ? 'bg-green-500/30 border-2 border-green-500'
                          : 'bg-muted'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expand Type */}
              {currentStep.expandType && (
                <div className="flex gap-2">
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    currentStep.expandType === 'odd' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    Odd Length
                  </div>
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    currentStep.expandType === 'even' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    Even Length
                  </div>
                </div>
              )}

              {/* Current Palindrome */}
              {currentStep.palindrome && (
                <div className="p-4 bg-primary/20 rounded border border-primary/30">
                  <div className="text-sm font-semibold mb-1">Found Palindrome:</div>
                  <div className="text-2xl font-bold font-mono text-primary">
                    "{currentStep.palindrome}"
                  </div>
                </div>
              )}

              {/* Count */}
              <div className="p-4 bg-green-500/20 rounded border border-green-500/30">
                <div className="text-sm font-semibold mb-1">Total Count:</div>
                <div className="text-4xl font-bold text-green-600">
                  {currentStep.count}
                </div>
              </div>

              {/* Found Palindromes */}
              {currentStep.foundPalindromes.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Found So Far:</div>
                  <div className="flex gap-2 flex-wrap">
                    {currentStep.foundPalindromes.map((p, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded bg-accent text-accent-foreground font-mono text-sm"
                      >
                        "{p}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variables */}
              <div>
                <div className="text-sm font-semibold mb-2">Variables:</div>
                <div className="p-3 bg-muted/50 rounded text-xs font-mono space-y-1">
                  {Object.entries(currentStep.variables).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>{' '}
                      <span className="text-primary">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
