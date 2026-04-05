import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  dp: number[][];
  i: number | null;
  j: number | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const MatrixPathVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const m = 3;
  const n = 5; // Using a slightly smaller grid for better visibility

  const code = `function uniquePaths(m: number, n: number): number {
  let row = new Array(n).fill(1);
  for (let i = 0; i < m - 1; i++) {
    const newRow = new Array(n).fill(1);
    for (let j = n - 2; j >= 0; j--) {
      newRow[j] = newRow[j + 1] + row[j];
    }
    row = newRow;
  }
  return row[0];
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    let rowValues = new Array(n).fill(1);
    const displayGrid = Array.from({ length: m }, () => Array(n).fill(0));
    
    // Initial displayGrid setup (last row is all 1s from the start of the logic)
    for (let c = 0; c < n; c++) displayGrid[m - 1][c] = 1;

    stepsList.push({
      dp: displayGrid.map(r => [...r]),
      i: null,
      j: null,
      variables: { m, n },
      explanation: `Problem: Find unique paths from (0,0) to (${m - 1},${n - 1}). We use DP to track paths from the target back to the start.`,
      lineExecution: "function uniquePaths(m: number, n: number): number {",
      highlightedLines: [1]
    });

    stepsList.push({
      dp: displayGrid.map(r => [...r]),
      i: m - 1,
      j: null,
      variables: { "row.length": n, values: "all 1s" },
      explanation: "Initialize the base row (bottom-most) with 1s. This represents having 1 path to reach the target from any cell in the last row.",
      lineExecution: "let row = new Array(n).fill(1);",
      highlightedLines: [2]
    });

    for (let i = 0; i < m - 1; i++) {
      const currentRowIdx = m - 2 - i;
      const newRowValues = new Array(n).fill(1);
      displayGrid[currentRowIdx][n - 1] = 1;

      stepsList.push({
        dp: displayGrid.map(r => [...r]),
        i: currentRowIdx,
        j: n - 1,
        variables: { i, currentRowIdx, "newRow[last]": 1 },
        explanation: `Processing row ${currentRowIdx}. Initialize 'newRow' with 1s. The rightmost cell (column ${n-1}) always has only 1 edge path.`,
        lineExecution: "for (let i = 0; i < m - 1; i++) {\n  const newRow = new Array(n).fill(1);",
        highlightedLines: [3, 4]
      });

      for (let j = n - 2; j >= 0; j--) {
        const fromRight = newRowValues[j + 1];
        const fromBottom = rowValues[j];
        newRowValues[j] = fromRight + fromBottom;
        displayGrid[currentRowIdx][j] = newRowValues[j];

        stepsList.push({
          dp: displayGrid.map(r => [...r]),
          i: currentRowIdx,
          j,
          variables: { j, fromRight, fromBottom, "result": newRowValues[j] },
          explanation: `Calculate newRow[${j}]: Sum the paths from the right (${fromRight}) and bottom (${fromBottom}) to get ${newRowValues[j]}.`,
          lineExecution: "newRow[j] = newRow[j + 1] + row[j];",
          highlightedLines: [6]
        });
      }

      rowValues = [...newRowValues];
      stepsList.push({
        dp: displayGrid.map(r => [...r]),
        i: currentRowIdx,
        j: null,
        variables: { "updated_row": `[${rowValues.join(', ')}]` },
        explanation: `Row ${currentRowIdx} completed. We now replace the previous 'row' with our computed 'newRow' and move up.`,
        lineExecution: "row = newRow;",
        highlightedLines: [8]
      });
    }

    stepsList.push({
      dp: displayGrid.map(r => [...r]),
      i: 0,
      j: 0,
      variables: { result: rowValues[0] },
      explanation: `Finished! The total number of unique paths from (0,0) to bottom-right is stored in row[0], which is ${rowValues[0]}.`,
      lineExecution: "return row[0];",
      highlightedLines: [10]
    });

    return stepsList;
  }, [m, n]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Unique Paths (Bottom-Up DP Grid)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div 
                className="grid gap-2 mx-auto justify-center"
                style={{ 
                  gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                  width: "fit-content"
                }}
              >
                {step.dp.map((row, i) => (
                  row.map((val, j) => {
                    const isProcessing = i === step.i && j === step.j;
                    const isComputed = val > 0 && !isProcessing;
                    const isCurrentRow = i === step.i && step.j === null;
                    const isDependency = step.i !== null && step.j !== null && (
                        (i === step.i && j === step.j + 1) || (i === step.i + 1 && j === step.j)
                    );

                    return (
                      <div 
                        key={`${i}-${j}`} 
                        className={`w-12 h-14 flex flex-col items-center justify-center rounded-lg border-2 font-black transition-colors duration-0 shadow-sm ${
                          isProcessing ? "border-orange-500 bg-orange-100 text-black shadow-md scale-110 z-10" :
                          isDependency ? "border-blue-300 bg-blue-50 text-black" :
                          isCurrentRow ? "border-orange-200 bg-orange-50/30 text-black" :
                          isComputed ? "border-green-500 bg-green-100 text-black" :
                          "border-gray-100 bg-white text-gray-300"
                        }`}
                      >
                        {i === 0 && j === 0 && <span className="absolute -top-5 text-[8px] font-black text-primary uppercase">Start</span>}
                        {i === m-1 && j === n-1 && <span className="absolute -bottom-5 text-[8px] font-black text-red-600 uppercase">Target</span>}
                        <span className="text-lg">{val > 0 ? val : ""}</span>
                      </div>
                    );
                  })
                ))}
              </div>

              <div className="mt-10 flex gap-6 text-sm justify-center border-t border-dashed pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-100"></div>
                  <span className="text-[10px] font-bold uppercase text-black">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-300 bg-blue-50"></div>
                  <span className="text-[10px] font-bold uppercase text-black">Dependencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-100"></div>
                  <span className="text-[10px] font-bold uppercase text-black">Computed</span>
                </div>
              </div>
            </Card>
          </div>

          <div>
             <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                       Current Execution
                    </h4>
                    <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Commentary
                    </h4>
                    <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap text-black">
                       {step.explanation}
                    </p>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
           <div className="flex-1 overflow-hidden min-h-[400px]">
             <AnimatedCodeEditor
               code={code}
               language="typescript"
               highlightedLines={step.highlightedLines}
             />
           </div>
           
           <div className="p-1">
             <VariablePanel variables={step.variables} />
           </div>
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
