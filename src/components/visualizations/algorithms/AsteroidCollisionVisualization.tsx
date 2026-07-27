import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  asteroids: number[];
  activeIdx: number;
  stack: number[];
  collisionState: {
    colliding: boolean;
    a: number | null;
    top: number | null;
    result: 'top-explodes' | 'current-explodes' | 'both-explode' | null;
  };
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function asteroidCollision(asteroids: number[]): number[] {
    const stack: number[] = [];
    for (let a of asteroids) {
        while (stack.length > 0 && a < 0 && stack[stack.length - 1] > 0) {
            const diff = a + stack[stack.length - 1];
            if (diff < 0) {
                stack.pop();
            } else if (diff > 0) {
                a = 0;
            } else {
                stack.pop();
                a = 0;
            }
        }
        if (a !== 0) {
            stack.push(a);
        }
    }
    return stack;
}`,

  python: `def asteroidCollision(asteroids: list[int]) -> list[int]:
    stack = []
    for a in asteroids:
        while stack and a < 0 and stack[-1] > 0:
            diff = a + stack[-1]
            if diff < 0:
                stack.pop()
            elif diff > 0:
                a = 0
            else:
                a = 0
                stack.pop()
        if a != 0:
            stack.append(a)
    return stack`,

  java: `public static class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            while (!stack.isEmpty() && a < 0 && stack.peekLast() > 0) {
                int topAsteroid = stack.peekLast();
                int diff = a + topAsteroid;
                if (diff < 0) {
                    stack.removeLast();
                } else if (diff > 0) {
                    a = 0;
                } else {
                    stack.removeLast();
                    a = 0;
                }
            }
            if (a != 0) {
                stack.addLast(a);
            }
        }
        int[] result = new int[stack.size()];
        for (int i = result.length - 1; i >= 0; i--) {
            result[i] = stack.removeLast();
        }
        return result;
    }
}`,

  cpp: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> stack;
        for (int a : asteroids) {
            while (!stack.empty() && a < 0 && stack.back() > 0) {
                int diff = a + stack.back();
                if (diff < 0) {
                    stack.pop_back();
                } else if (diff > 0) {
                    a = 0;
                } else {
                    stack.pop_back();
                    a = 0;
                }
            }
            if (a != 0) {
                stack.push_back(a);
            }
        }
        return stack;
    }
};`,
};

