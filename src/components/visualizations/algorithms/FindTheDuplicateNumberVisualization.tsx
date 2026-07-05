import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { RefreshCw, HelpCircle } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  slow: number;
  fast: number;
  slow2: number | null;
  phase: 'init' | 'phase1' | 'phase2' | 'finished';
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findDuplicate(nums: number[]): number {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
  python: `def findDuplicate(nums):
    slow = 0
    fast = 0
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow2 = 0
    while True:
        slow = nums[slow]
        slow2 = nums[slow2]
        if slow == slow2:
            return slow`,
  java: `public static class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
  cpp: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0];
        int fast = nums[nums[0]];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        fast = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};`
};

export const FindTheDuplicateNumberVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const nums = useMemo(() => 
    caseType === 'case1' ? [1, 3, 4, 2, 2] : [3, 1, 3, 4, 2],
  [caseType]);

  const { steps, stepLineNumbers, positions, edges } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      slow: number,
      fast: number,
      slow2: number | null,
      phase: 'init' | 'phase1' | 'phase2' | 'finished',
      explanation: string,
      pseudo: string,
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        slow,
        fast,
        slow2,
        phase,
        explanation,
        pseudoStep: pseudo,
        variables: {
          slow,
          fast,
          ...(slow2 !== null ? { slow2 } : {}),
          phase
        }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // Node graph positioning parameters
    const case1Positions: Record<number, { x: number; y: number }> = {
      0: { x: 40, y: 120 },
      1: { x: 120, y: 120 },
      3: { x: 200, y: 120 },
      2: { x: 280, y: 70 },
      4: { x: 280, y: 170 }
    };
    const case1Edges = [
      [0, 1], [1, 3], [3, 2], [2, 4], [4, 2]
    ];

    const case2Positions: Record<number, { x: number; y: number }> = {
      0: { x: 40, y: 120 },
      3: { x: 120, y: 120 },
      4: { x: 200, y: 120 },
      2: { x: 280, y: 70 },
      1: { x: 280, y: 170 }
    };
    const case2Edges = [
      [0, 3], [3, 4], [4, 2], [2, 3], [1, 1]
    ];

    const activePositions = caseType === 'case1' ? case1Positions : case2Positions;
    const activeEdges = caseType === 'case1' ? case1Edges : case2Edges;

    // Simulation logic matching Floyd's Algorithm
    if (caseType === 'case1') {
      // nums = [1, 3, 4, 2, 2]
      // Init
      addStep(
        1, 1, null, 'init',
        "Initialize slow and fast pointers to the first node (index 0, value 1).",
        "SET slow = nums[0], fast = nums[0] (or slow=0, fast=0)",
        2, 2, 3, 4
      );

      // Phase 1 Iteration 1
      addStep(
        1, 1, null, 'phase1',
        "Floyd's Cycle Finding (Phase 1): Move slow one step and fast two steps. slow = nums[1] = 3, fast = nums[nums[1]] = nums[3] = 2.",
        "SET slow = nums[slow], fast = nums[nums[fast]]",
        5, 5, 6, 7
      );

      addStep(
        3, 2, null, 'phase1',
        "Check cycle intersection: slow (3) != fast (2). Keep traversing.",
        "WHILE slow != fast  →  3 != 2 (YES)",
        7, 7, 8, 6
      );

      // Phase 1 Iteration 2
      addStep(
        3, 2, null, 'phase1',
        "Move slow one step and fast two steps: slow = nums[3] = 2, fast = nums[nums[2]] = nums[4] = 2.",
        "SET slow = nums[slow], fast = nums[nums[fast]]",
        5, 5, 6, 7
      );

      addStep(
        2, 2, null, 'phase1',
        "Intersection detected! slow (2) == fast (2). Break loop.",
        "WHILE slow != fast  →  2 != 2 (NO)",
        7, 7, 8, 6
      );

      // Phase 2 Init
      addStep(
        1, 2, null, 'phase2',
        "Phase 2: Reset slow to the first node (index 0, value 1). Keep fast pointer where it met slow (2).",
        "SET slow = nums[0] (or slow2 = 0)",
        8, 9, 9, 10
      );

      // Phase 2 Iteration 1
      addStep(
        1, 2, null, 'phase2',
        "Verify if they meet: slow (1) != fast (2). Move both slow and fast pointers one step at a time.",
        "WHILE slow != fast  →  1 != 2 (YES)",
        9, 10, 10, 11
      );

      addStep(
        3, 4, null, 'phase2',
        "Move slow to nums[1] = 3, and fast to nums[2] = 4.",
        "SET slow = nums[slow], fast = nums[fast]",
        10, 11, 11, 12
      );

      // Phase 2 Iteration 2
      addStep(
        3, 4, null, 'phase2',
        "Verify if they meet: slow (3) != fast (4). Move both pointers one step.",
        "WHILE slow != fast  →  3 != 4 (YES)",
        9, 10, 10, 11
      );

      addStep(
        2, 2, null, 'phase2',
        "Move slow to nums[3] = 2, and fast to nums[4] = 2.",
        "SET slow = nums[slow], fast = nums[fast]",
        10, 11, 11, 12
      );

      // Phase 2 Finish
      addStep(
        2, 2, null, 'phase2',
        "Entrance to the cycle detected! slow (2) == fast (2). This meeting point is the duplicate number.",
        "WHILE slow != fast  →  2 != 2 (NO)",
        9, 10, 10, 11
      );

      addStep(
        2, 2, null, 'finished',
        "Return the duplicate number: 2.",
        "RETURN slow  →  2",
        13, 14, 14, 15
      );
    } else {
      // nums = [3, 1, 3, 4, 2]
      // Init
      addStep(
        3, 3, null, 'init',
        "Initialize slow and fast pointers to the first node (index 0, value 3).",
        "SET slow = nums[0], fast = nums[0] (or slow=0, fast=0)",
        2, 2, 3, 4
      );

      // Phase 1 Iteration 1
      addStep(
        3, 3, null, 'phase1',
        "Floyd's Cycle Finding (Phase 1): Move slow one step and fast two steps: slow = nums[3] = 4, fast = nums[nums[3]] = nums[4] = 2.",
        "SET slow = nums[slow], fast = nums[nums[fast]]",
        5, 5, 6, 7
      );

      addStep(
        4, 2, null, 'phase1',
        "Check cycle intersection: slow (4) != fast (2). Keep traversing.",
        "WHILE slow != fast  →  4 != 2 (YES)",
        7, 7, 8, 6
      );

      // Phase 1 Iteration 2
      addStep(
        4, 2, null, 'phase1',
        "Move slow one step and fast two steps: slow = nums[4] = 2, fast = nums[nums[2]] = nums[3] = 4.",
        "SET slow = nums[slow], fast = nums[nums[fast]]",
        5, 5, 6, 7
      );

      addStep(
        2, 4, null, 'phase1',
        "Check cycle intersection: slow (2) != fast (4). Keep traversing.",
        "WHILE slow != fast  →  2 != 4 (YES)",
        7, 7, 8, 6
      );

      // Phase 1 Iteration 3
      addStep(
        2, 4, null, 'phase1',
        "Move slow one step and fast two steps: slow = nums[2] = 3, fast = nums[nums[4]] = nums[2] = 3.",
        "SET slow = nums[slow], fast = nums[nums[fast]]",
        5, 5, 6, 7
      );

      addStep(
        3, 3, null, 'phase1',
        "Intersection detected! slow (3) == fast (3). Break loop.",
        "WHILE slow != fast  →  3 != 3 (NO)",
        7, 7, 8, 6
      );

      // Phase 2 Init
      addStep(
        3, 3, null, 'phase2',
        "Phase 2: Reset slow to the first node (index 0, value 3). Keep fast pointer at 3.",
        "SET slow = nums[0] (or slow2 = 0)",
        8, 9, 9, 10
      );

      // Phase 2 Iteration 1
      addStep(
        3, 3, null, 'phase2',
        "Entrance to the cycle detected immediately! slow (3) == fast (3). This is the duplicate number.",
        "WHILE slow != fast  →  3 != 3 (NO)",
        9, 10, 10, 11
      );

      addStep(
        3, 3, null, 'finished',
        "Return the duplicate number: 3.",
        "RETURN slow  →  3",
        13, 14, 14, 15
      );
    }

    return { steps: generatedSteps, stepLineNumbers: lines, positions: activePositions, edges: activeEdges };
  }, [caseType]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderGraph = () => {
    const nodeIds = Object.keys(positions).map(Number);

    return (
      <div className="w-full aspect-[400/220] relative bg-card/60 backdrop-blur rounded-xl border border-border/50 shadow-sm flex items-center justify-center p-4">
        <svg viewBox="0 0 400 220" className="w-full h-full overflow-visible">
          <defs>
            <marker 
              id="arrow" 
              viewBox="0 0 10 10" 
              refX="28" 
              refY="5" 
              markerWidth="6" 
              markerHeight="6" 
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-muted-foreground/80" />
            </marker>
          </defs>

          {/* Edges with arrows */}
          {edges.map(([u, v], i) => {
            const from = positions[u];
            const to = positions[v];
            if (u === v) {
              return (
                <path
                  key={i}
                  d={`M ${from.x - 10} ${from.y - 15} C ${from.x - 30} ${from.y - 40}, ${from.x + 30} ${from.y - 40}, ${from.x + 10} ${from.y - 15}`}
                  fill="none"
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              );
            }
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="currentColor" className="text-border" strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            );
          })}
          
          {/* Nodes */}
          {nodeIds.map(id => {
            const isSlow = id === step.slow;
            const isFast = id === step.fast;

            let fill = 'hsl(var(--card))';
            let stroke = 'hsl(var(--border))';
            let textColor = 'fill-foreground';

            if (isSlow && isFast) {
              fill = 'rgba(147, 51, 234, 0.2)';
              stroke = 'rgb(147, 51, 234)';
            } else if (isSlow) {
              fill = 'rgba(249, 115, 22, 0.2)';
              stroke = 'rgb(249, 115, 22)';
            } else if (isFast) {
              fill = 'rgba(59, 130, 246, 0.2)';
              stroke = 'rgb(59, 130, 246)';
            }

            return (
              <g key={id}>
                <circle
                  cx={positions[id].x} cy={positions[id].y} r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className="transition-colors duration-200"
                />
                <text
                  x={positions[id].x} y={positions[id].y + 5} textAnchor="middle"
                  className={`text-[12px] font-bold select-none \${textColor} transition-colors duration-200`}
                >
                  {id}
                </text>
                
                <text
                  x={positions[id].x} y={positions[id].y - 24} textAnchor="middle"
                  className="text-[9px] font-bold fill-muted-foreground"
                >
                  {`val: ${nums[id]}`}
                </text>

                {isSlow && (
                  <text
                    x={positions[id].x - 22} y={positions[id].y + 24}
                    className="text-[8px] font-black fill-orange-500 uppercase tracking-tighter"
                  >
                    Slow
                  </text>
                )}
                {isFast && (
                  <text
                    x={positions[id].x + 10} y={positions[id].y + 24}
                    className="text-[8px] font-black fill-blue-500 uppercase tracking-tighter"
                  >
                    Fast
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <div className="flex items-center gap-4 w-full justify-between">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleCaseToggle('case1')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case1' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: [1,3,4,2,2]
            </button>
            <button
              onClick={() => handleCaseToggle('case2')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case2' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: [3,1,3,4,2]
            </button>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 mb-2">
            <RefreshCw size={16} className="text-primary animate-spin-slow" />
            <span>Floyd&apos;s Cycle Detection (Tortoise and Hare)</span>
          </div>

          {renderGraph()}

          <Card className="p-4 bg-muted/50 border-l-4 border-l-primary shadow-sm">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Commentary:</div>
              <div className="text-[13px] text-foreground/90 pt-1 leading-relaxed">
                {step.explanation}
              </div>
            </div>
          </Card>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-2.5">
            <HelpCircle size={16} className="text-primary shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-normal">
              <strong>How it works:</strong> We treat the array elements as pointers. Since a duplicate exists, multiple indices point to the same destination, creating a cycle. Slow moves 1 step; Fast moves 2 steps. After they meet (Phase 1), resetting slow to index 0 and moving both at the same speed (Phase 2) identifies the duplicate number at the cycle entrance.
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
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <VariablePanel variables={step.variables} />
        </div>
      }
    />
  );
};
export default FindTheDuplicateNumberVisualization;
