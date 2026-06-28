import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  s: string;
  t: string;
  sCount: Record<string, number>;
  tCount: Record<string, number>;
  i: number;
  highlightChar?: string;
  compareChar?: string;
  explanation: string;
  pseudoStep: string;
  isAnagram?: boolean;
}

const languages: VisualizationLanguageMap = {
  python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    s_count = {}
    t_count = {}
    for i in range(len(s)):
        s_count[s[i]] = s_count.get(s[i], 0) + 1
        t_count[t[i]] = t_count.get(t[i], 0) + 1
    for char in s_count:
        if s_count[char] != t_count.get(char, 0):
            return False
    return True`,

  typescript: `function isAnagram(s: string, t: string): boolean {
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
}`,

  java: `public class Solution {
    public boolean isAnagram(String s, String t) {
        s = s.replaceAll("\\\\s", "").toLowerCase();
        t = t.replaceAll("\\\\s", "").toLowerCase();
        if (s.length() != t.length()) {
            return false;
        }
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) {
                return false;
            }
        }
        return true;
    }
}`,

  cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) {
            return false;
        }
        vector<int> count(26, 0);
        for (char c : s) {
            count[c - 'a']++;
        }
        for (char c : t) {
            count[c - 'a']--;
            if (count[c - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }
};`
};

const generateSteps = (s: string, t: string) => {
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const sCount: Record<string, number> = {};
  const tCount: Record<string, number> = {};

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      s, t,
      sCount: { ...sCount },
      tCount: { ...tCount },
      i: extra.hasOwnProperty('i') ? extra.i! : -1,
      highlightChar: extra.highlightChar,
      compareChar: extra.compareChar,
      explanation: msg,
      pseudoStep: pseudo,
      isAnagram: extra.isAnagram
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial
  addStep(`Case: s = "${s}", t = "${t}".`, "CALL isAnagram(s, t)", 1, 1, 2, 3);

  // 2. Length check
  addStep(`Check if lengths match: s.length (${s.length}) vs t.length (${t.length}).`, "IF len(s) != len(t)", 2, 2, 5, 4);

  if (s.length !== t.length) {
    addStep("Lengths are unequal! They cannot be anagrams.", "RETURN False", 3, 3, 6, 5, { isAnagram: false });
    return { steps, stepLineNumbers };
  }

  // 3. Init structures
  addStep("Initialize frequency map sCount.", "SET s_count = {}", 5, 4, 8, 7);
  addStep("Initialize frequency map tCount.", "SET t_count = {}", 6, 5, 8, 7);

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    addStep(`Iteration i = ${i}: Processing characters.`, `FOR i = ${i} TO len(s) - 1`, 7, 6, 9, 8, { i });
    addStep(`Extract s[${i}] = '${charS}'.`, `GET s[${i}]`, 8, 6, 10, 9, { i, highlightChar: charS });
    addStep(`Extract t[${i}] = '${charT}'.`, `GET t[${i}]`, 9, 6, 11, 11, { i, highlightChar: charT });

    sCount[charS] = (sCount[charS] || 0) + 1;
    addStep(`Update sCount: Increment count for '${charS}'.`, `SET s_count['${charS}'] = s_count['${charS}'] + 1`, 10, 7, 10, 9, { i, highlightChar: charS });

    tCount[charT] = (tCount[charT] || 0) + 1;
    addStep(`Update tCount: Increment count for '${charT}'.`, `SET t_count['${charT}'] = t_count['${charT}'] + 1`, 11, 8, 11, 12, { i, highlightChar: charT });
  }

  addStep("Counting finished. Now compare frequencies.", "FOR char IN s_count", 13, 9, 13, 11);

  const chars = Object.keys(sCount);
  for (const char of chars) {
    addStep(`Compare count for '${char}': sCount (${sCount[char]}) vs tCount (${tCount[char] || 0}).`, `IF s_count['${char}'] != t_count['${char}']`, 14, 10, 14, 13, { compareChar: char });

    if (sCount[char] !== tCount[char]) {
      addStep(`Mismatch found for '${char}'! Return false.`, "RETURN False", 15, 11, 15, 14, { compareChar: char, isAnagram: false });
      return { steps, stepLineNumbers };
    }
  }

  addStep("All counts match! Return true.", "RETURN True", 18, 12, 18, 17, { isAnagram: true });

  return { steps, stepLineNumbers };
};

export const ValidAnagramVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const cases = [
    { name: "Valid Anagram", s: "anagram", t: "nagaram", icon: <CheckCircle2 className="w-4 h-4" /> },
    { name: "Not an Anagram", s: "rat", t: "car", icon: <XCircle className="w-4 h-4" /> }
  ];
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const selectedCase = cases[selectedCaseIndex];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(selectedCase.s, selectedCase.t);
  }, [selectedCase]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const handleCaseChange = (index: number) => {
    setSelectedCaseIndex(index);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
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
                  className="absolute inset-0 bg-background shadow-sm border border-border/55 rounded-lg"
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
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">String s</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentStep.s.split('').map((char, idx) => (
                      <div
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-md border text-lg font-mono transition-all duration-200 ${
                          currentStep.i === idx || currentStep.compareChar === char
                            ? 'bg-blue-500/20 border-blue-500 text-foreground font-bold scale-105 shadow-sm'
                            : 'bg-muted/50 border-transparent text-muted-foreground'
                        }`}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">String t</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentStep.t.split('').map((char, idx) => (
                      <div
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-md border text-lg font-mono transition-all duration-200 ${
                          currentStep.i === idx || currentStep.compareChar === char
                            ? 'bg-purple-500/20 border-purple-500 text-foreground font-bold scale-105 shadow-sm'
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
                  <h4 className="text-xs font-bold tracking-wider text-blue-500 mb-3 uppercase">sCount</h4>
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
                              currentStep.compareChar === char ? 'bg-blue-500/20 ring-1 ring-blue-500 font-bold' : 'bg-background'
                            }`}
                          >
                            <span>'{char}'</span>
                            <span className="text-blue-500">{count}</span>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </Card>

                <Card className="p-4 bg-purple-500/5 border-purple-500/10">
                  <h4 className="text-xs font-bold tracking-wider text-purple-500 mb-3 uppercase">tCount</h4>
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
                              currentStep.compareChar === char ? 'bg-purple-500/20 ring-1 ring-purple-500 font-bold' : 'bg-background'
                            }`}
                          >
                            <span>'{char}'</span>
                            <span className="text-purple-500">{count}</span>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </div>
            </Card>

            {/* Descriptive Commentary Box (at the bottom) */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Process Step
              </div>
              {currentStep.explanation}
            </div>

            {/* Variable Panel (below the commentary box) */}
            <div className="pt-2">
              <VariablePanel
                variables={{
                  "Current Index i": currentStep.i === -1 ? "N/A" : currentStep.i,
                  "Processing Char": currentStep.highlightChar || currentStep.compareChar || "None",
                  "Status": currentStep.isAnagram === undefined ? "Processing..." : (currentStep.isAnagram ? "Anagram ✓" : "Not Anagram ✗")
                }}
              />
            </div>
          </div>
        }
        rightContent={
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
        }
      />
    </div>
  );
};