function generateVisualizationData() {
  const asteroids = [10, 2, -5];
  const steps: Step[] = [];
  const stack: number[] = [];

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

  // 1. Initial State / Function call
  steps.push({
    asteroids,
    activeIdx: -1,
    stack: [...stack],
    collisionState: { colliding: false, a: null, top: null, result: null },
    variables: { asteroids: `[${asteroids.join(', ')}]`, stack: '[]' },
    explanation: "Given an array of asteroids, positive ones move right (→) and negative ones move left (←). When they meet, they collide and the smaller one explodes; if equal, both explode.",
    pseudoStep: `CALL asteroidCollision(asteroids)`
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize stack
  steps.push({
    asteroids,
    activeIdx: -1,
    stack: [...stack],
    collisionState: { colliding: false, a: null, top: null, result: null },
    variables: { asteroids: `[${asteroids.join(', ')}]`, stack: '[]' },
    explanation: "Initialize an empty stack to record the surviving asteroids.",
    pseudoStep: "SET stack = []"
  });
  addLines(2, 2, 3, 4);

  // --- Asteroid 10 ---
  // 3. Loop header for 10
  steps.push({
    asteroids,
    activeIdx: 0,
    stack: [...stack],
    collisionState: { colliding: false, a: 10, top: null, result: null },
    variables: { a: 10, stack: `[${stack.join(', ')}]` },
    explanation: "Examine next asteroid: 10 (moving right).",
    pseudoStep: "FOR a = 10"
  });
  addLines(3, 3, 4, 5);

  // 4. While check for 10
  steps.push({
    asteroids,
    activeIdx: 0,
    stack: [...stack],
    collisionState: { colliding: false, a: 10, top: null, result: null },
    variables: { a: 10, "stack.length > 0": false, stack: `[${stack.join(', ')}]` },
    explanation: "Since the stack is empty, there is no collision potential. Skip the collision loop.",
    pseudoStep: "WHILE stack is not empty AND a < 0 AND stack.top > 0  →  NO ✗"
  });
  addLines(4, 4, 5, 6);

  stack.push(10);

  // 5. Push 10
  steps.push({
    asteroids,
    activeIdx: 0,
    stack: [...stack],
    collisionState: { colliding: false, a: 10, top: null, result: null },
    variables: { a: 10, stack: `[${stack.join(', ')}]` },
    explanation: "Asteroid 10 survives and is pushed onto the stack.",
    pseudoStep: "IF a != 0  →  YES ✓  →  CALL stack.push(10)"
  });
  addLines(15, 13, 17, 17);

  // --- Asteroid 2 ---
  // 6. Loop header for 2
  steps.push({
    asteroids,
    activeIdx: 1,
    stack: [...stack],
    collisionState: { colliding: false, a: 2, top: null, result: null },
    variables: { a: 2, stack: `[${stack.join(', ')}]` },
    explanation: "Examine next asteroid: 2 (moving right).",
    pseudoStep: "FOR a = 2"
  });
  addLines(3, 3, 4, 5);

  // 7. While check for 2
  steps.push({
    asteroids,
    activeIdx: 1,
    stack: [...stack],
    collisionState: { colliding: false, a: 2, top: null, result: null },
    variables: { a: 2, "a < 0": false, stack: `[${stack.join(', ')}]` },
    explanation: "Asteroid 2 is moving right (a > 0), so it cannot collide with the asteroid ahead of it. Skip the collision loop.",
    pseudoStep: "WHILE stack is not empty AND a < 0 AND stack.top > 0  →  NO ✗"
  });
  addLines(4, 4, 5, 6);

  stack.push(2);

  // 8. Push 2
  steps.push({
    asteroids,
    activeIdx: 1,
    stack: [...stack],
    collisionState: { colliding: false, a: 2, top: null, result: null },
    variables: { a: 2, stack: `[${stack.join(', ')}]` },
    explanation: "Asteroid 2 survives and is pushed onto the stack.",
    pseudoStep: "IF a != 0  →  YES ✓  →  CALL stack.push(2)"
  });
  addLines(15, 13, 17, 17);

  // --- Asteroid -5 ---
  // 9. Loop header for -5
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: -5, top: null, result: null },
    variables: { a: -5, stack: `[${stack.join(', ')}]` },
    explanation: "Examine next asteroid: -5 (moving left).",
    pseudoStep: "FOR a = -5"
  });
  addLines(3, 3, 4, 5);

  // 10. While check for -5
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 2, result: null },
    variables: { a: -5, "stack.top": 2, "a < 0": true, "stack.top > 0": true, stack: `[${stack.join(', ')}]` },
    explanation: "Stack contains 2 (moving right), and current asteroid -5 moves left. A collision occurs!",
    pseudoStep: "WHILE stack is not empty AND a < 0 AND stack.top > 0  →  YES ✓"
  });
  addLines(4, 4, 5, 6);

  // 11. Diff calculation
  const diff1 = -5 + 2;
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 2, result: null },
    variables: { a: -5, "stack.top": 2, diff: diff1, stack: `[${stack.join(', ')}]` },
    explanation: "Compare sizes. Sum of sizes: -5 + 2 = -3.",
    pseudoStep: `SET diff = a + stack.top  →  -5 + 2 = -3`
  });
  addLines(5, 5, 7, 7);

  // 12. Check diff < 0 (top explodes)
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 2, result: 'top-explodes' },
    variables: { diff: diff1, "diff < 0": true, stack: `[${stack.join(', ')}]` },
    explanation: "Since diff is negative (-3), the left-moving asteroid (-5) is larger than the top asteroid (2). The top asteroid explodes.",
    pseudoStep: "IF diff < 0  →  YES ✓"
  });
  addLines(6, 6, 8, 8);

  stack.pop(); // pop 2

  // 13. Pop top
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: -5, top: null, result: null },
    variables: { a: -5, popped: 2, stack: `[${stack.join(', ')}]` },
    explanation: "Pop the destroyed asteroid 2 from the stack. The left-moving asteroid -5 continues.",
    pseudoStep: "CALL stack.pop()"
  });
  addLines(7, 7, 9, 9);

  // 14. Recheck while condition
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 10, result: null },
    variables: { a: -5, "stack.top": 10, stack: `[${stack.join(', ')}]` },
    explanation: "Stack contains 10 (moving right) and current asteroid is -5 (moving left). Another collision occurs!",
    pseudoStep: "WHILE stack is not empty AND a < 0 AND stack.top > 0  →  YES ✓"
  });
  addLines(4, 4, 5, 6);

  // 15. Diff calculation 2
  const diff2 = -5 + 10;
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 10, result: null },
    variables: { a: -5, "stack.top": 10, diff: diff2, stack: `[${stack.join(', ')}]` },
    explanation: "Compare sizes: -5 + 10 = 5.",
    pseudoStep: `SET diff = a + stack.top  →  -5 + 10 = 5`
  });
  addLines(5, 5, 7, 7);

  // 16. Check diff < 0
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 10, result: null },
    variables: { diff: diff2, "diff < 0": false, stack: `[${stack.join(', ')}]` },
    explanation: "Check if the left-moving asteroid is larger (diff < 0). It is not (5 is positive).",
    pseudoStep: "IF diff < 0  →  NO ✗"
  });
  addLines(6, 6, 8, 8);

  // 17. Check diff > 0 (current explodes)
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: true, a: -5, top: 10, result: 'current-explodes' },
    variables: { diff: diff2, "diff > 0": true, stack: `[${stack.join(', ')}]` },
    explanation: "Since diff is positive (5), the right-moving asteroid on the stack (10) is larger. The current asteroid (-5) explodes.",
    pseudoStep: "ELSE IF diff > 0  →  YES ✓"
  });
  addLines(8, 8, 10, 10);

  let a = 0;

  // 18. Set a = 0
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: 0, top: null, result: null },
    variables: { a: 0, stack: `[${stack.join(', ')}]` },
    explanation: "Mark current asteroid destroyed by setting a = 0.",
    pseudoStep: "SET a = 0"
  });
  addLines(9, 9, 11, 11);

  // 19. Recheck while condition (destroyed)
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: 0, top: null, result: null },
    variables: { a: 0, stack: `[${stack.join(', ')}]` },
    explanation: "The current asteroid is destroyed (a = 0), so collision checks stop.",
    pseudoStep: "WHILE stack is not empty AND a < 0 AND stack.top > 0  →  NO ✗"
  });
  addLines(4, 4, 5, 6);

  // 20. Push check
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: 0, top: null, result: null },
    variables: { a: 0, stack: `[${stack.join(', ')}]` },
    explanation: "The asteroid was destroyed (a = 0), so it is not added to the stack.",
    pseudoStep: "IF a != 0  →  NO ✗"
  });
  addLines(15, 13, 17, 17);

  // 21. Return statement
  steps.push({
    asteroids,
    activeIdx: 2,
    stack: [...stack],
    collisionState: { colliding: false, a: null, top: null, result: null },
    variables: { stack: `[${stack.join(', ')}]` },
    explanation: "All asteroids processed. Return the remaining asteroids on the stack: [10].",
    pseudoStep: `RETURN stack  →  [10]`
  });
  addLines(19, 15, 25, 21);

  return { steps, stepLineNumbers };
}

