import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  pathWithSlash: string;
  idx: number;
  stack: string[];
  currentChar?: string;
  currentStr: string;
  action: string;
  explanation: string;
  pseudoStep: string;
  isComplete?: boolean;
  result?: string;
}

const languages: VisualizationLanguageMap = {
  python: `def simplifyPath(path: str) -> str:
    stack = []
    cur = ""
    for ch in path + "/":
        if ch == "/":
            if cur == "..":
                if stack:
                    stack.pop()
            elif cur != "" and cur != ".":
                stack.append(cur)
            cur = ""
        else:
            cur += ch
    return "/" + "/".join(stack)`,

  typescript: `function simplifyPath(path: string): string {
    const stack: string[] = [];
    let cur = "";
    for (const ch of path + "/") {
        if (ch === "/") {
            if (cur === "..") {
                if (stack.length > 0) {
                    stack.pop();
                }
            } else if (cur !== "" && cur !== ".") {
                stack.push(cur);
            }
            cur = "";
        } else {
            cur += ch;
        }
    }
    return "/" + stack.join("/");
}`,

  java: `public class Solution {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        StringBuilder currentComponentBuilder = new StringBuilder();
        for (char ch : (path + "/").toCharArray()) {
            if (ch == '/') {
                String component = currentComponentBuilder.toString();
                if (component.equals("..")) {
                    if (!stack.isEmpty()) {
                        stack.removeLast();
                    }
                } else if (!component.isEmpty() && !component.equals(".")) {
                    stack.addLast(component);
                }
                currentComponentBuilder = new StringBuilder();
            } else {
                currentComponentBuilder.append(ch);
            }
        }
        if (stack.isEmpty()) {
            return "/";
        }
        return "/" + String.join("/", stack);
    }
}`,

  cpp: `class Solution {
public:
    string simplifyPath(string path) {
        vector<string> stack;
        string cur_component = "";
        string full_path = path + "/";
        for (char ch : full_path) {
            if (ch == '/') {
                if (cur_component == "..") {
                    if (!stack.empty()) {
                        stack.pop_back();
                    }
                } else if (cur_component != "" && cur_component != ".") {
                    stack.push_back(cur_component);
                }
                cur_component = "";
            } else {
                cur_component += ch;
            }
        }
        string result = "";
        if (stack.empty()) {
            result = "/";
        } else {
            for (const string& dir : stack) {
                result += "/";
                result += dir;
            }
        }
        return result;
    }
};`
};

const generateSteps = (path: string) => {
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

  const stack: string[] = [];
  let cur = "";
  const pathWithSlash = path + "/";

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      pathWithSlash,
      idx: extra.hasOwnProperty('idx') ? extra.idx! : -1,
      stack: [...stack],
      currentChar: extra.currentChar,
      currentStr: extra.currentStr !== undefined ? extra.currentStr : cur,
      action: extra.action || "processing",
      explanation: msg,
      pseudoStep: pseudo,
      isComplete: extra.isComplete,
      result: extra.result,
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize an empty stack to track valid directory names.", "SET stack = [], cur = ''", 2, 2, 3, 4);

  for (let i = 0; i < pathWithSlash.length; i++) {
    const ch = pathWithSlash[i];
    
    // 2. Loop start
    addStep(`Iteration ${i}: Process character '${ch}'.`, `FOR ch IN path + "/" [i = ${i}]`, 4, 4, 5, 7, { idx: i, currentChar: ch, action: "loop" });

    // 3. Check if slash
    addStep(`Check if '${ch}' is a slash to end the current component.`, `IF ch == '/'`, 5, 5, 6, 8, { idx: i, currentChar: ch, action: "checking" });

    if (ch === "/") {
      const currentComponent = cur;
      
      // Java gets string from StringBuilder here
      if (currentComponent === "..") {
        addStep(`Component is '..'. Go up one directory if possible.`, `IF cur == '..'`, 6, 6, 8, 9, { idx: i, currentChar: ch, action: "evaluating component" });
        if (stack.length > 0) {
          addStep(`Stack is not empty. Pop the last directory from stack.`, `stack.pop()`, 8, 8, 10, 11, { idx: i, currentChar: ch, action: "popping" });
          stack.pop();
          addStep(`Directory popped from stack.`, `stack.pop()`, 8, 8, 10, 11, { idx: i, currentChar: ch, action: "popping" });
        } else {
            addStep(`Stack is empty. Cannot go up further, ignoring '..'.`, `IF stack: false`, 7, 7, 9, 10, { idx: i, currentChar: ch, action: "evaluating component" });
        }
      } else if (currentComponent !== "" && currentComponent !== ".") {
        addStep(`Component is '${currentComponent}', which is a valid directory. Add it to stack.`, `ELSE IF cur != "" AND cur != "."`, 10, 9, 12, 13, { idx: i, currentChar: ch, action: "evaluating component" });
        stack.push(currentComponent);
        addStep(`Push '${currentComponent}' onto the stack.`, `stack.append(cur)`, 11, 10, 13, 14, { idx: i, currentChar: ch, action: "pushing" });
      } else {
        addStep(`Component is '${currentComponent}' (empty or '.'). Ignore it.`, `ELSE IF cur != "" AND cur != "."`, 10, 9, 12, 13, { idx: i, currentChar: ch, action: "evaluating component" });
      }
      
      // Reset current component
      cur = "";
      addStep(`Reset current component string to empty for the next directory.`, `cur = ""`, 13, 11, 15, 16, { idx: i, currentChar: ch, action: "resetting" });

    } else {
      cur += ch;
      addStep(`Character is not a slash. Append '${ch}' to current component.`, `cur += ch`, 15, 13, 17, 18, { idx: i, currentChar: ch, action: "appending" });
    }
  }

  // Final Step: Join
  const finalPath = "/" + stack.join("/");
  addStep(`Processing complete. Join the stack elements with '/' and prepend with '/'.`, `RETURN "/" + "/".join(stack) → '${finalPath}'`, 18, 14, 23, 30, { 
    isComplete: true, 
    result: finalPath 
  });

  return { steps, stepLineNumbers };
};

