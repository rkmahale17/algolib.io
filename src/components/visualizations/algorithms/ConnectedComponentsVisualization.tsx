import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface Step {
  n: number;
  edges: number[][];
  graph: Record<number, number[]>;
  visited: number[];
  count: number;
  currentNode: number | null;
  neighbor: number | null;
  u: number | null;
  v: number | null;
  outerLoopIndex: number | null;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
}

export const ConnectedComponentsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function countComponents(n: number, edges: number[][]): number {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    adj.set(i, []);
  }

  for (const [u, v] of edges) {
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }

  const visited = new Set<number>();
  let count = 0;

  function dfs(node: number) {
    visited.add(node);
    for (const neighbor of adj.get(node)!) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      count++;
      dfs(i);
    }
  }

  return count;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const n = 5;
    const edges = [[0, 1], [1, 2], [3, 4]];
    
    const adjMap: Map<number, number[]> = new Map();
    const visitedSet: Set<number> = new Set();
    let compCount = 0;
    
    const snap = (
      msg: string, line: number, isMatch: boolean = false,
      currentNode: number | null = null, neighbor: number | null = null,
      outerLoopIndex: number | null = null, u: number | null = null, v: number | null = null
    ) => {
      s.push({
        n,
        edges,
        graph: Object.fromEntries(Array.from(adjMap.entries()).map(([k, v]) => [k, [...v]])),
        visited: Array.from(visitedSet),
        count: compCount,
        currentNode, neighbor, u, v, outerLoopIndex,
        message: msg,
        lineNumber: line,
        isMatch
      });
    };

    snap(`Begin counting isolated connected components. Creating Empty Mapping.`, 2, false);

    snap(`Initializing Adjacency Mapping Arrays.`, 3, false);
    for (let i = 0; i < n; i++) {
      adjMap.set(i, []);
      snap(`Initialized mapped bucket for node ${i}.`, 4, false);
    }

    snap(`Binding raw edge arrays into a bilateral indexed map.`, 7, false);
    for (const [u, v] of edges) {
      adjMap.get(u)!.push(v);
      adjMap.get(v)!.push(u);
      snap(`Bounded isolated two-way edge ${u} <-> ${v}`, 9, false, null, null, null, u, v);
    }

    snap(`Initialized isolated visited memory. Start component counter at 0.`, 12, false);

    function dfsSim(node: number) {
      snap(`Invoked deep search on Node [${node}] traversing entire local component bounds.`, 15, false, node);
      
      visitedSet.add(node);
      snap(`Node [${node}] added to globally accessible visited Set.`, 16, true, node);

      const neighbors = adjMap.get(node)!;
      for (let numIdx = 0; numIdx < neighbors.length; numIdx++) {
        const neighbor = neighbors[numIdx];
        snap(`Analyzing outbound edge to Node [${neighbor}] from Node [${node}].`, 17, false, node, neighbor);
        
        if (!visitedSet.has(neighbor)) {
          snap(`Node ${neighbor} is unvisited! Branching recursive deep search.`, 18, true, node, neighbor);
          dfsSim(neighbor);
        } else {
          snap(`Node ${neighbor} has already been touched. Returning to prevent infinite looping.`, 17, false, node, neighbor);
        }
      }
      
      snap(`Exhausted adjacent boundaries for Node [${node}].`, 21, true, node);
    }

    snap(`Beginning complete outer sweep. Linearly checking Node indices 0 -> ${n - 1}.`, 24, false);
    for (let i = 0; i < n; i++) {
      snap(`Outer Sweep Node Check: Evaluated base condition on Node [${i}]`, 25, false, null, null, i);
      if (!visitedSet.has(i)) {
        compCount++;
        snap(`Node [${i}] is previously untouched! This constitutes the founding of a new Connected Component bounds! Incremented counter to ${compCount}.`, 26, true, null, null, i);
        dfsSim(i);
        snap(`Successfully mapped all edges in Component limits. Resuming outer sweep scan.`, 28, false, null, null, i);
      } else {
         snap(`Node [${i}] was previously consumed by an existing mapping cluster. Ignoring outer sweep.`, 25, false, null, null, i);
      }
    }

    snap(`Sweep terminated. Total isolated connected components analyzed statically: ${compCount}.`, 31, true);

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest text-center">
              Graph Analysis Mapping
            </h3>
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/3 border-r pr-4">
                    <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-1 tracking-widest border-b pb-1">Traversal History</span>
                    <div className="flex flex-wrap gap-2 justify-center p-2 rounded bg-muted/30">
                        {Array.from({ length: step.n }).map((_, i) => {
                            const isVisited = step.visited.includes(i);
                            const isOuterChecking = step.outerLoopIndex === i;
                            return (
                                <div key={i} className={`w-8 h-8 flex items-center justify-center font-bold font-mono rounded transition-colors duration-300 ${isVisited ? 'bg-green-500/20 text-green-500 border border-green-500/50' : isOuterChecking ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-background text-muted-foreground border border-border'}`}>
                                    {i}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col w-2/3">
                    <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-2 tracking-widest border-b pb-1">Undirected Adjacency Array (Adj)</span>
                    <div className="flex flex-col gap-2 p-1 overflow-y-auto max-h-[160px] custom-scrollbar">
                        {Object.entries(step.graph).map(([nodeStr, neighbors]) => {
                            const node = parseInt(nodeStr);
                            const isActiveNode = step.currentNode === node;
                            return (
                                <div key={node} className={`flex items-center gap-2 p-1 rounded transition-colors ${isActiveNode ? 'bg-primary/10' : ''}`}>
                                    <div className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded transition-all ${isActiveNode ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted border border-border text-foreground/80'}`}>
                                        {node}
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                    <div className="flex flex-wrap gap-1">
                                        {neighbors.length === 0 && <span className="text-[10px] italic text-muted-foreground mt-1">Empty</span>}
                                        {neighbors.map((n, idx) => {
                                            const isTargetNeighbor = isActiveNode && step.neighbor === n;
                                            return (
                                                <div key={idx} className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-mono rounded transition-colors ${isTargetNeighbor ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50 scale-110' : 'bg-background border border-border text-muted-foreground'}`}>
                                                    {n}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-primary/20 shadow-lg flex items-center">
             <div className="w-full">
                <span className="text-[10px] font-bold uppercase text-primary/70 tracking-widest block text-center mb-3">BiDirectional Edges Processing</span>
                <div className="flex flex-wrap gap-2 justify-center">
                    {step.edges.map(([u, v], idx) => {
                        const isCurrentPair = step.u === u && step.v === v;
                        return (
                            <div key={idx} className={`font-mono text-xs px-2 py-1 rounded transition-colors border ${isCurrentPair ? "bg-primary/20 text-primary border-primary/50" : "bg-muted/30 text-muted-foreground border-border"}`}>
                                [{u},{v}]
                            </div>
                        )
                    })}
                </div>
             </div>
          </Card>

          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
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
              "Current Context": step.currentNode !== null ? `Traversing connected node=${step.currentNode}` : step.outerLoopIndex !== null ? `Checking unconnected outer sweep node=${step.outerLoopIndex}` : 'Global Graph Build',
              Target_Neighbor: step.neighbor !== null ? `Examining [${step.neighbor}]` : 'N/A',
              Edges_Total: step.edges.length,
              Visited_Memory_Size: step.visited.length,
              count: step.count
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