export const AsteroidCollisionVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getAsteroidSizeClass = (size: number) => {
    const absVal = Math.abs(size);
    if (absVal >= 10) return 'w-14 h-14 text-sm';
    if (absVal >= 5) return 'w-10 h-10 text-xs';
    return 'w-8 h-8 text-[10px]';
  };

  const getDirectionArrow = (size: number) => {
    return size > 0 ? '→' : '←';
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Asteroid Collision (Stack Logic)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              
              {/* Input Asteroids sequence */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Input Asteroid Track</h4>
                <div className="flex gap-4 justify-center items-center min-h-[70px]">
                  {currentStep.asteroids.map((ast, idx) => {
                    const isCurrent = currentStep.activeIdx === idx;
                    const sizeClass = getAsteroidSizeClass(ast);
                    const arrow = getDirectionArrow(ast);

                    let borderClass = 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-foreground opacity-50';
                    if (isCurrent) {
                      borderClass = ast > 0
                        ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300 scale-110 shadow-md ring-2 ring-orange-500/20 font-bold'
                        : 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 scale-110 shadow-md ring-2 ring-blue-500/20 font-bold';
                    } else if (idx < currentStep.activeIdx) {
                      borderClass = 'border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 opacity-20';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                        <div className={`flex flex-col items-center justify-center rounded-full border-2 transition-all duration-200 font-mono ${sizeClass} ${borderClass}`}>
                          <span>{ast > 0 ? `+${ast}` : ast}</span>
                          <span>{arrow}</span>
                        </div>
                        {isCurrent && <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collision Details Box */}
              {currentStep.collisionState.colliding && (
                <div className="mb-8 p-4 bg-red-500/5 border border-red-500/15 rounded-xl flex flex-col items-center justify-center gap-3 animate-pulse">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Collision Status</span>
                  
                  <div className="flex items-center gap-4">
                    {/* Top of stack asteroid */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Stack Top</span>
                      <div className={`flex flex-col items-center justify-center rounded-full border-2 border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300 font-mono font-bold ${getAsteroidSizeClass(currentStep.collisionState.top || 0)}`}>
                        <span>+{currentStep.collisionState.top}</span>
                        <span>→</span>
                      </div>
                    </div>

                    <span className="text-xl font-bold text-red-500">💥</span>

                    {/* Current moving asteroid */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Current</span>
                      <div className={`flex flex-col items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono font-bold ${getAsteroidSizeClass(currentStep.collisionState.a || 0)}`}>
                        <span>{currentStep.collisionState.a}</span>
                        <span>←</span>
                      </div>
                    </div>
                  </div>

                  {currentStep.collisionState.result && (
                    <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tight bg-red-500/10 px-2 py-0.5 rounded">
                      {currentStep.collisionState.result === 'top-explodes' && 'Stack Top Exploded ❌'}
                      {currentStep.collisionState.result === 'current-explodes' && 'Current Asteroid Exploded ❌'}
                    </div>
                  )}
                </div>
              )}

              {/* Stack visual representation */}
              <div className="flex flex-col items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Asteroid Stack</h4>
                
                {/* Horizontal row stack representing active asteroids */}
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl min-w-[200px] min-h-[80px] flex items-center justify-center p-4 gap-4 bg-muted/5 shadow-inner">
                  {currentStep.stack.length === 0 ? (
                    <span className="text-xs text-muted-foreground/30 italic text-center">Stack Empty (No Asteroids)</span>
                  ) : (
                    currentStep.stack.map((ast, idx) => {
                      const isTop = idx === currentStep.stack.length - 1;
                      const sizeClass = getAsteroidSizeClass(ast);
                      const arrow = getDirectionArrow(ast);

                      return (
                        <div
                          key={idx}
                          className={`relative flex flex-col items-center justify-center rounded-full border-2 font-mono ${sizeClass} ${
                            ast > 0 
                              ? 'border-orange-500 bg-orange-500/5 text-orange-700 dark:text-orange-300' 
                              : 'border-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-300'
                          } ${isTop ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                        >
                          <span>{ast > 0 ? `+${ast}` : ast}</span>
                          <span>{arrow}</span>
                          {isTop && (
                            <span className="absolute -top-6 text-[7px] font-black bg-zinc-200 dark:bg-zinc-800 text-foreground px-1 py-0.5 rounded tracking-tighter uppercase shadow-sm">Top</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            {/* Commentary box styled like the variable panel */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Commentary</h3>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </div>
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
          {/* Variable section below the editor as requested */}
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
