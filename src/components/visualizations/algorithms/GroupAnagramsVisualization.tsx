import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import type { editor as MonacoEditor } from 'monaco-editor';

interface Step {
  strs: string[];
  currentWord?: string;
  currentIndex?: number;
  sortedKey?: string;
  map: Record<string, string[]>;
  result: string[][];
  message: string;
  highlightedLines: number[];
}

export const GroupAnagramsVisualization = () => {
  const code = `function groupAnagrams(strs: string[]): string[][] {
  const map: Record<string, string[]> = {};
  
  for (const str of strs) {
    const sortedStr = str.split('').sort().join('');
    
    if (!map[sortedStr]) {
      map[sortedStr] = [];
    }
    
    map[sortedStr].push(str);
  }
  
  return Object.values(map);
}`;

  const steps: Step[] = [
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      map: {},
      result: [],
      message: "Initialize: Create empty hashmap to group anagrams by sorted key",
      highlightedLines: [2]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "eat",
      currentIndex: 0,
      map: {},
      result: [],
      message: "Process str[0]='eat': Split into ['e','a','t']",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "eat",
      currentIndex: 0,
      sortedKey: "aet",
      map: {},
      result: [],
      message: "Sort ['e','a','t'] → ['a','e','t'] → key='aet'",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "eat",
      currentIndex: 0,
      sortedKey: "aet",
      map: { aet: [] },
      result: [],
      message: "Key 'aet' not in map, create new array: map['aet']=[]",
      highlightedLines: [7]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "eat",
      currentIndex: 0,
      sortedKey: "aet",
      map: { aet: ["eat"] },
      result: [],
      message: "Add 'eat' to map['aet'] → map['aet']=['eat']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "tea",
      currentIndex: 1,
      map: { aet: ["eat"] },
      result: [],
      message: "Process str[1]='tea': Sort → 'aet' (same key as 'eat'!)",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "tea",
      currentIndex: 1,
      sortedKey: "aet",
      map: { aet: ["eat", "tea"] },
      result: [],
      message: "Key 'aet' exists, add 'tea' → map['aet']=['eat','tea']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "tan",
      currentIndex: 2,
      map: { aet: ["eat", "tea"] },
      result: [],
      message: "Process str[2]='tan': Sort → 'ant'",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "tan",
      currentIndex: 2,
      sortedKey: "ant",
      map: { aet: ["eat", "tea"], ant: [] },
      result: [],
      message: "New key 'ant', create map['ant']=[]",
      highlightedLines: [7]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "tan",
      currentIndex: 2,
      sortedKey: "ant",
      map: { aet: ["eat", "tea"], ant: ["tan"] },
      result: [],
      message: "Add 'tan' → map['ant']=['tan']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "ate",
      currentIndex: 3,
      sortedKey: "aet",
      map: { aet: ["eat", "tea"], ant: ["tan"] },
      result: [],
      message: "Process str[3]='ate': Sort → 'aet' (matches 'eat','tea')",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "ate",
      currentIndex: 3,
      sortedKey: "aet",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan"] },
      result: [],
      message: "Add 'ate' → map['aet']=['eat','tea','ate']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "nat",
      currentIndex: 4,
      sortedKey: "ant",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan"] },
      result: [],
      message: "Process str[4]='nat': Sort → 'ant' (matches 'tan')",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "nat",
      currentIndex: 4,
      sortedKey: "ant",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan", "nat"] },
      result: [],
      message: "Add 'nat' → map['ant']=['tan','nat']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "bat",
      currentIndex: 5,
      sortedKey: "abt",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan", "nat"] },
      result: [],
      message: "Process str[5]='bat': Sort → 'abt' (new key)",
      highlightedLines: [5]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "bat",
      currentIndex: 5,
      sortedKey: "abt",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan", "nat"], abt: [] },
      result: [],
      message: "Create map['abt']=[]",
      highlightedLines: [7]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      currentWord: "bat",
      currentIndex: 5,
      sortedKey: "abt",
      map: { aet: ["eat", "tea", "ate"], ant: ["tan", "nat"], abt: ["bat"] },
      result: [],
      message: "Add 'bat' → map['abt']=['bat']",
      highlightedLines: [11]
    },
    {
      strs: ["eat", "tea", "tan", "ate", "nat", "bat"],
      map: { aet: ["eat", "tea", "ate"], ant: ["tan", "nat"], abt: ["bat"] },
      result: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
      message: "Return Object.values(map) → [['eat','tea','ate'], ['tan','nat'], ['bat']]",
      highlightedLines: [14]
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = currentStep.highlightedLines.map(line => ({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
        }
      }));
      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentStepIndex, currentStep.highlightedLines]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Input Array</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStep.strs.map((word, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`px-4 py-2 rounded font-mono font-bold border-2 ${
                    idx === currentStep.currentIndex
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted/50 border-border text-foreground'
                  }`}
                >
                  "{word}"
                </motion.div>
              ))}
            </div>

            {currentStep.currentWord && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-3 bg-primary/10 rounded mb-4"
              >
                <p className="text-sm">
                  <span className="font-semibold">Current:</span> "{currentStep.currentWord}"
                  {currentStep.sortedKey && (
                    <span className="ml-4">
                      <span className="font-semibold">Sorted Key:</span> "{currentStep.sortedKey}"
                    </span>
                  )}
                </p>
              </motion.div>
            )}

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3">Anagram Map (by sorted key)</h4>
              <div className="space-y-3">
                {Object.entries(currentStep.map).length > 0 ? (
                  Object.entries(currentStep.map).map(([key, words]) => (
                    <motion.div
                      key={key}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`p-3 rounded border ${
                        key === currentStep.sortedKey
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-primary shrink-0">"{key}":</span>
                        <div className="flex flex-wrap gap-2">
                          {words.map((word, idx) => (
                            <span key={idx} className="px-2 py-1 bg-background rounded font-mono text-sm">
                              "{word}"
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Empty map</p>
                )}
              </div>
            </div>

            {currentStep.result.length > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded"
              >
                <h4 className="text-sm font-semibold mb-3 text-green-600">Result</h4>
                <div className="space-y-2">
                  {currentStep.result.map((group, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground">[{idx}]</span>
                      <div className="flex flex-wrap gap-2">
                        {group.map((word, wIdx) => (
                          <span key={wIdx} className="px-3 py-1 bg-green-500/20 rounded font-mono text-sm">
                            "{word}"
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">{currentStep.message}</p>
            </Card>
          </Card>
        </div>

        <Card className="p-4 overflow-hidden">
          <div className="h-[700px]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
                const decorations = currentStep.highlightedLines.map(line => ({
                  range: new monaco.Range(line, 1, line, 1),
                  options: {
                    isWholeLine: true,
                    className: 'highlighted-line',
                  }
                }));
                editor.createDecorationsCollection(decorations);
              }}
            />
          </div>
        </Card>
      </div>

      <style>{`
        .highlighted-line {
          background: rgba(59, 130, 246, 0.15);
          border-left: 3px solid rgb(59, 130, 246);
        }
      `}</style>
    </div>
  );
};
