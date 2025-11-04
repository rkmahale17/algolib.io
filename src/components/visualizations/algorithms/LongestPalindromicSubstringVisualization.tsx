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
  currentPalindrome: string;
  longestPalindrome: string;
  expandType: 'odd' | 'even' | null;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const LongestPalindromicSubstringVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "babad";
  
  const steps: Step[] = [
    {
      s,
      center: -1,
      left: -1,
      right: -1,
      currentPalindrome: '',
      longestPalindrome: '',
      expandType: null,
      variables: { s: 'babad' },
      message: "Start: Expand around each center (odd and even length palindromes)",
      lineNumber: 1
    },
    {
      s,
      center: 0,
      left: 0,
      right: 0,
      currentPalindrome: 'b',
      longestPalindrome: 'b',
      expandType: 'odd',
      variables: { center: 0, type: 'odd', palindrome: 'b', length: 1 },
      message: "Center=0 (odd): Expand from 'b'. Current longest: 'b' (length 1)",
      lineNumber: 10
    },
    {
      s,
      center: 1,
      left: 0,
      right: 2,
      currentPalindrome: 'bab',
      longestPalindrome: 'bab',
      expandType: 'odd',
      variables: { center: 1, type: 'odd', left: 0, right: 2, palindrome: 'bab', length: 3 },
      message: "Center=1 (odd): Expand from 'a'. Found 'bab' (length 3)!",
      lineNumber: 10
    },
    {
      s,
      center: 2,
      left: 1,
      right: 3,
      currentPalindrome: 'aba',
      longestPalindrome: 'bab',
      expandType: 'odd',
      variables: { center: 2, type: 'odd', palindrome: 'aba', length: 3 },
      message: "Center=2 (odd): Found 'aba' (length 3). Same as current longest",
      lineNumber: 10
    },
    {
      s,
      center: 2,
      left: 2,
      right: 3,
      currentPalindrome: 'ab',
      longestPalindrome: 'bab',
      expandType: 'even',
      variables: { center: 2, type: 'even', palindrome: 'ab', match: false },
      message: "Center=2 (even): 'ab' not palindrome. Stop expanding",
      lineNumber: 10
    },
    {
      s,
      center: 3,
      left: 3,
      right: 3,
      currentPalindrome: 'a',
      longestPalindrome: 'bab',
      expandType: 'odd',
      variables: { center: 3, type: 'odd', palindrome: 'a', length: 1 },
      message: "Center=3 (odd): 'a' (length 1). Not longer than current",
      lineNumber: 10
    },
    {
      s,
      center: 4,
      left: 4,
      right: 4,
      currentPalindrome: 'd',
      longestPalindrome: 'bab',
      expandType: 'odd',
      variables: { center: 4, type: 'odd', palindrome: 'd', length: 1 },
      message: "Center=4 (odd): 'd' (length 1). Not longer than current",
      lineNumber: 10
    },
    {
      s,
      center: -1,
      left: -1,
      right: -1,
      currentPalindrome: '',
      longestPalindrome: 'bab',
      expandType: null,
      variables: { result: 'bab', length: 3 },
      message: "Complete! Longest palindrome: 'bab' (length 3). Time: O(n²), Space: O(1)",
      lineNumber: 19
    }
  ];

  const code = `function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  
  let longest = "";
  
  function expandAroundCenter(left: number, right: number): string {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return s.substring(left + 1, right);
  }
  
  for (let i = 0; i < s.length; i++) {
    // Odd length palindromes (center is single char)
    const odd = expandAroundCenter(i, i);
    // Even length palindromes (center is between chars)
    const even = expandAroundCenter(i, i + 1);
    
    const current = odd.length > even.length ? odd : even;
    if (current.length > longest.length) {
      longest = current;
    }
  }
  
  return longest;
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
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Longest Palindromic Substring</h3>

            <div className="space-y-4">
              {/* String */}
              <div>
                <div className="text-sm font-semibold mb-2">String:</div>
                <div className="flex gap-1">
                  {currentStep.s.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 flex items-center justify-center rounded font-mono text-lg font-bold ${
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
              {currentStep.currentPalindrome && (
                <div className="p-4 bg-primary/20 rounded border border-primary/30">
                  <div className="text-sm font-semibold mb-1">Current Palindrome:</div>
                  <div className="text-xl font-bold font-mono text-primary">
                    "{currentStep.currentPalindrome}" (length: {currentStep.currentPalindrome.length})
                  </div>
                </div>
              )}

              {/* Longest Palindrome */}
              {currentStep.longestPalindrome && (
                <div className="p-4 bg-green-500/20 rounded border border-green-500/30">
                  <div className="text-sm font-semibold mb-1">Longest So Far:</div>
                  <div className="text-xl font-bold font-mono text-green-600">
                    "{currentStep.longestPalindrome}" (length: {currentStep.longestPalindrome.length})
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
