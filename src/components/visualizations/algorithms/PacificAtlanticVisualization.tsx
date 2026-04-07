import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Info, CheckCircle2 } from 'lucide-react';

interface Step {
  r: number | null;
  c: number | null;
  pac: string[];
  atl: string[];
  message: string;
  lineNumber: number;
  res: number[][];
  isMatch?: boolean;
}

export const PacificAtlanticVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function pacificAtlantic(heights: number[][]): number[][] {
  const ROWS = heights.length;
  const COLS = heights[0].length;
  const pac = new Set<string>();
  const atl = new Set<string>();

  function dfs(r: number, c: number, visit: Set<string>, prevHeight: number) {
    const key = \`\${r},\${c}\`;
    if (visit.has(key) || r < 0 || c < 0 || r >= ROWS || c >= COLS || heights[r][c] < prevHeight) {
      return;
    }
    visit.add(key);
    dfs(r + 1, c, visit, heights[r][c]);
    dfs(r - 1, c, visit, heights[r][c]);
    dfs(r, c + 1, visit, heights[r][c]);
    dfs(r, c - 1, visit, heights[r][c]);
  }

  for (let c = 0; c < COLS; c++) {
    dfs(0, c, pac, heights[0][c]);
    dfs(ROWS - 1, c, atl, heights[ROWS - 1][c]);
  }

  for (let r = 0; r < ROWS; r++) {
    dfs(r, 0, pac, heights[r][0]);
    dfs(r, COLS - 1, atl, heights[r][COLS - 1]);
  }

  const res: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = \`\${r},\${c}\`;
      if (pac.has(key) && atl.has(key)) {
        res.push([r, c]);
      }
    }
  }
  return res;
}`;

  const heights = [[2, 1], [1, 2]];

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const ROWS = heights.length;
    const COLS = heights[0].length;
    const pac = new Set<string>();
    const atl = new Set<string>();
    const res: number[][] = [];

    const snapshot = (msg: string, line: number, r: number | null, c: number | null, isMatch: boolean = false) => {
      s.push({
        r, c,
        pac: Array.from(pac),
        atl: Array.from(atl),
        message: msg,
        lineNumber: line,
        res: [...res.map(x => [...x])],
        isMatch
      });
    };

    snapshot("Initialize ROWS=2, COLS=2", 2, null, null);
    snapshot("Initialize Pacific and Atlantic sets.", 4, null, null);

    function dfs(r: number, c: number, visitSet: 'pac' | 'atl', prevHeight: number) {
      const visit = visitSet === 'pac' ? pac : atl;
      const key = `${r},${c}`;

      if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return; // Silent skip for strict bounds 
      if (visit.has(key)) return; // Silent skip for visited to keep steps low

      // Meaningful check snapshot: when water can't flow uphill
      if (heights[r][c] < prevHeight) {
        snapshot(`Height ${heights[r][c]} < ${prevHeight}. Water can't flow uphill in reverse. Stop bounds at (${r}, ${c}).`, 9, r, c);
        return;
      }

      visit.add(key);
      snapshot(`Passed checks! Added (${r}, ${c}) to ${visitSet === 'pac' ? 'Pacific' : 'Atlantic'} ocean flow trace.`, 12, r, c, true);

      dfs(r + 1, c, visitSet, heights[r][c]);
      dfs(r - 1, c, visitSet, heights[r][c]);
      dfs(r, c + 1, visitSet, heights[r][c]);
      dfs(r, c - 1, visitSet, heights[r][c]);
    }

    snapshot("Iterate columns for top/bottom DFS starts.", 19, null, null);
    for (let c = 0; c < COLS; c++) {
      snapshot(`Start Pacific DFS from top row (0, ${c})`, 20, 0, c);
      dfs(0, c, 'pac', heights[0][c]);

      snapshot(`Start Atlantic DFS from bottom row (${ROWS - 1}, ${c})`, 21, ROWS - 1, c);
      dfs(ROWS - 1, c, 'atl', heights[ROWS - 1][c]);
    }

    snapshot("Iterate rows for left/right DFS starts.", 24, null, null);
    for (let r = 0; r < ROWS; r++) {
      snapshot(`Start Pacific DFS from left col (${r}, 0)`, 25, r, 0);
      dfs(r, 0, 'pac', heights[r][0]);

      snapshot(`Start Atlantic DFS from right col (${r}, ${COLS - 1})`, 26, r, COLS - 1);
      dfs(r, COLS - 1, 'atl', heights[r][COLS - 1]);
    }

    snapshot("Initialize result array.", 29, null, null);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = `${r},${c}`;
        snapshot(`Check intersection for cell (${r}, ${c})`, 33, r, c);
        if (pac.has(key) && atl.has(key)) {
          res.push([r, c]);
          snapshot(`Cell (${r}, ${c}) flows to BOTH! Adding to res.`, 34, r, c, true);
        }
      }
    }

    snapshot(`Execution complete! Returned ${JSON.stringify(res)}`, 38, null, null, true);

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[400px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              Grid Water Flow Simulation
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex flex-col gap-2 p-6 bg-muted/10 border border-border/50 rounded-xl relative">
                {/* Visual Ocean Borders */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500/80 rounded-t-xl" title="Pacific Boundary"></div>
                <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500/80 rounded-l-xl" title="Pacific Boundary"></div>
                
                <div className="absolute bottom-0 right-0 w-full h-1.5 bg-orange-500/80 rounded-b-xl" title="Atlantic Boundary"></div>
                <div className="absolute bottom-0 right-0 h-full w-1.5 bg-orange-500/80 rounded-r-xl" title="Atlantic Boundary"></div>

                <div className="z-10 m-2 mt-4 space-y-3">
                  {heights.map((row, r) => (
                    <div key={r} className="flex gap-3 justify-center">
                      {row.map((val, c) => {
                        const key = `${r},${c}`;
                        // Explicit safety check, fall back to empty array if step isn't initialized yet
                        const pacSet = step?.pac || [];
                        const atlSet = step?.atl || [];
                        
                        const isPac = pacSet.includes(key);
                        const isAtl = atlSet.includes(key);
                        const isBoth = isPac && isAtl;
                        const isCurrent = step?.r === r && step?.c === c;

                        return (
                          <div key={c} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 z-10 ${isCurrent ? 'scale-125 shadow-xl ring-4 ring-primary ring-offset-2 ring-offset-background z-20' : ''} ${isBoth ? 'bg-indigo-500/70 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : isPac ? 'bg-blue-500/40 border-blue-500/70 text-blue-900 dark:text-blue-200' : isAtl ? 'bg-orange-500/40 border-orange-500/70 text-orange-900 dark:text-orange-200' : 'bg-muted/50 border-border text-foreground'}`}
                            >
                              {val}
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-2 opacity-70 font-mono font-bold tracking-wider">[{r},{c}]</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600">
                 <div className="w-3 h-3 rounded bg-blue-500/50"></div> Pacific
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-600">
                 <div className="w-3 h-3 rounded bg-orange-500/50"></div> Atlantic
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600">
                 <div className="w-3 h-3 rounded bg-indigo-500/50"></div> Both
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
              pac_set_size: step?.pac?.length || 0,
              atl_set_size: step?.atl?.length || 0,
              res: JSON.stringify(step?.res || [])
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
