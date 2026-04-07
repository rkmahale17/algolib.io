import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Info, CheckCircle2, Droplets } from 'lucide-react';

interface Step {
  r: number | null;
  c: number | null;
  count: number;
  grid: string[][];
  originalGrid: string[][];
  message: string;
  lineNumber: number;
  isMatch?: boolean;
}

export const NumberOfIslandsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function numIslands(grid: string[][]): number {
  if (grid.length === 0) return 0;
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(r: number, c: number) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') {
      return;
    }
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const gridRaw = [
      ['1', '1', '0'],
      ['0', '0', '0'],
      ['0', '0', '1']
    ];
    // Copy for mutating during sim
    const grid = gridRaw.map(r => [...r]);
    // Copy for visualization to track what is original land vs water vs submerged
    const originalGrid = gridRaw.map(r => [...r]);
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    const snapshot = (msg: string, line: number, r: number | null, c: number | null, isMatch: boolean = false) => {
      s.push({
         r, c, count,
         grid: grid.map(row => [...row]),
         originalGrid,
         message: msg,
         lineNumber: line,
         isMatch
      });
    };

    snapshot("Start Number of Islands algorithm.", 2, null, null);
    snapshot("Initialize count to 0.", 3, null, null);

    function dfs(r: number, c: number) {
      snapshot(`[DFS] Evaluate condition: bounds valid? cell === '1'?`, 8, r, c);
      
      if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') {
        snapshot(`[DFS] Condition failed (out of bounds or water). Return.`, 9, r, c);
        return;
      }
      
      grid[r][c] = '0';
      snapshot(`[DFS] Submerge land at (${r}, ${c}) to '0' to avoid loops.`, 11, r, c, true);

      snapshot(`[DFS] Explore Down from (${r}, ${c})`, 12, r, c);
      dfs(r + 1, c);
      
      snapshot(`[DFS] Explore Up from (${r}, ${c})`, 13, r, c);
      dfs(r - 1, c);
      
      snapshot(`[DFS] Explore Right from (${r}, ${c})`, 14, r, c);
      dfs(r, c + 1);
      
      snapshot(`[DFS] Explore Left from (${r}, ${c})`, 15, r, c);
      dfs(r, c - 1);
    }

    snapshot("Start scanning the grid row by row.", 18, null, null);
    for (let r = 0; r < rows; r++) {
      snapshot(`Outer Loop: Scanning row r=${r}`, 18, r, null);
      for (let c = 0; c < cols; c++) {
        snapshot(`Inner Loop: Visiting cell c=${c}`, 19, r, c);
        
        const isLand = grid[r][c] === '1';
        snapshot(`Evaluate: is grid[${r}][${c}] === '1'? ${isLand}`, 20, r, c);
        
        if (isLand) {
          count++;
          snapshot(`Found unexplored land '1' at (${r}, ${c})! Incrementing count to ${count}.`, 21, r, c, true);
          
          snapshot(`Initiating recursive DFS sink flow for this island.`, 22, r, c, true);
          dfs(r, c);
        }
      }
    }

    snapshot(`Execution Complete! Total distinct islands: ${count}`, 26, null, null, true);

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[400px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Droplets className="w-4 h-4 text-blue-500" /> Number of Islands
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border border-border/50 rounded-xl relative">
                <div className="z-10 m-2 space-y-3">
                  {step?.originalGrid && step.originalGrid.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const currentVal = step.grid[r][c]; // '1' or '0'
                        const isCurrent = step.r === r && step.c === c;
                        const isOriginalLand = val === '1';
                        // Submerged means it was 1 but now 0
                        const isSubmerged = isOriginalLand && currentVal === '0';
                        const isActiveLand = currentVal === '1';

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl border-2 transition-all duration-300 z-10 ${isCurrent ? 'scale-125 shadow-xl ring-4 ring-primary ring-offset-2 ring-offset-background z-20' : ''} ${isSubmerged ? 'bg-indigo-500/40 border-indigo-500/70 text-indigo-900 dark:text-indigo-200' : isActiveLand ? 'bg-green-500/40 border-green-500/70 text-green-900 dark:text-green-200' : 'bg-blue-500/20 border-blue-500/30 text-blue-900/50 dark:text-blue-200/50'}`}
                            >
                              {currentVal}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-3 opacity-70 font-mono font-bold tracking-wider">[{r},{c}]</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-600">
                 <div className="w-3 h-3 rounded bg-green-500/50"></div> Land (1)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600">
                 <div className="w-3 h-3 rounded bg-blue-500/50"></div> Water (0)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600">
                 <div className="w-3 h-3 rounded bg-indigo-500/50"></div> Sunk / Visited 
              </div>
            </div>
          </Card>

          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[120px] flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step?.message || ''}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
            language="typescript"
          />
          <VariablePanel
            variables={{
              row_r: step?.r ?? 'N/A',
              col_c: step?.c ?? 'N/A',
              islands_found: step?.count || 0
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
