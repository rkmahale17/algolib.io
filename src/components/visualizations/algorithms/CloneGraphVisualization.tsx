import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface NodeState {
  id: number;
  cloned: boolean;
  highlighted: boolean;
}

interface Step {
  originalNodes: NodeState[];
  clonedNodes: NodeState[];
  oldToNewKeys: number[];
  dfsStack: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CloneGraphVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `class Node {
  val: number
  neighbors: Node[]
  constructor(val?: number, neighbors?: Node[]) {
    this.val = val === undefined ? 0 : val
    this.neighbors = neighbors === undefined ? [] : neighbors
  }
}
function cloneGraph(node: Node | null): Node | null {
  const oldToNew = new Map<Node, Node>()
  function dfs(node: Node): Node {
    if (oldToNew.has(node)) {
      return oldToNew.get(node)!
    }
    const copy = new Node(node.val)
    oldToNew.set(node, copy)
    for (const nei of node.neighbors) {
      copy.neighbors.push(dfs(nei))
    }
    return copy
  }
  return node ? dfs(node) : null
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const adjList: Record<number, number[]> = {
      1: [2, 4],
      2: [1, 3],
      3: [2, 4],
      4: [1, 3]
    };
    
    const oldToNew = new Map<number, boolean>();
    const stack: number[] = [];

    const getStep = (explanation: string, lineExecution: string, highlightedLines: number[], currentId: number | null): Step => ({
      originalNodes: [1, 2, 3, 4].map(id => ({ id, cloned: oldToNew.has(id), highlighted: id === currentId })),
      clonedNodes: [1, 2, 3, 4].filter(id => oldToNew.has(id)).map(id => ({ id, cloned: true, highlighted: id === currentId })),
      oldToNewKeys: Array.from(oldToNew.keys()),
      dfsStack: [...stack],
      variables: { 
        node: currentId ? `node(${currentId})` : "null", 
        "oldToNew.size": oldToNew.size,
        stack: stack.join(" → ")
      },
      explanation,
      lineExecution,
      highlightedLines
    });

    stepsList.push(getStep("Given a reference to Node 1 in a cycle (1-2-3-4-1). Deep copy the entire graph.", "function cloneGraph(node: Node | null): Node | null {", [9], null));
    
    stepsList.push(getStep("Initialize a Map to store mappings between original nodes and their newly created clones.", "const oldToNew = new Map<Node, Node>()", [10], null));

    const solve = (id: number) => {
      stack.push(id);
      stepsList.push(getStep(`Enter dfs(node ${id}). Check if this node is already in our map.`, "function dfs(node: Node): Node {", [11], id));

      if (oldToNew.has(id)) {
        stepsList.push(getStep(`Node ${id} already cloned! Returning the existing clone from oldToNew map.`, "return oldToNew.get(node)!", [12, 13], id));
        stack.pop();
        return;
      }

      stepsList.push(getStep(`Node ${id} has not been seen. Creating a new cloned Node(${id}).`, "const copy = new Node(node.val)", [15], id));
      
      oldToNew.set(id, true);
      stepsList.push(getStep(`Storing mapping: original ${id} → clone ${id}. This prevents infinite cycles.`, "oldToNew.set(node, copy)", [16], id));

      for (const nei of adjList[id]) {
        stepsList.push(getStep(`Processing neighbor ${nei} of node ${id}.`, `for (const nei of node.neighbors) {`, [17], id));
        stepsList.push(getStep(`Call dfs for neighbor ${nei}.`, `copy.neighbors.push(dfs(nei))`, [18], id));
        solve(nei);
        stepsList.push(getStep(`Returned to node ${id}. Neighbor ${nei} processed and linked.`, `copy.neighbors.push(dfs(nei))`, [18], id));
      }

      stepsList.push(getStep(`Cloning complete for node ${id} and its neighbors. Returning clone.`, "return copy", [20], id));
      stack.pop();
    };

    solve(1);

    stepsList.push(getStep("Final clone of Node 1 returned. Deep copy complete.", "return node ? dfs(node) : null", [22], null));

    return stepsList;
  }, []);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 opacity-90">
              Clone Graph (DFS + Map)
            </h2>
            <Card className="p-4 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Original Graph */}
                <div className="border border-dashed border-gray-200 p-3 rounded-lg bg-muted/20">
                  <h4 className="text-[9px] font-bold uppercase text-muted-foreground mb-4 text-center">Original Graph</h4>
                  <div className="grid grid-cols-2 gap-4 justify-items-center relative">
                    {step.originalNodes.map((node) => (
                      <div 
                        key={node.id}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black transition-colors duration-0 ${
                          node.highlighted ? "border-orange-500 bg-orange-100 text-black shadow-md scale-110 z-10" :
                          node.cloned ? "border-blue-500 bg-blue-50 text-black" :
                          "border-gray-200 bg-white text-gray-400"
                        }`}
                      >
                        <span className="text-[11px]">{node.id}</span>
                        {node.id === 1 && <div className="absolute -top-3 text-[7px] font-bold text-primary uppercase">Start</div>}
                      </div>
                    ))}
                    {/* SVG Connections for a square graph */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                        <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="black" strokeWidth="1" />
                        <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="black" strokeWidth="1" />
                        <line x1="75%" y1="75%" x2="25%" y2="75%" stroke="black" strokeWidth="1" />
                        <line x1="25%" y1="75%" x2="25%" y2="25%" stroke="black" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Cloned Graph Nodes */}
                <div className="border border-dashed border-blue-200 p-3 rounded-lg bg-blue-50/30">
                  <h4 className="text-[9px] font-bold uppercase text-blue-600 mb-4 text-center">Cloned Nodes</h4>
                  <div className="grid grid-cols-2 gap-4 justify-items-center">
                    {[1, 2, 3, 4].map((id) => {
                      const clonedNode = step.clonedNodes.find(n => n.id === id);
                      return (
                        <div 
                          key={id}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black transition-colors duration-0 ${
                            clonedNode ? "border-green-500 bg-green-100 text-black shadow-sm" :
                            "border-dashed border-gray-100 bg-white text-transparent"
                          }`}
                        >
                          <span className="text-[11px]">{clonedNode ? id : ""}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {step.dfsStack.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed">
                  <h4 className="text-[8px] font-bold uppercase text-muted-foreground mb-2">Recursion Stack</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {step.dfsStack.map((id, pos) => (
                      <React.Fragment key={pos}>
                        <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold border border-blue-700/20 shadow-sm">
                          dfs({id})
                        </div>
                        {pos < step.dfsStack.length - 1 && <span className="text-gray-300 text-[8px] flex items-center">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div>
             <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Current Execution
                    </h4>
                    <div className="text-[11px] font-mono bg-background/80 p-1.5 rounded border border-border/50 shadow-sm inline-block">
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-0.5">
                       Commentary
                    </h4>
                    <p className="text-[12px] font-medium leading-tight text-foreground/90 whitespace-pre-wrap text-black">
                       {step.explanation}
                    </p>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4 flex flex-col h-full">
           <div className="flex-1 overflow-hidden min-h-[440px]">
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
