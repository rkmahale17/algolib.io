import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  original: string;
  cleaned: string;
  left: number;
  right: number;
  leftChar: string;
  rightChar: string;
  match: boolean | null;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
  isValid?: boolean;
}

export const ValidPalindromeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const original = "A man, a plan, a canal: Panama";
  const cleaned = "amanaplanacanalpanama";
  
  const steps: Step[] = [
    {
      original,
      cleaned,
      left: -1,
      right: -1,
      leftChar: '',
      rightChar: '',
      match: null,
      variables: { s: 'A man, a plan, a canal: Panama' },
      message: "Start: Remove non-alphanumeric, convert to lowercase",
      lineNumber: 1
    },
    {
      original,
      cleaned,
      left: 0,
      right: 21,
      leftChar: 'a',
      rightChar: 'a',
      match: true,
      variables: { left: 0, right: 21, leftChar: 'a', rightChar: 'a', match: true },
      message: "Compare left='a' and right='a'. Match! Continue",
      lineNumber: 8
    },
    {
      original,
      cleaned,
      left: 1,
      right: 20,
      leftChar: 'm',
      rightChar: 'm',
      match: true,
      variables: { left: 1, right: 20, leftChar: 'm', rightChar: 'm', match: true },
      message: "Compare left='m' and right='m'. Match!",
      lineNumber: 8
    },
    {
      original,
      cleaned,
      left: 2,
      right: 19,
      leftChar: 'a',
      rightChar: 'a',
      match: true,
      variables: { left: 2, right: 19, leftChar: 'a', rightChar: 'a', match: true },
      message: "Compare left='a' and right='a'. Match!",
      lineNumber: 8
    },
    {
      original,
      cleaned,
      left: 5,
      right: 16,
      leftChar: 'p',
      rightChar: 'p',
      match: true,
      variables: { left: 5, right: 16, leftChar: 'p', rightChar: 'p', match: true },
      message: "Middle section: left='p' and right='p'. Match!",
      lineNumber: 8
    },
    {
      original,
      cleaned,
      left: 10,
      right: 11,
      leftChar: 'a',
      rightChar: 'c',
      match: true,
      variables: { left: 10, right: 11, leftChar: 'a', rightChar: 'c' },
      message: "Pointers meet in middle. All chars matched!",
      lineNumber: 13
    },
    {
      original,
      cleaned,
      left: 10,
      right: 11,
      leftChar: '',
      rightChar: '',
      match: true,
      variables: { result: true },
      message: "Valid palindrome! Time: O(n), Space: O(1)",
      lineNumber: 14,
      isValid: true
    }
  ];

  const code = `function isPalindrome(s: string): boolean {
  // Clean string: remove non-alphanumeric, lowercase
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
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
            <h3 className="text-lg font-semibold mb-4">Valid Palindrome</h3>

            <div className="space-y-4">
              {/* Original */}
              <div>
                <div className="text-sm font-semibold mb-2">Original:</div>
                <div className="p-3 bg-muted rounded text-sm">
                  "{currentStep.original}"
                </div>
              </div>

              {/* Cleaned */}
              <div>
                <div className="text-sm font-semibold mb-2">Cleaned (alphanumeric, lowercase):</div>
                <div className="flex flex-wrap gap-1">
                  {currentStep.cleaned.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm font-bold ${
                        idx === currentStep.left || idx === currentStep.right
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                          : (currentStep.left !== -1 && idx > currentStep.left && idx < currentStep.right)
                          ? 'bg-secondary/30'
                          : 'bg-muted'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                {currentStep.left !== -1 && (
                  <div className="flex gap-4 text-xs mt-2">
                    <div className="text-blue-600">Left: {currentStep.left}</div>
                    <div className="text-green-600">Right: {currentStep.right}</div>
                  </div>
                )}
              </div>

              {/* Comparison */}
              {currentStep.leftChar && currentStep.rightChar && (
                <div className="p-4 bg-primary/20 rounded border border-primary/30">
                  <div className="text-sm font-semibold mb-2">Comparing:</div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-2xl font-bold font-mono text-blue-600">
                      '{currentStep.leftChar}'
                    </div>
                    <div className={`text-2xl ${currentStep.match ? 'text-green-600' : 'text-red-600'}`}>
                      {currentStep.match ? '=' : '≠'}
                    </div>
                    <div className="text-2xl font-bold font-mono text-green-600">
                      '{currentStep.rightChar}'
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {currentStep.isValid !== undefined && (
                <div className={`p-4 rounded ${
                  currentStep.isValid ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                }`}>
                  <div className="text-sm font-semibold mb-1">Result:</div>
                  <div className="text-xl font-bold">
                    {currentStep.isValid ? '✓ Valid Palindrome' : '✗ Not a Palindrome'}
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
