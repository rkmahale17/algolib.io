import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  s: string;
  k: number;
  left: number;
  right: number;
  charCount: Record<string, number>;
  maxCount: number;
  maxLen: number;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const LongestRepeatingCharacterReplacementVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "AABABBA";
  const k = 1;
  
  const steps: Step[] = [
    {
      s, k,
      left: 0,
      right: -1,
      charCount: {},
      maxCount: 0,
      maxLen: 0,
      variables: { s: 'AABABBA', k: 1 },
      message: "Start: Find longest substring with at most k replacements. Use sliding window",
      lineNumber: 1
    },
    {
      s, k,
      left: 0,
      right: 0,
      charCount: { A: 1 },
      maxCount: 1,
      maxLen: 1,
      variables: { right: 0, char: 'A', maxCount: 1, windowSize: 1, replacements: 0 },
      message: "Add 'A'. Window: 'A' (size 1). Need 0 replacements. Valid!",
      lineNumber: 8
    },
    {
      s, k,
      left: 0,
      right: 1,
      charCount: { A: 2 },
      maxCount: 2,
      maxLen: 2,
      variables: { right: 1, char: 'A', maxCount: 2, windowSize: 2, replacements: 0 },
      message: "Add 'A'. Window: 'AA' (size 2). Need 0 replacements. Valid!",
      lineNumber: 8
    },
    {
      s, k,
      left: 0,
      right: 2,
      charCount: { A: 2, B: 1 },
      maxCount: 2,
      maxLen: 3,
      variables: { right: 2, char: 'B', maxCount: 2, windowSize: 3, replacements: 1 },
      message: "Add 'B'. Window: 'AAB' (size 3). Need 1 replacement (B→A). Valid!",
      lineNumber: 8
    },
    {
      s, k,
      left: 0,
      right: 3,
      charCount: { A: 3, B: 1 },
      maxCount: 3,
      maxLen: 4,
      variables: { right: 3, char: 'A', maxCount: 3, windowSize: 4, replacements: 1 },
      message: "Add 'A'. Window: 'AABA' (size 4). Need 1 replacement. Valid!",
      lineNumber: 8
    },
    {
      s, k,
      left: 0,
      right: 4,
      charCount: { A: 3, B: 2 },
      maxCount: 3,
      maxLen: 4,
      variables: { right: 4, char: 'B', windowSize: 5, replacements: 2, valid: false },
      message: "Add 'B'. Window size 5, max char count 3. Need 2 replacements > k=1. Invalid!",
      lineNumber: 13
    },
    {
      s, k,
      left: 1,
      right: 4,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLen: 4,
      variables: { left: 1, windowSize: 4, replacements: 2, valid: false },
      message: "Shrink window. Remove left char 'A'. Still need 2 replacements. Shrink more",
      lineNumber: 15
    },
    {
      s, k,
      left: 2,
      right: 4,
      charCount: { A: 1, B: 2 },
      maxCount: 2,
      maxLen: 4,
      variables: { left: 2, windowSize: 3, replacements: 1, valid: true },
      message: "Remove 'A'. Window: 'ABB' (size 3). Need 1 replacement. Valid!",
      lineNumber: 15
    },
    {
      s, k,
      left: 2,
      right: 6,
      charCount: { A: 2, B: 3 },
      maxCount: 3,
      maxLen: 4,
      variables: { right: 6, windowSize: 5, replacements: 2, valid: false },
      message: "Expand to end. Window size 5, need 2 replacements. Over k limit",
      lineNumber: 8
    },
    {
      s, k,
      left: 3,
      right: 6,
      charCount: { A: 2, B: 2 },
      maxCount: 3,
      maxLen: 4,
      variables: { maxLen: 4, result: 'AABA' },
      message: "Complete! Longest valid substring: 4 chars ('AABA'). Time: O(n), Space: O(1)",
      lineNumber: 19
    }
  ];

  const code = `function characterReplacement(s: string, k: number): number {
  let left = 0;
  let maxCount = 0;
  let maxLen = 0;
  const charCount: Record<string, number> = {};
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
    
    // If window invalid (need > k replacements), shrink
    while (right - left + 1 - maxCount > k) {
      const leftChar = s[left];
      charCount[leftChar]--;
      left++;
    }
    
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
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
            <h3 className="text-lg font-semibold mb-4">Longest Repeating Character Replacement</h3>

            <div className="space-y-4">
              {/* Parameters */}
              <div className="flex gap-4 text-sm">
                <div className="p-2 bg-muted rounded">
                  <span className="font-semibold">k:</span> {currentStep.k} replacements allowed
                </div>
              </div>

              {/* String with Window */}
              <div>
                <div className="text-sm font-semibold mb-2">String:</div>
                <div className="flex gap-1">
                  {currentStep.s.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-12 flex items-center justify-center rounded font-mono text-lg font-bold ${
                        idx >= currentStep.left && idx <= currentStep.right && currentStep.left !== -1
                          ? 'bg-primary/30 border-2 border-primary'
                          : 'bg-muted'
                      } ${
                        idx === currentStep.left ? 'border-l-4 border-l-blue-500' : ''
                      } ${
                        idx === currentStep.right ? 'border-r-4 border-r-green-500' : ''
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-l-4 border-l-blue-500"></div>
                    <span>Left: {currentStep.left}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-r-4 border-r-green-500"></div>
                    <span>Right: {currentStep.right}</span>
                  </div>
                </div>
              </div>

              {/* Character Count */}
              {Object.keys(currentStep.charCount).length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Window Character Count:</div>
                  <div className="flex gap-2">
                    {Object.entries(currentStep.charCount).map(([char, count]) => (
                      <div key={char} className="p-2 bg-accent rounded">
                        <span className="font-mono font-bold">{char}</span>: {count}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-primary/20 rounded">
                  <div className="text-xs font-semibold mb-1">Max Char Count</div>
                  <div className="text-2xl font-bold text-primary">{currentStep.maxCount}</div>
                </div>
                <div className="p-3 bg-green-500/20 rounded">
                  <div className="text-xs font-semibold mb-1">Max Length</div>
                  <div className="text-2xl font-bold text-green-600">{currentStep.maxLen}</div>
                </div>
              </div>

              {/* Variables */}
              <div>
                <div className="text-sm font-semibold mb-2">Variables:</div>
                <div className="p-3 bg-muted/50 rounded text-xs font-mono space-y-1 max-h-32 overflow-auto">
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
