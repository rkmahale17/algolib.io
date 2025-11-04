import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  words: string[];
  currentIdx: number;
  currentWord: string;
  sorted: string;
  groups: Record<string, string[]>;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const GroupAnagramsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
  
  const steps: Step[] = [
    {
      words,
      currentIdx: -1,
      currentWord: '',
      sorted: '',
      groups: {},
      variables: { strs: '["eat","tea","tan","ate","nat","bat"]' },
      message: "Start: Group anagrams using sorted string as key",
      lineNumber: 1
    },
    {
      words,
      currentIdx: 0,
      currentWord: 'eat',
      sorted: 'aet',
      groups: { 'aet': ['eat'] },
      variables: { word: 'eat', sorted: 'aet', group: 'aet' },
      message: "'eat' sorted → 'aet'. Add to group 'aet'",
      lineNumber: 6
    },
    {
      words,
      currentIdx: 1,
      currentWord: 'tea',
      sorted: 'aet',
      groups: { 'aet': ['eat', 'tea'] },
      variables: { word: 'tea', sorted: 'aet', group: 'aet' },
      message: "'tea' sorted → 'aet'. Same group as 'eat'!",
      lineNumber: 6
    },
    {
      words,
      currentIdx: 2,
      currentWord: 'tan',
      sorted: 'ant',
      groups: { 'aet': ['eat', 'tea'], 'ant': ['tan'] },
      variables: { word: 'tan', sorted: 'ant', group: 'ant' },
      message: "'tan' sorted → 'ant'. New group 'ant'",
      lineNumber: 6
    },
    {
      words,
      currentIdx: 3,
      currentWord: 'ate',
      sorted: 'aet',
      groups: { 'aet': ['eat', 'tea', 'ate'], 'ant': ['tan'] },
      variables: { word: 'ate', sorted: 'aet', group: 'aet' },
      message: "'ate' sorted → 'aet'. Joins 'eat' and 'tea'",
      lineNumber: 6
    },
    {
      words,
      currentIdx: 4,
      currentWord: 'nat',
      sorted: 'ant',
      groups: { 'aet': ['eat', 'tea', 'ate'], 'ant': ['tan', 'nat'] },
      variables: { word: 'nat', sorted: 'ant', group: 'ant' },
      message: "'nat' sorted → 'ant'. Joins 'tan'",
      lineNumber: 6
    },
    {
      words,
      currentIdx: 5,
      currentWord: 'bat',
      sorted: 'abt',
      groups: { 'aet': ['eat', 'tea', 'ate'], 'ant': ['tan', 'nat'], 'abt': ['bat'] },
      variables: { word: 'bat', sorted: 'abt', group: 'abt', totalGroups: 3 },
      message: "'bat' sorted → 'abt'. New group. Done! Time: O(n*k*log k), Space: O(n*k)",
      lineNumber: 9
    }
  ];

  const code = `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  
  for (const word of strs) {
    // Sort the word to use as key
    const sorted = word.split('').sort().join('');
    
    // Group by sorted key
    if (!map.has(sorted)) {
      map.set(sorted, []);
    }
    map.get(sorted)!.push(word);
  }
  
  return Array.from(map.values());
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
            <h3 className="text-lg font-semibold mb-4">Group Anagrams</h3>

            <div className="space-y-4">
              {/* Input Words */}
              <div>
                <div className="text-sm font-semibold mb-2">Input Words:</div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.words.map((word, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 rounded font-mono text-sm font-bold ${
                        idx === currentStep.currentIdx
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                          : idx < currentStep.currentIdx
                          ? 'bg-secondary/50'
                          : 'bg-muted'
                      }`}
                    >
                      "{word}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Processing */}
              {currentStep.currentWord && (
                <div className="p-4 bg-primary/20 rounded border border-primary/30">
                  <div className="text-sm font-semibold mb-2">Processing:</div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold font-mono">"{currentStep.currentWord}"</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-lg font-bold font-mono text-primary">"{currentStep.sorted}"</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    (sorted)
                  </div>
                </div>
              )}

              {/* Groups */}
              <div>
                <div className="text-sm font-semibold mb-2">Anagram Groups:</div>
                <div className="space-y-3">
                  {Object.entries(currentStep.groups).map(([key, words]) => (
                    <div key={key} className="p-3 bg-accent/20 rounded border border-accent/30">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Key: "{key}"
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {words.map((word, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 rounded bg-accent text-accent-foreground font-mono text-sm"
                          >
                            "{word}"
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(currentStep.groups).length === 0 && (
                    <div className="text-sm text-muted-foreground italic">No groups yet</div>
                  )}
                </div>
              </div>

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
