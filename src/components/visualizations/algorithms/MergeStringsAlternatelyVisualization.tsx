import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  word1: string[];
  word2: string[];
  i: number;
  j: number;
  res: string[];
  word1Highlights: number[];
  word2Highlights: number[];
  resHighlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function mergeAlternately(word1: string, word2: string): string {
    let i = 0;
    let j = 0;
    const res: string[] = [];
    while (i < word1.length && j < word2.length) {
        res.push(word1[i]);
        res.push(word2[j]);
        i++;
        j++;
    }
    res.push(word1.slice(i));
    res.push(word2.slice(j));
    return res.join("");
}`,

  python: `def mergeAlternately(word1: str, word2: str) -> str:
    i = 0
    j = 0
    res = []
    while i < len(word1) and j < len(word2):
        res.append(word1[i])
        res.append(word2[j])
        i += 1
        j += 1
    res.append(word1[i:])
    res.append(word2[j:])
    return "".join(res)`,

  java: `class Solution {
    public String mergeAlternately(String word1, String word2) {
        StringBuilder res = new StringBuilder();
        int i = 0;
        int j = 0;
        while (i < word1.length() && j < word2.length()) {
            res.append(word1.charAt(i));
            res.append(word2.charAt(j));
            i++;
            j++;
        }
        res.append(word1.substring(i));
        res.append(word2.substring(j));
        return res.toString();
    }
}`,

  cpp: `class Solution {
public:
    string mergeAlternately(string word1, string word2) {
        string res = "";
        int i = 0;
        int j = 0;
        while (i < word1.length() && j < word2.length()) {
            res += word1[i];
            res += word2[j];
            i++;
            j++;
        }
        if (i < word1.length()) {
            res += word1.substr(i);
        }
        if (j < word2.length()) {
            res += word2.substr(j);
        }
        return res;
    }
};`,
};

function generateVisualizationData() {
  const w1 = ["a", "b", "c"];
  const w2 = ["p", "q", "r", "s", "t"];
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

  // Step 1: Initialize
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 0,
    j: 0,
    res: [],
    word1Highlights: [],
    word2Highlights: [],
    resHighlights: [],
    variables: { word1: `"abc"`, word2: `"pqrst"`, i: 0, j: 0, res: "[]" },
    explanation: "Initialize pointer i to index 0 for word1, pointer j to index 0 for word2, and an empty result array.",
    pseudoStep: "SET i = 0, j = 0, res = []"
  });
  addLines(2, 2, 3, 4);

  // Round 1
  // Step 2: Loop check
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 0,
    j: 0,
    res: [],
    word1Highlights: [0],
    word2Highlights: [0],
    resHighlights: [],
    variables: { i: 0, j: 0, "i < len(word1)": "0 < 3 → true", "j < len(word2)": "0 < 5 → true" },
    explanation: "Check the loop condition. Since i (0) < 3 and j (0) < 5, we enter the alternating merge loop.",
    pseudoStep: "WHILE i (0) < len(word1) AND j (0) < len(word2)"
  });
  addLines(5, 5, 6, 7);

  // Step 3: Append word1[0] and word2[0]
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 0,
    j: 0,
    res: ["a", "p"],
    word1Highlights: [0],
    word2Highlights: [0],
    resHighlights: [0, 1],
    variables: { i: 0, j: 0, "word1[i]": "a", "word2[j]": "p", res: "[\"a\", \"p\"]" },
    explanation: "Append character 'a' from word1[0] and character 'p' from word2[0] to the result array.",
    pseudoStep: "APPEND word1[0] ('a') AND word2[0] ('p') TO res"
  });
  addLines(6, 6, 7, 8);

  // Step 4: Increment pointers
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 1,
    j: 1,
    res: ["a", "p"],
    word1Highlights: [1],
    word2Highlights: [1],
    resHighlights: [],
    variables: { i: 1, j: 1, res: "[\"a\", \"p\"]" },
    explanation: "Increment both pointers to move to the next characters: i becomes 1, j becomes 1.",
    pseudoStep: "i++, j++  →  i = 1, j = 1"
  });
  addLines(8, 8, 9, 10);

  // Round 2
  // Step 5: Loop check
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 1,
    j: 1,
    res: ["a", "p"],
    word1Highlights: [1],
    word2Highlights: [1],
    resHighlights: [],
    variables: { i: 1, j: 1, "i < len(word1)": "1 < 3 → true", "j < len(word2)": "1 < 5 → true" },
    explanation: "Check the loop condition. Both pointers are within boundaries: 1 < 3 and 1 < 5.",
    pseudoStep: "WHILE i (1) < len(word1) AND j (1) < len(word2)"
  });
  addLines(5, 5, 6, 7);

  // Step 6: Append word1[1] and word2[1]
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 1,
    j: 1,
    res: ["a", "p", "b", "q"],
    word1Highlights: [1],
    word2Highlights: [1],
    resHighlights: [2, 3],
    variables: { i: 1, j: 1, "word1[i]": "b", "word2[j]": "q", res: "[\"a\", \"p\", \"b\", \"q\"]" },
    explanation: "Append character 'b' from word1[1] and character 'q' from word2[1] to the result array.",
    pseudoStep: "APPEND word1[1] ('b') AND word2[1] ('q') TO res"
  });
  addLines(6, 6, 7, 8);

  // Step 7: Increment pointers
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 2,
    j: 2,
    res: ["a", "p", "b", "q"],
    word1Highlights: [2],
    word2Highlights: [2],
    resHighlights: [],
    variables: { i: 2, j: 2, res: "[\"a\", \"p\", \"b\", \"q\"]" },
    explanation: "Increment both pointers again: i becomes 2, j becomes 2.",
    pseudoStep: "i++, j++  →  i = 2, j = 2"
  });
  addLines(8, 8, 9, 10);

  // Round 3
  // Step 8: Loop check
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 2,
    j: 2,
    res: ["a", "p", "b", "q"],
    word1Highlights: [2],
    word2Highlights: [2],
    resHighlights: [],
    variables: { i: 2, j: 2, "i < len(word1)": "2 < 3 → true", "j < len(word2)": "2 < 5 → true" },
    explanation: "Check the loop condition. Pointers are still within boundaries: 2 < 3 and 2 < 5.",
    pseudoStep: "WHILE i (2) < len(word1) AND j (2) < len(word2)"
  });
  addLines(5, 5, 6, 7);

  // Step 9: Append word1[2] and word2[2]
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 2,
    j: 2,
    res: ["a", "p", "b", "q", "c", "r"],
    word1Highlights: [2],
    word2Highlights: [2],
    resHighlights: [4, 5],
    variables: { i: 2, j: 2, "word1[i]": "c", "word2[j]": "r", res: "[\"a\", \"p\", \"b\", \"q\", \"c\", \"r\"]" },
    explanation: "Append character 'c' from word1[2] and character 'r' from word2[2] to the result array.",
    pseudoStep: "APPEND word1[2] ('c') AND word2[2] ('r') TO res"
  });
  addLines(6, 6, 7, 8);

  // Step 10: Increment pointers
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 3,
    j: 3,
    res: ["a", "p", "b", "q", "c", "r"],
    word1Highlights: [],
    word2Highlights: [3],
    resHighlights: [],
    variables: { i: 3, j: 3, res: "[\"a\", \"p\", \"b\", \"q\", \"c\", \"r\"]" },
    explanation: "Increment both pointers: i becomes 3, j becomes 3.",
    pseudoStep: "i++, j++  →  i = 3, j = 3"
  });
  addLines(8, 8, 9, 10);

  // Step 11: Loop termination check
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 3,
    j: 3,
    res: ["a", "p", "b", "q", "c", "r"],
    word1Highlights: [],
    word2Highlights: [3],
    resHighlights: [],
    variables: { i: 3, j: 3, "i < len(word1)": "3 < 3 → false" },
    explanation: "Check the loop condition. Since i (3) is no longer less than 3, the condition becomes false. The alternating loop terminates.",
    pseudoStep: "WHILE i (3) < len(word1) AND j (3) < len(word2)  →  false"
  });
  addLines(5, 5, 6, 7);

  // Step 12: Append remaining from word1
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 3,
    j: 3,
    res: ["a", "p", "b", "q", "c", "r"],
    word1Highlights: [],
    word2Highlights: [3],
    resHighlights: [],
    variables: { i: 3, j: 3, "word1.slice(3)": "\"\"", res: "[\"a\", \"p\", \"b\", \"q\", \"c\", \"r\"]" },
    explanation: "Append remaining characters of word1 starting from index 3. Since word1 is fully consumed, we append nothing.",
    pseudoStep: "res.push(word1.slice(3))  →  \"\""
  });
  addLines(11, 10, 12, 13);

  // Step 13: Append remaining from word2
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 3,
    j: 3,
    res: ["a", "p", "b", "q", "c", "r", "s", "t"],
    word1Highlights: [],
    word2Highlights: [3, 4],
    resHighlights: [6, 7],
    variables: { i: 3, j: 3, "word2.slice(3)": "\"st\"", res: "[\"a\", \"p\", \"b\", \"q\", \"c\", \"r\", \"s\", \"t\"]" },
    explanation: "Append remaining characters of word2 starting from index 3. Since word2 has 's' and 't' left, the substring 'st' is appended to the result.",
    pseudoStep: "res.push(word2.slice(3))  →  \"st\""
  });
  addLines(12, 11, 13, 16);

  // Step 14: Join and Return
  steps.push({
    word1: [...w1],
    word2: [...w2],
    i: 3,
    j: 5,
    res: ["a", "p", "b", "q", "c", "r", "s", "t"],
    word1Highlights: [],
    word2Highlights: [],
    resHighlights: [],
    variables: { result: "\"apbqcrst\"" },
    explanation: "Join all elements in the result array into a single string and return it.",
    pseudoStep: "RETURN res.join(\"\")  →  \"apbqcrst\""
  });
  addLines(13, 12, 14, 19);

  return { steps, stepLineNumbers };
}

export const MergeStringsAlternatelyVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Merge Strings Alternately (Two Pointers)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative space-y-8">
              
              {/* word1 representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-4">Word1 ("abc")</h4>
                <div className="flex gap-3 justify-start items-center">
                  {currentStep.word1.map((char, idx) => {
                    const isPointer = idx === currentStep.i && currentStepIndex < 12;
                    const isHighlighted = currentStep.word1Highlights.includes(idx);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all shadow-sm ${
                            isHighlighted 
                              ? "border-orange-500 bg-orange-100 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 scale-110 z-10" 
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          <span className="text-sm font-semibold">{char}</span>
                        </div>
                        <div className="h-4 text-[10px] font-bold">
                          {isPointer ? <span className="text-blue-600 dark:text-blue-400">i</span> : <span className="opacity-0">-</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* word2 representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-4">Word2 ("pqrst")</h4>
                <div className="flex gap-3 justify-start items-center">
                  {currentStep.word2.map((char, idx) => {
                    const isPointer = idx === currentStep.j && currentStepIndex < 14;
                    const isHighlighted = currentStep.word2Highlights.includes(idx);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all shadow-sm ${
                            isHighlighted 
                              ? "border-orange-500 bg-orange-100 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 scale-110 z-10" 
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          <span className="text-sm font-semibold">{char}</span>
                        </div>
                        <div className="h-4 text-[10px] font-bold">
                          {isPointer ? <span className="text-purple-600 dark:text-purple-400">j</span> : <span className="opacity-0">-</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* res representation */}
              <div>
                <h4 className="text-[11px] font-bold text-muted-foreground mb-4">Result Array (res)</h4>
                <div className="flex gap-3 justify-start items-center min-h-[40px] flex-wrap">
                  {currentStep.res.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">Empty Array</span>
                  ) : (
                    currentStep.res.map((char, idx) => {
                      const isHighlighted = currentStep.resHighlights.includes(idx);
                      return (
                        <div 
                          key={idx} 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all shadow-sm ${
                            isHighlighted 
                              ? "border-green-500 bg-green-100 dark:bg-green-950/50 text-green-950 dark:text-green-200 scale-110 z-10" 
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          <span className="text-xs font-semibold">{char}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </Card>
          </div>

          {/* Commentary (Black and White) */}
          <div className="mt-auto">
            <Card className="p-5 border-l-4 border-foreground/30 bg-muted/30 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