export const SimplifyPathVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const testPath = "/home//foo/../";

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(testPath);
  }, [testPath]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-8 overflow-hidden">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 capitalize tracking-widest">Path with appended slash</h3>
              <div className="flex gap-1 overflow-x-auto pb-2">
                {currentStep.pathWithSlash.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`min-w-8 h-8 flex items-center justify-center rounded-md font-mono text-sm border-2 transition-all duration-200 ${idx === currentStep.idx
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] font-bold scale-105'
                      : idx < currentStep.idx
                        ? 'bg-muted border-transparent text-muted-foreground opacity-50'
                        : 'bg-card border-border text-foreground'
                      }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 capitalize tracking-widest">Current Component</h3>
              <div className="h-12 border-2 border-dashed border-border rounded-xl px-4 bg-muted/30 flex items-center justify-start">
                  <div className="font-mono text-primary font-bold text-lg tracking-widest">
                      {currentStep.currentStr === "" ? <span className="text-muted-foreground/50 italic text-sm">(empty)</span> : currentStep.currentStr}
                  </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-bold text-muted-foreground mb-4 capitalize tracking-widest">Directory Stack</h3>
              <div className="h-24 border-2 border-dashed border-border rounded-xl p-4 bg-muted/30 flex items-end justify-start overflow-x-auto">
                <AnimatePresence mode="popLayout">
                  {currentStep.stack.length > 0 ? (
                    <div className="flex gap-2 items-center">
                        <div className="text-primary font-bold mr-2 text-xl">/</div>
                      {currentStep.stack.map((item, idx) => (
                        <div key={`${idx}-${item}`} className="flex items-center gap-2">
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="px-3 py-1 flex items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold shadow-sm"
                            >
                            {item}
                            </motion.div>
                            {idx < currentStep.stack.length - 1 && <div className="text-primary font-bold text-xl">/</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-left text-sm text-muted-foreground italic self-center">
                      Stack is empty (at root /)
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {currentStep.isComplete && currentStep.result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 font-mono font-bold flex flex-col items-center justify-center gap-2 mt-6"
              >
                <div className="text-xs uppercase tracking-widest text-green-600/70 dark:text-green-400/70 font-sans">Final Canonical Path</div>
                <div className="text-xl">{currentStep.result}</div>
              </motion.div>
            )}
          </Card>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed text-muted-foreground border border-border">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>

        </div>
      }
      rightContent={
        <div className="flex flex-col gap-6">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel
            variables={{
              index: currentStep.idx === -1 ? 'None' : currentStep.idx,
              character: currentStep.currentChar === ' ' ? "' '" : currentStep.currentChar || 'None',
              currentComponent: currentStep.currentStr === "" ? "''" : `'${currentStep.currentStr}'`,
              stackSize: currentStep.stack.length,
              action: currentStep.action.charAt(0).toUpperCase() + currentStep.action.slice(1)
            }}
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
