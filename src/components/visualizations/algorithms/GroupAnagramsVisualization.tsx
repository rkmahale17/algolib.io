import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Layers, ListFilter } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  strs: string[];
  currentStr?: string;
  currentIndex?: number;
  count?: number[];
  key?: string;
  map: Record<string, string[]>;
  result?: string[][];
  explanation: string;
  pseudoStep: string;
}

const USE_CASES = [
  { name: "Default Case", strs: ["eat", "tea", "tan", "ate", "nat", "bat"], icon: <Layers className="w-4 h-4" /> },
  { name: "Empty Strings", strs: ["", "", ""], icon: <ListFilter className="w-4 h-4" /> }
];

const languages: VisualizationLanguageMap = {
  python: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    anagram_groups = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1
        key = tuple(count)
        anagram_groups[key].append(s)
    return list(anagram_groups.values())`,

  typescript: `function groupAnagrams(strs: string[]): string[][] {
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
}`,

  java: `public class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                int index = c - 'a';
                count[index]++;
            }
            StringBuilder keyBuilder = new StringBuilder();
            for (int num : count) {
                keyBuilder.append(num).append("#");
            }
            String key = keyBuilder.toString();
            map.putIfAbsent(key, new ArrayList<>());
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,

  cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> anagrams;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            anagrams[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [key, group] : anagrams) {
            result.push_back(group);
        }
        return result;
    }
};`
};

const generateSteps = (strs: string[]) => {
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

  const map: Record<string, string[]> = {};

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      strs,
      map: JSON.parse(JSON.stringify(map)),
      currentStr: extra.currentStr,
      currentIndex: extra.currentIndex,
      count: extra.count,
      key: extra.key,
      result: extra.result,
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Init Map
  addStep("Initialize map to store anagram groups.", "SET map = {}", 2, 4, 3, 4);

  for (let i = 0; i < strs.length; i++) {
    const s = strs[i];
    const count = new Array(26).fill(0);

    // 2. Loop start
    addStep(`Process string "${s}" at index ${i}.`, `FOR s IN strs [i = ${i}]`, 3, 5, 4, 5, { currentStr: s, currentIndex: i });

    // 3. Init count
    addStep("Initialize character frequency array count (size 26).", "SET count = [0] * 26", 4, 6, 5, 6, { currentStr: s, currentIndex: i, count: [...count] });

    for (const c of s) {
      const charIdx = c.charCodeAt(0) - 'a'.charCodeAt(0);
      count[charIdx]++;
    }
    // 4. Counting complete step
    addStep(`Populate character counts for "${s}".`, `FOR char IN s`, 5, 7, 6, 5, { currentStr: s, currentIndex: i, count: [...count] });

    let key = "";
    for (const num of count) {
      key += num + "#";
    }
    // 5. Construct key signature
    addStep(`Constructed key signature: "${key.substring(0, 10)}..."`, `SET key = tuple(count)`, 9, 9, 10, 6, { currentStr: s, currentIndex: i, count: [...count], key });

    // 6. Check existence
    addStep(`Check map for key: "${key.substring(0, 8)}..."`, `IF key NOT IN map`, 13, 10, 15, 8, { currentStr: s, currentIndex: i, count: [...count], key });

    if (!map[key]) {
      map[key] = [];
      addStep("Key not found in map. Initialize new anagram group list.", "SET map[key] = []", 14, 10, 15, 8, { currentStr: s, currentIndex: i, count: [...count], key });
    }

    map[key].push(s);
    addStep(`Append "${s}" to group associated with key.`, "map[key].append(s)", 16, 10, 16, 8, { currentStr: s, currentIndex: i, count: [...count], key });
  }

  // 7. Return complete
  addStep("Extraction complete. Return all grouped anagram lists.", "RETURN map.values()", 18, 11, 18, 14, { result: Object.values(map) });

  return { steps, stepLineNumbers };
};

export const GroupAnagramsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const selectedCase = USE_CASES[selectedCaseIndex];

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(selectedCase.strs);
  }, [selectedCase]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
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
          {USE_CASES.map((testCase, idx) => (
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
            <Card className="p-6 border shadow-sm space-y-8">
              {/* Input Array */}
              <div>
                <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">Input Strings</h3>
                <div className="flex flex-wrap gap-2">
                  {currentStep.strs.map((s, idx) => (
                    <motion.div
                      key={idx}
                      className={`px-3 py-1.5 rounded-md font-mono text-sm border transition-all duration-200 ${
                        currentStep.currentIndex === idx
                          ? 'bg-primary/20 border-primary text-foreground font-bold scale-105 shadow-sm'
                          : 'bg-muted/50 border-transparent text-muted-foreground'
                      }`}
                    >
                      "{s}"
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Count Array */}
              <AnimatePresence mode="wait">
                {currentStep.count && (
                  <motion.div
                    key="count-viz"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">
                      Frequency Count for "{currentStep.currentStr}"
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {currentStep.count.map((count, idx) => {
                        const char = String.fromCharCode(97 + idx);
                        if (count === 0 && !['a', 'e', 't', 'n', 'b'].includes(char)) return null;
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col items-center p-1.5 min-w-[36px] rounded-lg border transition-all duration-200 ${
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
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Anagram Map</h3>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {Object.keys(currentStep.map).length === 0 ? (
                      <p className="text-sm text-muted-foreground italic pl-2">Initializing map...</p>
                    ) : (
                      Object.entries(currentStep.map).map(([key, group]) => (
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
              {currentStep.result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-primary/5 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                >
                  <h3 className="text-xs font-bold mb-4 text-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    Final Result
                  </h3>
                  <div className="space-y-3">
                    {currentStep.result.map((group, idx) => (
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
                  "Current String": currentStep.currentStr || "None",
                  "Index": currentStep.currentIndex ?? "N/A",
                  "Map Groups": Object.keys(currentStep.map).length,
                  "Status": currentStep.result ? "Complete ✓" : "Processing..."
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
