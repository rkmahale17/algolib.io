import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  strings?: string[];
  encoded?: string;
  currentIdx: number;
  buffer: string;
  result: string[];
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
  phase: 'encode' | 'decode' | 'complete';
}

export const EncodeDecodeStringsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const strings = ["hello", "world", "test"];
  
  const steps: Step[] = [
    {
      strings,
      currentIdx: -1,
      buffer: "",
      result: [],
      variables: { input: '["hello","world","test"]' },
      message: "Start: Encode array of strings. Use length prefix pattern: <length>#<string>",
      lineNumber: 1,
      phase: 'encode'
    },
    {
      strings,
      currentIdx: 0,
      buffer: "5#hello",
      result: [],
      variables: { i: 0, str: 'hello', length: 5, format: '5#hello' },
      message: "Encode 'hello': length=5, format as '5#hello'",
      lineNumber: 5,
      phase: 'encode'
    },
    {
      strings,
      currentIdx: 1,
      buffer: "5#hello5#world",
      result: [],
      variables: { i: 1, str: 'world', length: 5, encoded: '5#hello5#world' },
      message: "Encode 'world': append '5#world'",
      lineNumber: 5,
      phase: 'encode'
    },
    {
      strings,
      currentIdx: 2,
      buffer: "5#hello5#world4#test",
      result: [],
      variables: { i: 2, str: 'test', length: 4, encoded: '5#hello5#world4#test' },
      message: "Encode 'test': append '4#test'. Encoding complete!",
      lineNumber: 7,
      phase: 'encode'
    },
    {
      encoded: "5#hello5#world4#test",
      currentIdx: 0,
      buffer: "5#hello5#world4#test",
      result: [],
      variables: { encoded: '5#hello5#world4#test', i: 0 },
      message: "Decode: Start at position 0. Read length until '#'",
      lineNumber: 12,
      phase: 'decode'
    },
    {
      encoded: "5#hello5#world4#test",
      currentIdx: 2,
      buffer: "5#hello5#world4#test",
      result: ["hello"],
      variables: { length: 5, i: 2, str: 'hello' },
      message: "Found '#' at i=1. Length=5, extract 'hello' from i=2 to i=7",
      lineNumber: 17,
      phase: 'decode'
    },
    {
      encoded: "5#hello5#world4#test",
      currentIdx: 8,
      buffer: "5#hello5#world4#test",
      result: ["hello", "world"],
      variables: { length: 5, i: 8, str: 'world' },
      message: "Next: Length=5, extract 'world' from i=8 to i=13",
      lineNumber: 17,
      phase: 'decode'
    },
    {
      encoded: "5#hello5#world4#test",
      currentIdx: 14,
      buffer: "5#hello5#world4#test",
      result: ["hello", "world", "test"],
      variables: { length: 4, i: 14, str: 'test', decoded: '["hello","world","test"]' },
      message: "Final: Length=4, extract 'test'. Decoding complete! Time: O(n), Space: O(1)",
      lineNumber: 20,
      phase: 'complete'
    }
  ];

  const encodeCode = `function encode(strs: string[]): string {
  let result = "";
  for (const str of strs) {
    // Format: <length>#<string>
    result += str.length + "#" + str;
  }
  return result;
}`;

  const decodeCode = `function decode(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  
  while (i < s.length) {
    // Find the delimiter
    let j = i;
    while (s[j] !== '#') j++;
    
    // Extract length and string
    const length = parseInt(s.substring(i, j));
    const str = s.substring(j + 1, j + 1 + length);
    result.push(str);
    i = j + 1 + length;
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

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

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
            <h3 className="text-lg font-semibold mb-4">Encode & Decode Strings</h3>

            <div className="space-y-4">
              {/* Phase Indicator */}
              <div className="flex gap-2">
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  currentStep.phase === 'encode' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  Encode
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  currentStep.phase === 'decode' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  Decode
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  currentStep.phase === 'complete' ? 'bg-green-500/20 text-green-600' : 'bg-muted'
                }`}>
                  Complete
                </div>
              </div>

              {/* Input/Output */}
              {currentStep.strings && (
                <div>
                  <div className="text-sm font-semibold mb-2">Input Strings:</div>
                  <div className="flex gap-2 flex-wrap">
                    {currentStep.strings.map((str, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded font-mono text-sm ${
                          idx === currentStep.currentIdx
                            ? 'bg-primary text-primary-foreground'
                            : idx < currentStep.currentIdx
                            ? 'bg-secondary/50'
                            : 'bg-muted'
                        }`}
                      >
                        "{str}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Encoded String */}
              <div>
                <div className="text-sm font-semibold mb-2">Encoded String:</div>
                <div className="p-3 bg-muted rounded font-mono text-sm break-all">
                  {currentStep.buffer || '(empty)'}
                </div>
              </div>

              {/* Decoded Result */}
              {currentStep.result.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Decoded Strings:</div>
                  <div className="flex gap-2 flex-wrap">
                    {currentStep.result.map((str, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded bg-green-500/20 text-green-600 font-mono text-sm"
                      >
                        "{str}"
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
              {currentStep.phase === 'encode' ? encodeCode : decodeCode}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
