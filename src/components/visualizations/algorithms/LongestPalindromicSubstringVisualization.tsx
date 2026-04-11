import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TextCursorInput } from 'lucide-react';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  s: string;
  i: number;
  l: number;
  r: number;
  res: string;
  resLen: number;
  comment: string;
  highlightedLines: number[];
  phase: 'odd' | 'even' | 'init' | 'result';
}

export const LongestPalindromicSubstringVisualization = () => {
  const code = `function longestPalindrome(s: string): string {
  let res = "";
  let resLen = 0;

  for (let i = 0; i < s.length; i++) {
    let l = i;
    let r = i;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if ((r - l + 1) > resLen) {
        res = s.substring(l, r + 1);
        resLen = r - l + 1;
      }
      l--;
      r++;
    }

    l = i;
    r = i + 1;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if ((r - l + 1) > resLen) {
        res = s.substring(l, r + 1);
        resLen = r - l + 1;
      }
      l--;
      r++;
    }
  }
  return res;
}`;

  const cases = {
    "babad": {
      steps: [
        { s: "babad", i: -1, l: -1, r: -1, res: "", resLen: 0, phase: 'init', comment: "Initialize result string `res` to empty and `resLen` to 0. We will iterate through each character as a potential center.", highlightedLines: [2, 3] },
        { s: "babad", i: 0, l: 0, r: 0, res: "", resLen: 0, phase: 'odd', comment: "i=0: Start expanding for an odd-length palindrome centered at 'b' (index 0).", highlightedLines: [5, 6, 7] },
        { s: "babad", i: 0, l: 0, r: 0, res: "", resLen: 0, phase: 'odd', comment: "Check if expansion is possible: l=0 >= 0, r=0 < 5, and s[0] ('b') === s[0] ('b'). Condition satisfied.", highlightedLines: [8] },
        { s: "babad", i: 0, l: 0, r: 0, res: "", resLen: 0, phase: 'odd', comment: "Palindrome found: 'b'. Current length is 1 (r-l+1). Is 1 > 0?", highlightedLines: [9] },
        { s: "babad", i: 0, l: 0, r: 0, res: "b", resLen: 1, phase: 'odd', comment: "Yes! Update `res` to 'b' and `resLen` to 1.", highlightedLines: [10, 11] },
        { s: "babad", i: 0, l: -1, r: 1, res: "b", resLen: 1, phase: 'odd', comment: "Decrement l to -1, increment r to 1. Check loop again.", highlightedLines: [8, 13, 14] },
        { s: "babad", i: 0, l: -1, r: 1, res: "b", resLen: 1, phase: 'odd', comment: "Boundary check: l=-1 is out of bounds. Expansion for center 'b' ends.", highlightedLines: [8] },
        { s: "babad", i: 0, l: 0, r: 1, res: "b", resLen: 1, phase: 'even', comment: "i=0: Now try an even-length expansion centered between index 0 ('b') and 1 ('a').", highlightedLines: [17, 18] },
        { s: "babad", i: 0, l: 0, r: 1, res: "b", resLen: 1, phase: 'even', comment: "Check s[0] ('b') === s[1] ('a'). Characters don't match. No even palindrome here.", highlightedLines: [19] },
        { s: "babad", i: 1, l: 1, r: 1, res: "b", resLen: 1, phase: 'odd', comment: "i=1: Center 'a'. Start odd expansion.", highlightedLines: [5, 6, 7] },
        { s: "babad", i: 1, l: 1, r: 1, res: "b", resLen: 1, phase: 'odd', comment: "Match 'a'. Length 1. Is 1 > 1? No improvement, but loop continues.", highlightedLines: [8, 9] },
        { s: "babad", i: 1, l: 0, r: 2, res: "b", resLen: 1, phase: 'odd', comment: "Expand: l=0, r=2. Boundary check OK.", highlightedLines: [8, 13, 14] },
        { s: "babad", i: 1, l: 0, r: 2, res: "b", resLen: 1, phase: 'odd', comment: "Compare s[0] ('b') and s[2] ('b'). They match! Condition satisfied.", highlightedLines: [8] },
        { s: "babad", i: 1, l: 0, r: 2, res: "b", resLen: 1, phase: 'odd', comment: "Palindrome found: 'bab'. Length 3. Is 3 > 1?", highlightedLines: [9] },
        { s: "babad", i: 1, l: 0, r: 2, res: "bab", resLen: 3, phase: 'odd', comment: "Yes! Update `res` to 'bab' and `resLen` to 3.", highlightedLines: [10, 11] },
        { s: "babad", i: 1, l: -1, r: 3, res: "bab", resLen: 3, phase: 'odd', comment: "Expand: l=-1, r=3. l is out of bounds. Expansion ends.", highlightedLines: [8, 13, 14] },
        { s: "babad", i: 1, l: 1, r: 2, res: "bab", resLen: 3, phase: 'even', comment: "i=1: Center 'a', 'b'. Compare s[1] and s[2]. No match.", highlightedLines: [17, 18, 19] },
        { s: "babad", i: 2, l: 2, r: 2, res: "bab", resLen: 3, phase: 'odd', comment: "i=2: Center 'b'.", highlightedLines: [5, 6, 7] },
        { s: "babad", i: 2, l: 1, r: 3, res: "bab", resLen: 3, phase: 'odd', comment: "Match 'aba' (len 3). Is 3 > 3? No improvement.", highlightedLines: [8, 9] },
        { s: "babad", i: -1, l: -1, r: -1, res: "bab", resLen: 3, phase: 'result', comment: "Iteration finished for all centers. Returning 'bab'.", highlightedLines: [28] }
      ]
    },
    "cbbd": {
      steps: [
        { s: "cbbd", i: -1, l: -1, r: -1, res: "", resLen: 0, phase: 'init', comment: "Starting for 'cbbd'. Expecting an even-length result.", highlightedLines: [2, 3] },
        { s: "cbbd", i: 0, l: 0, r: 0, res: "c", resLen: 1, phase: 'odd', comment: "i=0: Center 'c' gives length 1. Updates res to 'c'.", highlightedLines: [5, 6, 7, 10, 11] },
        { s: "cbbd", i: 0, l: 0, r: 1, res: "c", resLen: 1, phase: 'even', comment: "i=0: Center 'c', 'b'. No even-match.", highlightedLines: [17, 18, 19] },
        { s: "cbbd", i: 1, l: 1, r: 1, res: "c", resLen: 1, phase: 'odd', comment: "i=1: Center 'b' (len 1). No improvement.", highlightedLines: [5, 6, 7, 8, 9] },
        { s: "cbbd", i: 1, l: 1, r: 2, res: "c", resLen: 1, phase: 'even', comment: "i=1: Even expansion centered between index 1 and 2.", highlightedLines: [17, 18] },
        { s: "cbbd", i: 1, l: 1, r: 2, res: "c", resLen: 1, phase: 'even', comment: "Characters s[1]('b') and s[2]('b') match! Condition satisfied.", highlightedLines: [19] },
        { s: "cbbd", i: 1, l: 1, r: 2, res: "c", resLen: 1, phase: 'even', comment: "Palindrome found: 'bb'. Length 2. Is 2 > 1?", highlightedLines: [20] },
        { s: "cbbd", i: 1, l: 1, r: 2, res: "bb", resLen: 2, phase: 'even', comment: "Yes! Update `res` to 'bb'.", highlightedLines: [21, 22] },
        { s: "cbbd", i: 1, l: 0, r: 3, res: "bb", resLen: 2, phase: 'even', comment: "Expand: compare s[0]('c') and s[3]('d'). No match.", highlightedLines: [19, 24, 25] },
        { s: "cbbd", i: -1, l: -1, r: -1, res: "bb", resLen: 2, phase: 'result', comment: "Finished. Longest even palindrome 'bb' found.", highlightedLines: [28] }
      ]
    }
  };

  const [activeCase, setActiveCase] = useState<'babad' | 'cbbd'>('babad');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = cases[activeCase].steps;
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const handleCaseChange = (newCase: 'babad' | 'cbbd') => {
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
            onClick={() => handleCaseChange('babad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'babad' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="h-4 w-4" />
            Mixed (babad)
          </button>
          <button
            onClick={() => handleCaseChange('cbbd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCase === 'cbbd' 
              ? 'bg-card text-primary shadow-sm ring-1 ring-border/50' 
              : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TextCursorInput className={activeCase === 'cbbd' ? 'text-primary h-4 w-4' : 'text-muted-foreground h-4 w-4'} />
            Even Result (cbbd)
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
                  const isResult = currentStep.phase === 'result' && currentStep.res.includes(char) && 
                                   idx >= currentStep.s.indexOf(currentStep.res) && 
                                   idx < currentStep.s.indexOf(currentStep.res) + currentStep.res.length;

                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border-2 transition-all duration-200 ${
                        isCenter
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                        : isExpanding
                          ? 'bg-primary/20 border-primary text-primary'
                          : isResult
                            ? 'bg-green-500/20 border-green-500 text-green-600 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
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

              <VariablePanel
                variables={{
                  index_i: currentStep.i === -1 ? 'N/A' : currentStep.i,
                  left: currentStep.l === -1 ? 'None' : currentStep.l,
                  right: currentStep.r === -1 ? 'None' : currentStep.r,
                  longest: currentStep.res || '""',
                  maxLen: currentStep.resLen
                }}
              />

              {currentStep.phase === 'result' && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center gap-3">
                  <span className="text-xl font-bold">Result: "{currentStep.res}"</span>
                </div>
              )}
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
