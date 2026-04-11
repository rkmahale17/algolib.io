import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Step {
  s: string;
  t: string;
  sCount: Record<string, number>;
  tCount: Record<string, number>;
  i: number;
  highlightChar?: string;
  compareChar?: string;
  message: string;
  lineNumber: number;
  isAnagram?: boolean;
}

export const ValidAnagramVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const cases = [
    { name: "Valid Anagram", s: "anagram", t: "nagaram", icon: <CheckCircle2 className="w-4 h-4" /> },
    { name: "Not an Anagram", s: "rat", t: "car", icon: <XCircle className="w-4 h-4" /> }
  ];
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const code = `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }

  const sCount: Record<string, number> = {};
  const tCount: Record<string, number> = {};

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];
    sCount[charS] = (sCount[charS] || 0) + 1;
    tCount[charT] = (tCount[charT] || 0) + 1;
  }

  for (const char in sCount) {
    if (sCount[char] !== tCount[char]) {
      return false;
    }
  }

  return true;
}`;

  const generateSteps = (s: string, t: string) => {
    const allSteps: Step[] = [];
    const sCount: Record<string, number> = {};
    const tCount: Record<string, number> = {};

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: `Case: s = "${s}", t = "${t}".`,
      lineNumber: 1
    });

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: `Check if lengths match: s.length (${s.length}) vs t.length (${t.length}).`,
      lineNumber: 2
    });

    if (s.length !== t.length) {
      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
        message: `Lengths are unequal! They cannot be anagrams.`,
        lineNumber: 3,
        isAnagram: false
      });
      return allSteps;
    }

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: "Initialize frequency map sCount.",
      lineNumber: 6
    });

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: "Initialize frequency map tCount.",
      lineNumber: 7
    });

    for (let i = 0; i < s.length; i++) {
      const charS = s[i];
      const charT = t[i];

      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i,
        message: `Iteration i = ${i}: Processing characters.`,
        lineNumber: 9
      });

      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i,
        highlightChar: charS,
        message: `Extract s[${i}] = '${charS}'.`,
        lineNumber: 10
      });

      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i,
        highlightChar: charT,
        message: `Extract t[${i}] = '${charT}'.`,
        lineNumber: 11
      });

      sCount[charS] = (sCount[charS] || 0) + 1;
      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i,
        highlightChar: charS,
        message: `Update sCount: Increment count for '${charS}'.`,
        lineNumber: 12
      });

      tCount[charT] = (tCount[charT] || 0) + 1;
      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i,
        highlightChar: charT,
        message: `Update tCount: Increment count for '${charT}'.`,
        lineNumber: 13
      });
    }

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: "Counting finished. Now compare frequencies.",
      lineNumber: 16
    });

    const chars = Object.keys(sCount);
    for (const char of chars) {
      allSteps.push({
        s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
        compareChar: char,
        message: `Compare count for '${char}': sCount (${sCount[char]}) vs tCount (${tCount[char] || 0}).`,
        lineNumber: 17
      });

      if (sCount[char] !== tCount[char]) {
        allSteps.push({
          s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
          compareChar: char,
          message: `Mismatch found for '${char}'! Return false.`,
          lineNumber: 18,
          isAnagram: false
        });
        return allSteps;
      }
    }

    allSteps.push({
      s, t, sCount: { ...sCount }, tCount: { ...tCount }, i: -1,
      message: "All counts match! Return true.",
      lineNumber: 22,
      isAnagram: true
    });

    return allSteps;
  };

  useEffect(() => {
    const selectedCase = cases[selectedCaseIndex];
    setSteps(generateSteps(selectedCase.s, selectedCase.t));
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
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[currentStepIndex] || {
    s: "", t: "", sCount: {}, tCount: {}, i: -1, message: "Initializing...", lineNumber: 1
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepControls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
          onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
          onReset={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
          isPlaying={isPlaying}
          currentStep={currentStepIndex}
          totalSteps={steps.length - 1}
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
                  layoutId="activeCaseAnagram"
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
        <div className="bg-card rounded-lg p-6 border space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">String s</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border-2 text-lg font-mono transition-colors duration-200 ${
                      currentStep.i === idx || currentStep.compareChar === char
                        ? 'bg-blue-500/20 border-blue-500 text-blue-500 font-bold'
                        : 'bg-muted/50 border-transparent text-muted-foreground'
                    }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">String t</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep.t.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border-2 text-lg font-mono transition-colors duration-200 ${
                      currentStep.i === idx || currentStep.compareChar === char
                        ? 'bg-purple-500/20 border-purple-500 text-purple-500 font-bold'
                        : 'bg-muted/50 border-transparent text-muted-foreground'
                    }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-500/5 border-blue-500/10">
              <h4 className="text-xs font-bold tracking-wider text-blue-500 mb-3">sCount</h4>
              <div className="space-y-2 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                  {Object.keys(currentStep.sCount).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Empty</p>
                  ) : (
                    Object.entries(currentStep.sCount).map(([char, count]) => (
                      <motion.div
                        key={char}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex justify-between items-center px-3 py-1.5 rounded text-sm font-mono ${
                          currentStep.compareChar === char ? 'bg-blue-500/20 ring-1 ring-blue-500' : 'bg-background'
                        }`}
                      >
                        <span className="font-bold">'{char}'</span>
                        <span className="text-blue-500 font-bold">{count}</span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <Card className="p-4 bg-purple-500/5 border-purple-500/10">
              <h4 className="text-xs font-bold tracking-wider text-purple-500 mb-3">tCount</h4>
              <div className="space-y-2 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                  {Object.keys(currentStep.tCount).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Empty</p>
                  ) : (
                    Object.entries(currentStep.tCount).map(([char, count]) => (
                      <motion.div
                        key={char}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex justify-between items-center px-3 py-1.5 rounded text-sm font-mono ${
                          currentStep.compareChar === char ? 'bg-purple-500/20 ring-1 ring-purple-500' : 'bg-background'
                        }`}
                      >
                        <span className="font-bold">'{char}'</span>
                        <span className="text-purple-500 font-bold">{count}</span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>


          <div className="p-4 bg-accent/30 rounded-lg border border-accent/20 min-h-[60px] flex items-center">
            <p className="text-sm font-medium leading-relaxed text-foreground">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              "Current Index i": currentStep.i === -1 ? "N/A" : currentStep.i,
              "Processing Char": currentStep.highlightChar || currentStep.compareChar || "None",
              "Status": currentStep.isAnagram === undefined ? "Processing..." : (currentStep.isAnagram ? "Anagram ✓" : "Not Anagram ✗")
            }}
          />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
