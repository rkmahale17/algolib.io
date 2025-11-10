import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { Maximize2 } from 'lucide-react';

interface Step {
  s: string;
  left: number;
  right: number;
  charSet: Set<string>;
  maxLen: number;
  currentSubstring: string;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  phase: string;
}

export const LongestSubstringWithoutRepeatingCharactersVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const inputString = "abcabcbb";

  const steps: Step[] = [
    {
      s: inputString,
      left: 0,
      right: 0,
      charSet: new Set(),
      maxLen: 0,
      currentSubstring: "",
      variables: { s: '"abcabcbb"', length: 8 },
      explanation: "Find longest substring without repeating characters in 'abcabcbb'. Use sliding window technique.",
      highlightedLines: [1],
      lineExecution: "function lengthOfLongestSubstring(s: string)",
      phase: "init"
    },
    {
      s: inputString,
      left: 0,
      right: 0,
      charSet: new Set(),
      maxLen: 0,
      currentSubstring: "",
      variables: { maxLen: 0, left: 0, right: 0 },
      explanation: "Initialize: maxLen = 0, left = 0, right = 0. Use Set to track characters in window.",
      highlightedLines: [2, 3],
      lineExecution: "let maxLen = 0, left = 0; const charSet = new Set<string>();",
      phase: "init"
    },
    {
      s: inputString,
      left: 0,
      right: 0,
      charSet: new Set(),
      maxLen: 0,
      currentSubstring: "",
      variables: { right: 0, char: 'a', inSet: false },
      explanation: "Start sliding window. right = 0, s[0] = 'a'. Check if 'a' is in set.",
      highlightedLines: [5],
      lineExecution: "for (let right = 0; right < s.length; right++)",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 0,
      charSet: new Set(['a']),
      maxLen: 0,
      currentSubstring: "a",
      variables: { add: 'a', charSet: "{'a'}", window: 'a' },
      explanation: "'a' not in set. Add 'a' to set. Current window: 'a'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 0,
      charSet: new Set(['a']),
      maxLen: 1,
      currentSubstring: "a",
      variables: { windowSize: 1, maxLen: 1, update: 'true' },
      explanation: "Update maxLen = max(0, 1) = 1. Current longest: 'a'.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 0,
      right: 1,
      charSet: new Set(['a']),
      maxLen: 1,
      currentSubstring: "a",
      variables: { right: 1, char: 'b', inSet: false },
      explanation: "Move right to 1. s[1] = 'b'. Check if 'b' is in set. Not in set.",
      highlightedLines: [5],
      lineExecution: "for (let right = 0; right < s.length; right++)",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 1,
      charSet: new Set(['a','b']),
      maxLen: 1,
      currentSubstring: "ab",
      variables: { add: 'b', charSet: "{'a','b'}", window: 'ab' },
      explanation: "'b' not in set. Add 'b' to set. Current window: 'ab'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 1,
      charSet: new Set(['a','b']),
      maxLen: 2,
      currentSubstring: "ab",
      variables: { windowSize: 2, maxLen: 2, update: 'true' },
      explanation: "Update maxLen = max(1, 2) = 2. Current longest: 'ab'.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 0,
      right: 2,
      charSet: new Set(['a','b']),
      maxLen: 2,
      currentSubstring: "ab",
      variables: { right: 2, char: 'c', inSet: false },
      explanation: "Move right to 2. s[2] = 'c'. Check if 'c' is in set. Not in set.",
      highlightedLines: [5],
      lineExecution: "for (let right = 0; right < s.length; right++)",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 2,
      charSet: new Set(['a','b','c']),
      maxLen: 2,
      currentSubstring: "abc",
      variables: { add: 'c', charSet: "{'a','b','c'}", window: 'abc' },
      explanation: "'c' not in set. Add 'c' to set. Current window: 'abc'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 0,
      right: 2,
      charSet: new Set(['a','b','c']),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { windowSize: 3, maxLen: 3, update: 'true' },
      explanation: "Update maxLen = max(2, 3) = 3. Current longest: 'abc'.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 0,
      right: 3,
      charSet: new Set(['a','b','c']),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { right: 3, char: 'a', inSet: true },
      explanation: "Move right to 3. s[3] = 'a'. Check if 'a' is in set. YES! Duplicate found.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right]))",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 0,
      right: 3,
      charSet: new Set(['b','c']),
      maxLen: 3,
      currentSubstring: "bc",
      variables: { remove: 'a', left: 0, charSet: "{'b','c'}" },
      explanation: "Duplicate 'a' found. Remove s[left=0] = 'a' from set. Move left to 1.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 1,
      right: 3,
      charSet: new Set(['b','c']),
      maxLen: 3,
      currentSubstring: "bc",
      variables: { left: 1, window: 'bca', check: 'still duplicate?' },
      explanation: "left now at 1. Check if s[3]='a' still in set. No longer duplicate.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right])) // false",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 1,
      right: 3,
      charSet: new Set(['b','c','a']),
      maxLen: 3,
      currentSubstring: "bca",
      variables: { add: 'a', charSet: "{'b','c','a'}", window: 'bca' },
      explanation: "Add 'a' to set. Current window: 'bca'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 1,
      right: 3,
      charSet: new Set(['b','c','a']),
      maxLen: 3,
      currentSubstring: "bca",
      variables: { windowSize: 3, maxLen: 3, noUpdate: 'same' },
      explanation: "Update maxLen = max(3, 3) = 3. No change.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 1,
      right: 4,
      charSet: new Set(['b','c','a']),
      maxLen: 3,
      currentSubstring: "bca",
      variables: { right: 4, char: 'b', inSet: true },
      explanation: "Move right to 4. s[4] = 'b'. Check if 'b' is in set. YES! Duplicate.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right]))",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 1,
      right: 4,
      charSet: new Set(['c','a']),
      maxLen: 3,
      currentSubstring: "ca",
      variables: { remove: 'b', left: 1, charSet: "{'c','a'}" },
      explanation: "Remove s[left=1] = 'b' from set. Move left to 2.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 2,
      right: 4,
      charSet: new Set(['c','a','b']),
      maxLen: 3,
      currentSubstring: "cab",
      variables: { add: 'b', charSet: "{'c','a','b'}", window: 'cab' },
      explanation: "Add 'b' to set. Current window: 'cab'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 2,
      right: 4,
      charSet: new Set(['c','a','b']),
      maxLen: 3,
      currentSubstring: "cab",
      variables: { windowSize: 3, maxLen: 3, noUpdate: 'same' },
      explanation: "Update maxLen = max(3, 3) = 3. Still 3.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 2,
      right: 5,
      charSet: new Set(['c','a','b']),
      maxLen: 3,
      currentSubstring: "cab",
      variables: { right: 5, char: 'c', inSet: true },
      explanation: "Move right to 5. s[5] = 'c'. Duplicate found in set.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right]))",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 2,
      right: 5,
      charSet: new Set(['a','b']),
      maxLen: 3,
      currentSubstring: "ab",
      variables: { remove: 'c', left: 2, charSet: "{'a','b'}" },
      explanation: "Remove s[left=2] = 'c' from set. Move left to 3.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 3,
      right: 5,
      charSet: new Set(['a','b','c']),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { add: 'c', charSet: "{'a','b','c'}", window: 'abc' },
      explanation: "Add 'c' to set. Current window: 'abc'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 3,
      right: 5,
      charSet: new Set(['a','b','c']),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { windowSize: 3, maxLen: 3, noUpdate: 'same' },
      explanation: "Update maxLen = max(3, 3) = 3.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 3,
      right: 6,
      charSet: new Set(['a','b','c']),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { right: 6, char: 'b', inSet: true },
      explanation: "Move right to 6. s[6] = 'b'. Duplicate found.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right]))",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 4,
      right: 6,
      charSet: new Set(['b','c']),
      maxLen: 3,
      currentSubstring: "bc",
      variables: { removed: 'a', left: 4, charSet: "{'b','c'}" },
      explanation: "Remove s[3]='a'. left=4. Still have 'b' in set, continue shrinking.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 5,
      right: 6,
      charSet: new Set(['c']),
      maxLen: 3,
      currentSubstring: "c",
      variables: { removed: 'b', left: 5, charSet: "{'c'}" },
      explanation: "Remove s[4]='b'. left=5. No more duplicate.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 5,
      right: 6,
      charSet: new Set(['c','b']),
      maxLen: 3,
      currentSubstring: "cb",
      variables: { add: 'b', charSet: "{'c','b'}", window: 'cb' },
      explanation: "Add 'b' to set. Current window: 'cb'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 5,
      right: 6,
      charSet: new Set(['c','b']),
      maxLen: 3,
      currentSubstring: "cb",
      variables: { windowSize: 2, maxLen: 3, noUpdate: 'same' },
      explanation: "Update maxLen = max(3, 2) = 3. No change.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 5,
      right: 7,
      charSet: new Set(['c','b']),
      maxLen: 3,
      currentSubstring: "cb",
      variables: { right: 7, char: 'b', inSet: true },
      explanation: "Move right to 7 (last char). s[7] = 'b'. Duplicate found.",
      highlightedLines: [6],
      lineExecution: "while (charSet.has(s[right]))",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 6,
      right: 7,
      charSet: new Set(['b']),
      maxLen: 3,
      currentSubstring: "b",
      variables: { removed: 'c', left: 6, charSet: "{'b'}" },
      explanation: "Remove s[5]='c'. left=6. Still have 'b', continue.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 7,
      right: 7,
      charSet: new Set(),
      maxLen: 3,
      currentSubstring: "",
      variables: { removed: 'b', left: 7, charSet: "{}" },
      explanation: "Remove s[6]='b'. left=7. No duplicate now.",
      highlightedLines: [7, 8],
      lineExecution: "charSet.delete(s[left]); left++;",
      phase: "shrink"
    },
    {
      s: inputString,
      left: 7,
      right: 7,
      charSet: new Set(['b']),
      maxLen: 3,
      currentSubstring: "b",
      variables: { add: 'b', charSet: "{'b'}", window: 'b' },
      explanation: "Add 'b' to set. Current window: 'b'.",
      highlightedLines: [12],
      lineExecution: "charSet.add(s[right]);",
      phase: "expand"
    },
    {
      s: inputString,
      left: 7,
      right: 7,
      charSet: new Set(['b']),
      maxLen: 3,
      currentSubstring: "b",
      variables: { windowSize: 1, maxLen: 3, noUpdate: 'same' },
      explanation: "Update maxLen = max(3, 1) = 3. Loop complete.",
      highlightedLines: [13],
      lineExecution: "maxLen = Math.max(maxLen, right - left + 1);",
      phase: "update"
    },
    {
      s: inputString,
      left: 7,
      right: 7,
      charSet: new Set(['b']),
      maxLen: 3,
      currentSubstring: "b",
      variables: { result: 3, longestSubstring: 'abc' },
      explanation: "Return maxLen = 3. Longest substring without repeating chars: 'abc'.",
      highlightedLines: [16],
      lineExecution: "return maxLen;",
      phase: "complete"
    },
    {
      s: inputString,
      left: -1,
      right: -1,
      charSet: new Set(),
      maxLen: 3,
      currentSubstring: "abc",
      variables: { time: 'O(n)', space: 'O(min(n,m))', m: 'charset size' },
      explanation: "Algorithm complete! Time: O(n) single pass. Space: O(min(n,m)) for set.",
      highlightedLines: [1],
      lineExecution: "// Done",
      phase: "complete"
    }
  ];

  const code = `function lengthOfLongestSubstring(s: string): number {
  let maxLen = 0, left = 0;
  const charSet = new Set<string>();
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const getCharColor = (index: number) => {
    if (!currentStep) return 'bg-muted text-muted-foreground border-border';
    
    const inWindow = index >= currentStep.left && index <= currentStep.right;
    const isLeft = index === currentStep.left;
    const isRight = index === currentStep.right;
    
    if (isRight && currentStep.phase === 'shrink') {
      return 'bg-destructive/80 text-destructive-foreground border-destructive shadow-lg scale-110';
    }
    if (isRight) {
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-110';
    }
    if (isLeft) {
      return 'bg-secondary text-secondary-foreground border-secondary shadow-md';
    }
    if (inWindow) {
      return 'bg-accent text-accent-foreground border-accent/50';
    }
    return 'bg-muted/50 text-muted-foreground border-border';
  };

  if (!currentStep) {
    return <div className="p-4 text-center">Loading visualization...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-primary" />
            Longest Substring (Sliding Window)
          </h3>
          <div className="space-y-4">
            <motion.div 
              key={`string-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">
                Phase: <span className="text-primary font-mono">{currentStep.phase}</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                String: <span className="text-foreground font-mono text-lg">"{currentStep.s}"</span>
              </div>
              <div className="inline-block bg-card p-4 rounded-lg border">
                <div className="flex gap-1">
                  {currentStep.s.split('').map((char, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: (idx === currentStep.right || idx === currentStep.left) ? 1.15 : 1 
                      }}
                      className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border-2 transition-all ${getCharColor(idx)}`}
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-1 mt-2">
                  {currentStep.s.split('').map((_, idx) => (
                    <div key={idx} className="w-12 text-center text-xs text-muted-foreground font-mono">
                      {idx}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-secondary/10 rounded border border-secondary/30"
              >
                <div className="text-xs text-muted-foreground mb-1">Left Pointer</div>
                <div className="text-lg font-mono font-bold text-secondary">{currentStep.left >= 0 ? currentStep.left : '-'}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-primary/10 rounded border border-primary/30"
              >
                <div className="text-xs text-muted-foreground mb-1">Right Pointer</div>
                <div className="text-lg font-mono font-bold text-primary">{currentStep.right >= 0 ? currentStep.right : '-'}</div>
              </motion.div>
            </div>

            {currentStep.currentSubstring && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-accent/10 rounded border-2 border-accent/30"
              >
                <div className="text-sm font-medium text-accent-foreground">
                  Current Window: <span className="font-mono text-primary text-lg">"{currentStep.currentSubstring}"</span>
                  <span className="ml-2 text-muted-foreground">Length: {currentStep.currentSubstring.length}</span>
                </div>
              </motion.div>
            )}

            {currentStep.charSet.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-muted/50 rounded border border-border"
              >
                <div className="text-sm font-medium text-foreground">
                  CharSet: <span className="font-mono text-primary">
                    {'{'}{Array.from(currentStep.charSet).map(c => `'${c}'`).join(', ')}{'}'}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Implementation</h3>
          <div className="flex-1 overflow-auto">
            <AnimatedCodeEditor 
              code={code} 
              language="typescript" 
              highlightedLines={(currentStep.highlightedLines || []).filter((n) => n >= 1 && n <= code.split('\n').length)}
            />
          </div>
        </Card>
      </div>

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
    </div>
  );
};