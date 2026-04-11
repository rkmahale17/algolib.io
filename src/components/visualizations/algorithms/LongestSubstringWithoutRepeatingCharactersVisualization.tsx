import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, SplitSquareHorizontal, Navigation } from 'lucide-react';

interface Step {
  s: string;
  l: number | null;
  r: number | null;
  res: number;
  charSet: string[];
  message: string;
  lineNumber: number;
  isMatch?: boolean;
}

export const LongestSubstringWithoutRepeatingCharactersVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set<string>();
  let l = 0;
  let res = 0;

  for (let r = 0; r < s.length; r++) {
    while (charSet.has(s[r])) {
      charSet.delete(s[l]);
      l++;
    }

    charSet.add(s[r]);
    res = Math.max(res, r - l + 1);
  }

  return res;
}`;

  const steps: Step[] = useMemo(() => {
    const sArray: Step[] = [];
    const s = "pwwkew";
    
    let l = 0;
    let res = 0;
    const charSet = new Set<string>();

    const snap = (msg: string, line: number, isMatch: boolean = false, overrideR: number | null = null) => {
      sArray.push({
        s,
        l: line > 3 ? l : null,
        r: overrideR,
        res,
        charSet: Array.from(charSet),
        message: msg,
        lineNumber: line,
        isMatch
      });
    };

    snap(`Execution parsing target substring input string. Memory mappings allocated natively.`, 1, false);
    
    snap(`Initialized active tracking Hash Set isolating character limits exclusively.`, 2, false);

    snap(`Bound Sliding Window structural constraints initiating lower boundary bounds 'l'.`, 3, false);

    snap(`Stored numerical accumulator dynamically mapping maximum constraints length!`, 4, false);

    for (let r = 0; r < s.length; r++) {
        snap(`Advancing window upper frontier boundary natively tracking string scan coordinate 'r'.`, 6, false, r);
        
        const currentChar = s[r];
        
        snap(`Evaluating window compliance checking set natively mapping '${currentChar}'.`, 7, false, r);
        
        while (charSet.has(s[r])) {
            snap(`Collision Detected! The active sliding window already contains '${s[r]}'! Loop Triggered.`, 7, true, r);
            
            const dropChar = s[l];
            charSet.delete(dropChar);
            snap(`Ejecting left-most boundary character '${dropChar}' out of isolated sliding hash set pool globally!`, 8, true, r);
            
            l++;
            snap(`Shrinking structural window limits bounding. Advancing boundary coordinate 'l' natively.`, 9, false, r);
            
            snap(`Re-evaluating collision status matching native constraint parameters.`, 7, false, r);
        }
        
        charSet.add(s[r]);
        snap(`Safe character evaluated securely mapping structural boundaries targeting '${s[r]}'! Adding to tracking pool.`, 12, true, r);
        
        res = Math.max(res, r - l + 1);
        snap(`Dynamically checked bounding string dimensions evaluating maximum numerical capacities. Value limits updated to [${res}].`, 13, false, r);
    }
    
    snap(`Traversed completely validating array sweep bounds securely. Final numerical boundaries generated.`, 16, true, null);

    return sArray;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
              Dynamic Variable Sliding Window Expansion
            </h3>
            
            <div className="flex flex-col items-center gap-1 p-4 mb-4 w-full">
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-6">
                {step.s.split('').map((char, index) => {
                  const isLeftPointer = step.l === index;
                  const isRightPointer = step.r === index;
                  
                  // Compute if this character is currently inside the active substring boundary conceptually
                  // Conceptually it is inside if l <= index <= r (or just below r if we haven't added it yet depending on exact step line)
                  const isInActiveWindow = step.l !== null && step.r !== null && index >= step.l && index <= step.r && !(step.lineNumber === 7 && isRightPointer && step.charSet.length < (step.r - step.l + 1));
                  
                  let cellStyle = "border-slate-300 bg-white text-slate-800 scale-100 opacity-60";
                  
                  if (isInActiveWindow && !(step.lineNumber >= 7 && step.lineNumber <= 9 && isRightPointer)) {
                      cellStyle = "border-primary bg-primary/10 text-primary scale-110 shadow-md font-bold";
                  }
                  
                  // Active collision
                  if (step.lineNumber >= 7 && step.lineNumber <= 9 && isRightPointer) {
                      cellStyle = "border-red-500 bg-red-100 text-red-900 scale-110 shadow-lg font-bold border-2";
                  }
                  
                  // Being evaluated safe
                  if (step.lineNumber >= 12 && isRightPointer) {
                      cellStyle = "border-green-500 bg-green-100 text-green-900 scale-110 shadow-md font-bold";
                  }
                  
                  // Left element being evaluated or dropped
                  if ((step.lineNumber === 8 || step.lineNumber === 9) && index === (step.lineNumber === 9 ? step.l! - 1 : step.l)) {
                      cellStyle = "border-orange-500 bg-orange-100 text-orange-900 scale-110 border-[3px] font-bold";
                  }

                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className="h-4 flex items-end justify-center font-bold text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                         {(isLeftPointer && isRightPointer) ? "L, R" : isLeftPointer ? "L" : isRightPointer ? "R" : ""}
                      </div>
                      
                      <div className={`w-8 h-8 flex items-center justify-center text-base tracking-tight transition-all duration-300 border ${cellStyle}`}>
                        {char}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-1 tracking-widest">Active Hash Set Memory (charSet)</span>
                <div className="flex flex-wrap gap-2 justify-center p-2 rounded bg-muted/30 w-full min-h-[48px]">
                   {step.charSet.length === 0 ? (
                       <span className="text-xs italic text-muted-foreground self-center">Set is natively empty</span>
                   ) : (
                       step.charSet.map((c, i) => (
                           <div key={i} className="w-8 h-8 flex items-center justify-center font-bold text-black border border-slate-400 rounded-full bg-slate-100 shadow-sm transition-all duration-300">
                              {c}
                           </div>
                       ))
                   )}
                </div>
            </div>
            
            <div className="flex gap-4 text-xs font-mono justify-center items-center flex-wrap pt-6 text-black">
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-100 border border-red-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <span className="font-bold text-[10px] uppercase tracking-wider text-black">Collision Target</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-orange-100 border border-orange-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                  <span className="font-bold text-[10px] uppercase tracking-wider text-black">Ejected Bounds</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-100 border border-green-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  <span className="font-bold text-[10px] uppercase tracking-wider text-black">Safe Evaluated</span>
              </div>
            </div>
          </Card>

          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : step?.lineNumber >= 7 && step?.lineNumber <= 9 ? <SplitSquareHorizontal className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Execution Detail Tracker
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step?.message || ''}
                </p>
              </div>
            </div>
          </Card>

          <VariablePanel
            variables={{
              "s": `"${step.s}"`,
              "charSet": `{${step.charSet.join(', ')}}`,
              "l": step.l !== null ? step.l : 'null',
              "r": step.r !== null ? step.r : 'null',
              "res": step.res
            }}
          />
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
            language="typescript"
          />
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