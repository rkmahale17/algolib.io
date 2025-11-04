import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  s: string;
  t: string;
  left: number;
  right: number;
  windowMap: Record<string, number>;
  tMap: Record<string, number>;
  formed: number;
  required: number;
  minWindow: string;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const MinimumWindowSubstringVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "ADOBECODEBANC";
  const t = "ABC";
  
  const steps: Step[] = [
    {
      s, t,
      left: 0,
      right: 0,
      windowMap: {},
      tMap: { A: 1, B: 1, C: 1 },
      formed: 0,
      required: 3,
      minWindow: "",
      variables: { s: 'ADOBECODEBANC', t: 'ABC', required: 3 },
      message: "Start: Use sliding window to find minimum substring containing all chars of t",
      lineNumber: 1
    },
    {
      s, t,
      left: 0,
      right: 0,
      windowMap: { A: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 1,
      required: 3,
      minWindow: "",
      variables: { right: 0, char: 'A', windowMap: '{A:1}', formed: 1 },
      message: "Add 'A' at right=0. Found 1/3 required chars",
      lineNumber: 10
    },
    {
      s, t,
      left: 0,
      right: 4,
      windowMap: { A: 1, D: 1, O: 1, B: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 2,
      required: 3,
      minWindow: "",
      variables: { right: 4, char: 'B', formed: 2 },
      message: "Expand to right=4. Found 'B'. formed=2/3",
      lineNumber: 10
    },
    {
      s, t,
      left: 0,
      right: 5,
      windowMap: { A: 1, D: 1, O: 1, B: 1, E: 1, C: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 3,
      required: 3,
      minWindow: "ADOBEC",
      variables: { right: 5, char: 'C', formed: 3, window: 'ADOBEC' },
      message: "Found 'C'! All chars found (3/3). Window: 'ADOBEC' (length 6)",
      lineNumber: 16
    },
    {
      s, t,
      left: 1,
      right: 5,
      windowMap: { D: 1, O: 1, B: 1, E: 1, C: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 2,
      required: 3,
      minWindow: "ADOBEC",
      variables: { left: 1, removed: 'A', formed: 2 },
      message: "Shrink: Remove 'A' from left. formed drops to 2/3",
      lineNumber: 20
    },
    {
      s, t,
      left: 1,
      right: 9,
      windowMap: { D: 2, O: 1, B: 1, E: 2, C: 1, A: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 3,
      required: 3,
      minWindow: "ADOBEC",
      variables: { right: 9, char: 'A', formed: 3 },
      message: "Expand to right=9. Found 'A' again. formed=3/3",
      lineNumber: 10
    },
    {
      s, t,
      left: 5,
      right: 9,
      windowMap: { C: 1, O: 1, D: 1, E: 1, A: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 2,
      required: 3,
      minWindow: "ADOBEC",
      variables: { left: 5, removed: 'D,O,B,E', formed: 2 },
      message: "Shrink left to 5. Lost 'B', formed=2/3",
      lineNumber: 20
    },
    {
      s, t,
      left: 5,
      right: 12,
      windowMap: { C: 2, O: 1, D: 1, E: 1, A: 1, B: 1, N: 1 },
      tMap: { A: 1, B: 1, C: 1 },
      formed: 3,
      required: 3,
      minWindow: "BANC",
      variables: { right: 12, window: 'CODEBANC', newMin: 'BANC', length: 4 },
      message: "Found smaller window: 'BANC' (length 4). Optimal! Time: O(n), Space: O(t)",
      lineNumber: 17
    }
  ];

  const code = `function minWindow(s: string, t: string): string {
  if (s.length < t.length) return "";
  
  // Count chars in t
  const tMap = new Map<string, number>();
  for (const char of t) {
    tMap.set(char, (tMap.get(char) || 0) + 1);
  }
  
  const required = tMap.size;
  let left = 0, right = 0;
  let formed = 0;
  const windowMap = new Map<string, number>();
  let minLen = Infinity;
  let result = "";
  
  while (right < s.length) {
    // Expand window
    const char = s[right];
    windowMap.set(char, (windowMap.get(char) || 0) + 1);
    
    if (tMap.has(char) && windowMap.get(char) === tMap.get(char)) {
      formed++;
    }
    
    // Contract window
    while (formed === required && left <= right) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        result = s.substring(left, right + 1);
      }
      
      const leftChar = s[left];
      windowMap.set(leftChar, windowMap.get(leftChar)! - 1);
      if (tMap.has(leftChar) && windowMap.get(leftChar)! < tMap.get(leftChar)!) {
        formed--;
      }
      left++;
    }
    
    right++;
  }
  
  return result;
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
            <h3 className="text-lg font-semibold mb-4">Minimum Window Substring</h3>

            <div className="space-y-4">
              {/* Target */}
              <div>
                <div className="text-sm font-semibold mb-2">Target (t): "{currentStep.t}"</div>
                <div className="text-xs text-muted-foreground">
                  Required unique chars: {currentStep.required}
                </div>
              </div>

              {/* String with Window */}
              <div>
                <div className="text-sm font-semibold mb-2">String (s):</div>
                <div className="flex flex-wrap gap-1">
                  {currentStep.s.split('').map((char, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm font-bold ${
                        idx >= currentStep.left && idx <= currentStep.right
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

              {/* Progress */}
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-sm font-semibold mb-1">Progress:</div>
                <div className="text-lg font-bold text-primary">
                  {currentStep.formed} / {currentStep.required} chars found
                </div>
              </div>

              {/* Current Minimum */}
              {currentStep.minWindow && (
                <div className="p-3 bg-green-500/20 rounded border border-green-500/30">
                  <div className="text-sm font-semibold mb-1">Current Minimum Window:</div>
                  <div className="text-lg font-bold text-green-600">
                    "{currentStep.minWindow}" (length: {currentStep.minWindow.length})
                  </div>
                </div>
              )}

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
