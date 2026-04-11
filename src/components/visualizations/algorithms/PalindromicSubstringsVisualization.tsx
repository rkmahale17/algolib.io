import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ListFilter, Hash } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  s: string;
  i: number;
  l: number;
  r: number;
  totalRes: number;
  paliRes: number;
  comment: string;
  highlightedLines: number[];
  phase: 'odd' | 'even' | 'init' | 'result';
}

export const PalindromicSubstringsVisualization = () => {
  const code = `function countSubstrings(s: string): number {
  let res = 0;
  for (let i = 0; i < s.length; i++) {
    res += countPali(s, i, i);
    res += countPali(s, i, i + 1);
  }
  return res;
}

function countPali(s: string, l: number, r: number): number {
  let res = 0;
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    res++;
    l--;
    r++;
  }
  return res;
}`;

  const cases = {
    "aaa": {
      steps: [
        { s: "aaa", i: -1, l: -1, r: -1, totalRes: 0, paliRes: 0, phase: 'init', comment: "Initialize the total result counter `res` to 0.", highlightedLines: [2] },
        { s: "aaa", i: 0, l: 0, r: 0, totalRes: 0, paliRes: 0, phase: 'odd', comment: "i=0: Expanding for odd-length palindromes centered at 'a' (index 0).", highlightedLines: [3, 4, 10, 11] },
        { s: "aaa", i: 0, l: 0, r: 0, totalRes: 0, paliRes: 1, phase: 'odd', comment: "Condition check: l=0, r=0 match. Palindrome 'a' found. Local `res` = 1.", highlightedLines: [12, 13] },
        { s: "aaa", i: 0, l: -1, r: 1, totalRes: 0, paliRes: 1, phase: 'odd', comment: "Expand l=-1. Boundary check fails. Return 1 to `totalRes`.", highlightedLines: [12, 17] },
        { s: "aaa", i: 0, l: -1, r: -1, totalRes: 1, paliRes: 0, phase: 'odd', comment: "Total updated: 0 + 1 = 1.", highlightedLines: [4] },
        { s: "aaa", i: 0, l: 0, r: 1, totalRes: 1, paliRes: 0, phase: 'even', comment: "i=0: Even expansion between index 0 and 1.", highlightedLines: [5, 10, 11] },
        { s: "aaa", i: 0, l: 0, r: 1, totalRes: 1, paliRes: 1, phase: 'even', comment: "Match! Palindrome 'aa' found. Local `res` = 1.", highlightedLines: [12, 13] },
        { s: "aaa", i: 0, l: -1, r: 2, totalRes: 1, paliRes: 1, phase: 'even', comment: "Expand: l=-1 out of bounds.", highlightedLines: [12, 17] },
        { s: "aaa", i: 0, l: -1, r: -1, totalRes: 2, paliRes: 0, phase: 'even', comment: "Total updated: 1 + 1 = 2.", highlightedLines: [5] },
        { s: "aaa", i: 1, l: 1, r: 1, totalRes: 2, paliRes: 0, phase: 'odd', comment: "i=1: Center 'a' (index 1).", highlightedLines: [3, 4, 11] },
        { s: "aaa", i: 1, l: 1, r: 1, totalRes: 2, paliRes: 1, phase: 'odd', comment: "Match 'a'. Local `res` = 1.", highlightedLines: [12, 13] },
        { s: "aaa", i: 1, l: 0, r: 2, totalRes: 2, paliRes: 1, phase: 'odd', comment: "Expand: compare s[0] and s[2]. Match!", highlightedLines: [12] },
        { s: "aaa", i: 1, l: 0, r: 2, totalRes: 2, paliRes: 2, phase: 'odd', comment: "Palindrome 'aaa' found. Local `res` = 2.", highlightedLines: [13] },
        { s: "aaa", i: 1, l: -1, r: 3, totalRes: 2, paliRes: 2, phase: 'odd', comment: "Expansion ends.", highlightedLines: [12, 17] },
        { s: "aaa", i: 1, l: -1, r: -1, totalRes: 4, paliRes: 0, phase: 'odd', comment: "Total updated: 2 + 2 = 4.", highlightedLines: [4] },
        { s: "aaa", i: 1, l: 1, r: 2, totalRes: 4, paliRes: 0, phase: 'even', comment: "i=1: Even center index 1, 2.", highlightedLines: [5, 11] },
        { s: "aaa", i: 1, l: 1, r: 2, totalRes: 4, paliRes: 1, phase: 'even', comment: "Match 'aa'. Local `res` = 1.", highlightedLines: [12, 13] },
        { s: "aaa", i: 1, l: -1, r: -1, totalRes: 5, paliRes: 0, phase: 'even', comment: "Total: 4 + 1 = 5.", highlightedLines: [5] },
        { s: "aaa", i: 2, l: 2, r: 2, totalRes: 5, paliRes: 1, phase: 'odd', comment: "i=2: Center 'a' (index 2).", highlightedLines: [3, 4, 13] },
        { s: "aaa", i: 2, l: -1, r: -1, totalRes: 6, paliRes: 0, phase: 'odd', comment: "Total: 5 + 1 = 6.", highlightedLines: [4] },
        { s: "aaa", i: -1, l: -1, r: -1, totalRes: 6, paliRes: 0, phase: 'result', comment: "Finished. Found 6 palindromic substrings.", highlightedLines: [7] }
      ]
    },
    "abc": {
      steps: [
        { s: "abc", i: 0, l: 0, r: 0, totalRes: 0, paliRes: 1, phase: 'odd', comment: "Center 'a' found (1).", highlightedLines: [2, 4, 13] },
        { s: "abc", i: 0, l: 0, r: 1, totalRes: 1, paliRes: 0, phase: 'even', comment: "Even center 'a','b' (0).", highlightedLines: [5, 12] },
        { s: "abc", i: 1, l: 1, r: 1, totalRes: 1, paliRes: 1, phase: 'odd', comment: "Center 'b' found (1).", highlightedLines: [4, 13] },
        { s: "abc", i: 2, l: 2, r: 2, totalRes: 2, paliRes: 1, phase: 'odd', comment: "Center 'c' found (1).", highlightedLines: [4, 13] },
        { s: "abc", i: -1, l: -1, r: -1, totalRes: 3, paliRes: 0, phase: 'result', comment: "Only single characters are palindromes in 'abc'. Total: 3.", highlightedLines: [7] }
      ]
    }
  };

  const [activeCase, setActiveCase] = useState<'aaa' | 'abc'>('aaa');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = cases[activeCase].steps;
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const handleCaseChange = (newCase: 'aaa' | 'abc') => {
    setActiveCase(newCase);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
        
        <div className="flex p-1 bg-muted rounded-xl border border-border w-fit backdrop-blur-sm shadow-inner">
          <button
            onClick={() => handleCaseChange('aaa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'aaa' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListFilter className="h-4 w-4" />
            Mixed (aaa)
          </button>
          <button
            onClick={() => handleCaseChange('abc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'abc' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Hash className={activeCase === 'abc' ? 'text-primary h-4 w-4' : 'text-muted-foreground h-4 w-4'} />
            Minimal (abc)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">String Inspection</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentStep.phase === 'odd' ? 'bg-blue-500/10 text-blue-500' :
                  currentStep.phase === 'even' ? 'bg-purple-500/10 text-purple-500' :
                  currentStep.phase === 'result' ? 'bg-green-500/10 text-green-500' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {currentStep.phase} mode
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStep.s.split('').map((char, idx) => {
                  const isCenter = idx === currentStep.i;
                  const isExpanding = currentStep.l >= 0 && idx >= currentStep.l && idx <= currentStep.r;
                  
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                        isCenter
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                        : isExpanding
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-card border-border text-foreground'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 min-h-[80px] flex items-center">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-bold text-primary mr-2">Step {currentStepIndex}:</span>
                  {currentStep.comment}
                </p>
              </div>

              <div className="flex gap-4">
                <Card className="flex-1 p-4 bg-green-500/5 border-green-500/20 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentStep.totalRes}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Count</p>
                </Card>
                <Card className="flex-1 p-4 bg-blue-500/5 border-blue-500/20 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentStep.paliRes}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Center {currentStep.phase === 'odd' ? 'Odd' : 'Even'}</p>
                </Card>
              </div>

              <VariablePanel
                variables={{
                  center_i: currentStep.i === -1 ? 'None' : currentStep.i,
                  L: currentStep.l === -1 ? 'Out' : currentStep.l,
                  R: currentStep.r === -1 ? 'Out' : currentStep.r,
                  substring: (currentStep.l >= 0 && currentStep.r >= 0) ? `"${currentStep.s.substring(currentStep.l, currentStep.r + 1)}"` : 'N/A'
                }}
              />
            </div>
          </Card>
        </div>

        <div className="lg:h-[calc(100vh-250px)] min-h-[500px]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
          />
        </div>
      </div>
    </div>
  );
};

