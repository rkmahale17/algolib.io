import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface Step {
  n: number;
  edges: number[][];
  graph: Record<number, number[]>;
  visited: number[];
  currentNode: number | null;
  parent: number | null;
  neighbor: number | null;
  u: number | null;
  v: number | null;
  result: boolean | null;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
}

export const GraphValidTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function validTree(n: number, edges: number[][]): boolean {
  if (edges.length !== n - 1) return false;
  
  const graph: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) {
    graph.set(i, []);
  }

  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  
  const visited: Set<number> = new Set();
  
  function dfs(node: number, parent: number): void {
    visited.add(node);
    
    for (const neighbor of graph.get(node)!) {
      if (neighbor === parent) continue;
      if (visited.has(neighbor)) return;
      dfs(neighbor, node);
    }
  }
  
  dfs(0, -1);
  
  return visited.size === n;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const n = 5;
    const edges = [[0, 1], [0, 2], [0, 3], [1, 4]];
    
    const graphInstance: Map<number, number[]> = new Map();
    const visitedSet: Set<number> = new Set();
    let finalResult: boolean | null = null;
    
    const snap = (
      msg: string, line: number, isMatch: boolean = false,
      currentNode: number | null = null, parent: number | null = null, neighbor: number | null = null,
      u: number | null = null, v: number | null = null
    ) => {
      s.push({
        n,
        edges,
        graph: Object.fromEntries(graphInstance),
        visited: Array.from(visitedSet),
        currentNode, parent, neighbor, u, v,
        result: finalResult,
        message: msg,
        lineNumber: line,
        isMatch
      });
    };

    snap(`Begin validation. A valid tree must be connected and acyclic.`, 1, false);

    if (edges.length !== n - 1) {
      finalResult = false;
      snap(`Edge count (${edges.length}) must strictly equal n-1 (${n-1}) to be a valid tree.`, 2, true);
      return s;
    }
    snap(`Edge count strictly verifies n-1 condition (${edges.length} === ${n-1}). Valid!`, 2, true);

    snap(`Initialize Adjacency List for tracking graph bidirectional mappings.`, 4, false);
    for (let i = 0; i < n; i++) {
      graphInstance.set(i, []);
      snap(`Initialized node ${i} row to empty array.`, 6, false);
    }

    snap(`Looping through defined edges matrix to establish 2-way associations.`, 9, false);
    for (const [u, v] of edges) {
      graphInstance.get(u)!.push(v);
      graphInstance.get(v)!.push(u);
      snap(`Mapped bidirection Edge ${u} <-> ${v}`, 11, false, null, null, null, u, v);
    }

    snap(`Instantiate Visited tracking set memory bounds.`, 14, false);

    function dfsSim(node: number, parent: number): boolean {
      snap(`Invoked DFS search recursively handling Node [${node}]. Source Parent bounds tracking [${parent}].`, 16, false, node, parent);
      
      visitedSet.add(node);
      snap(`Tracked Node ${node} globally as visited preventing infinite cyclic recursion!`, 17, true, node, parent);

      const neighbors = graphInstance.get(node)!;
      for (let numIdx = 0; numIdx < neighbors.length; numIdx++) {
        const neighbor = neighbors[numIdx];
        snap(`Scanning downstream neighbor connection: [${neighbor}] extending from source Node [${node}].`, 20, false, node, parent, neighbor);
        
        if (neighbor === parent) {
          snap(`Neighbor ${neighbor} is our incoming direction Parent vertex. Bypassing recursion.`, 20, true, node, parent, neighbor);
          continue;
        }

        if (visitedSet.has(neighbor)) {
          snap(`DANGER: Visited cyclic loop overlap detected at ${neighbor}! Short circuit returning false!`, 21, true, node, parent, neighbor);
          return false;
        }
        
        snap(`Neighbor ${neighbor} natively verified as safe. Proceeding down branch.`, 22, false, node, parent, neighbor);
        const res = dfsSim(neighbor, node);
        if (!res) return false;
      }
      
      snap(`Terminating leaf processing bounds for ${node}. Branch successful!`, 23, true, node, parent);
      return true;
    }

    snap(`Commence root branch DFS targeting vertex [0]. Initiating cyclic tracing.`, 26, false);
    dfsSim(0, -1);

    finalResult = visitedSet.size === n;
    snap(`Final check: Traversed bounds mapping Size ${visitedSet.size} compared against Graph total nodes ${n}. Evaluation: ${finalResult}.`, 28, true);

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest text-center">
              Graph Topology & Processing
            </h3>
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-1/3">
                    <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-1 tracking-widest border-b pb-1">Set Memory (Visited)</span>
                    <div className="flex flex-wrap gap-2 justify-center p-2 rounded bg-muted/30">
                        {Array.from({ length: step.n }).map((_, i) => {
                            const isVisited = step.visited.includes(i);
                            return (
                                <div key={i} className={`w-8 h-8 flex items-center justify-center font-bold font-mono rounded transition-colors duration-300 ${isVisited ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-background text-muted-foreground border border-border'}`}>
                                    {i}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col w-2/3 border-l pl-4">
                    <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-2 tracking-widest border-b pb-1">Associations List (Adj)</span>
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
                                        {neighbors.length === 0 && <span className="text-[10px] italic text-muted-foreground">Empty</span>}
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

          <Card className="p-4 bg-card/50 border-primary/20 shadow-lg min-h-[80px] flex items-center">
             <div className="w-full">
                <span className="text-[10px] font-bold uppercase text-primary/70 tracking-widest block text-center mb-3">Edges Matrix Check</span>
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
                  Algorithm Tracker
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
              "Current Depth Context": step.currentNode !== null ? `node=${step.currentNode}, parent=${step.parent}` : 'Out of scope',
              edges_length: step.edges.length,
              required_edges: step.n - 1,
              visited_size: step.visited.length,
              graph_nodes: Object.keys(step.graph).length,
              result: step.result !== null ? step.result.toString() : 'Pending'
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
