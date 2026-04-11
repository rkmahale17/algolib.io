import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { StepControls } from '../shared/StepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VariablePanel } from '../shared/VariablePanel';
import { Button } from '@/components/ui/button';
import { Layers, ListFilter } from 'lucide-react';

interface Step {
  strs: string[];
  currentStr?: string;
  currentIndex?: number;
  count?: number[];
  key?: string;
  map: Record<string, string[]>;
  result?: string[][];
  message: string;
  highlightedLines: number[];
}

export const GroupAnagramsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const cases = [
    { name: "Default Case", strs: ["eat", "tea", "tan", "ate", "nat", "bat"], icon: <Layers className="w-4 h-4" /> },
    { name: "Empty Strings", strs: ["", "", ""], icon: <ListFilter className="w-4 h-4" /> }
  ];
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const code = `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const s of strs) {
    const count = new Array(26).fill(0);

    for (const c of s) {
      const index = c.charCodeAt(0) - 'a'.charCodeAt(0);
      count[index]++;
    }

    let key = "";
    for (const num of count) {
      key += num + "#";
    }

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }

  return Array.from(map.values());
}`;

  const generateSteps = (strs: string[]) => {
    const steps: Step[] = [];
    const map: Record<string, string[]> = {};

    steps.push({
      strs,
      map: { ...map },
      message: "Initialize an empty Map to store anagram groups.",
      highlightedLines: [2]
    });

    for (let i = 0; i < strs.length; i++) {
      const s = strs[i];
      const count = new Array(26).fill(0);

      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        map: { ...map },
        message: `Process string: '${s}' at index ${i}.`,
        highlightedLines: [4]
      });

      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        count: [...count],
        map: { ...map },
        message: "Initialize frequency array with 26 zeros.",
        highlightedLines: [5]
      });

      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        count: [...count],
        map: { ...map },
        message: `Iterate through characters in '${s}'.`,
        highlightedLines: [7]
      });

      for (const c of s) {
        const charIdx = c.charCodeAt(0) - 'a'.charCodeAt(0);
        count[charIdx]++;
        steps.push({
          strs,
          currentStr: s,
          currentIndex: i,
          count: [...count],
          map: { ...map },
          message: `Update count for '${c}' at index ${charIdx}.`,
          highlightedLines: [8, 9]
        });
      }

      let key = "";
      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        count: [...count],
        key: "",
        map: { ...map },
        message: "Initialize an empty key string.",
        highlightedLines: [12]
      });

      for (const num of count) {
        key += num + "#";
      }

      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        count: [...count],
        key,
        map: { ...map },
        message: `Constructed key signature: '${key.substring(0, 15)}...'`,
        highlightedLines: [13, 14, 15]
      });

      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        key,
        map: { ...map },
        message: `Check if map contains key: '${key.substring(0, 10)}...'`,
        highlightedLines: [17]
      });

      if (!map[key]) {
        map[key] = [];
        steps.push({
          strs,
          currentStr: s,
          currentIndex: i,
          key,
          map: JSON.parse(JSON.stringify(map)),
          message: "Key not found. Create a new entry.",
          highlightedLines: [18]
        });
      }

      map[key].push(s);
      steps.push({
        strs,
        currentStr: s,
        currentIndex: i,
        key,
        map: JSON.parse(JSON.stringify(map)),
        message: `Add '${s}' to the group.`,
        highlightedLines: [20]
      });
    }

    steps.push({
      strs,
      map: JSON.parse(JSON.stringify(map)),
      result: Object.values(map),
      message: "Return all anagram groups as an array of arrays.",
      highlightedLines: [23]
    });

    return steps;
  };

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    setSteps(generateSteps(cases[selectedCaseIndex].strs));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedCaseIndex]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleCaseChange = (index: number) => {
    if (index === selectedCaseIndex) return;
    setSelectedCaseIndex(index);
  };

  if (steps.length === 0) return null;
  const step = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length - 1}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
          onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
          onReset={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
          speed={speed}
          onSpeedChange={setSpeed}
        />

        <div className="flex p-1 bg-muted rounded-xl border border-border w-fit backdrop-blur-sm shadow-inner">
          {cases.map((testCase, idx) => (
            <button
              key={idx}
              onClick={() => handleCaseChange(idx)}
              className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCaseIndex === idx 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {selectedCaseIndex === idx && (
                <motion.div
                  layoutId="activeCaseGroup"
                  className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {testCase.icon}
                {testCase.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6 border shadow-sm space-y-8">
            {/* Input Array */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Input Strings</h3>
              <div className="flex flex-wrap gap-2">
                {step.strs.map((s, idx) => (
                  <motion.div
                    key={idx}
                    className={`px-3 py-1.5 rounded-md font-mono text-sm border-2 transition-colors duration-200 ${
                      step.currentIndex === idx
                        ? 'bg-primary/20 border-primary text-primary font-bold'
                        : 'bg-muted/50 border-transparent text-muted-foreground'
                    }`}
                    animate={step.currentIndex === idx ? { scale: 1.05 } : { scale: 1 }}
                  >
                    "{s}"
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Count Array */}
            <AnimatePresence mode="wait">
              {step.count && (
                <motion.div
                  key="count-viz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    Frequency Count for "{step.currentStr}"
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {step.count.map((count, idx) => {
                      const char = String.fromCharCode(97 + idx);
                      if (count === 0 && !['a', 'e', 't', 'n', 'b'].includes(char)) return null;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center p-1.5 min-w-[36px] rounded-lg border-2 transition-all duration-200 ${
                            count > 0 ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-transparent'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">{char}</span>
                          <span className={`text-sm font-black ${count > 0 ? 'text-primary' : 'text-muted-foreground/50'}`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map Visualization */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Anagram Map</h3>
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {Object.keys(step.map).length === 0 ? (
                    <p className="text-sm text-muted-foreground italic pl-2">Initializing map...</p>
                  ) : (
                    Object.entries(step.map).map(([key, group], idx) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors"
                      >
                        <div className="text-[10px] font-mono font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border shadow-sm shrink-0 truncate max-w-[120px]">
                          {key.substring(0, 8)}...
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.map((s, sIdx) => (
                            <span key={sIdx} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-lg font-bold border border-primary/20">
                              "{s}"
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Final Result */}
            {step.result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-primary/5 border-2 border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
              >
                <h3 className="text-sm font-black mb-4 text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Final Result
                </h3>
                <div className="space-y-3">
                  {step.result.map((group, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground/50 w-4">#{idx + 1}</span>
                      <div className="flex flex-wrap gap-2 p-2 bg-background/50 rounded-lg border border-border/50 w-full text-sm font-mono font-bold">
                        [{group.map(s => `"${s}"`).join(', ')}]
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>

          {/* Commentary Above VariablePanel */}
          <div className="p-5 bg-accent/30 rounded-2xl border border-accent/20 shadow-sm min-h-[70px] flex items-center">
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              {step.message}
            </p>
          </div>

          <VariablePanel
            variables={{
              "Current String": step.currentStr || "None",
              "Index": step.currentIndex ?? "N/A",
              "Map Groups": Object.keys(step.map).length,
              "Status": step.result ? "Complete ✓" : "Processing..."
            }}
          />
        </div>

        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      </div>
    </div>
  );
};
