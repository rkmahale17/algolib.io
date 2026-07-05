import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
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
  explanation: string;
  isMatch?: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function validTree(n: number, edges: number[][]): boolean {
  if (n === 0) return true;
  const adj: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) adj.set(i, []);
  for (const [u, v] of edges) {
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }
  const visit = new Set<number>();
  function dfs(node: number, parent: number): boolean {
    if (visit.has(node)) return false;
    visit.add(node);
    for (const neighbor of adj.get(node)!) {
      if (neighbor === parent) continue;
      if (!dfs(neighbor, node)) return false;
    }
    return true;
  }
  return dfs(0, -1) && n === visit.size;
}`,

  python: `def validTree(n: int, edges: list[list[int]]) -> bool:
    if not n: return True
    adj = {i: [] for i in range(n)}
    for n1, n2 in edges:
        adj[n1].append(n2)
        adj[n2].append(n1)
    visit = set()
    def dfs(node: int, prev: int) -> bool:
        if node in visit: return False
        visit.add(node)
        for neighbor in adj[node]:
            if neighbor == prev: continue
            if not dfs(neighbor, node): return False
        return True
    return dfs(0, -1) and n == len(visit)`,

  java: `public static class Solution {
    public boolean validTree(int n, int[][] edges) {
        if (n == 0) return true;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] edge : edges) {
            adj.get(edge[0]).add(edge[1]);
            adj.get(edge[1]).add(edge[0]);
        }
        Set<Integer> visited = new HashSet<>();
        if (!dfs(0, -1, adj, visited)) return false;
        return visited.size() == n;
    }
    private boolean dfs(int node, int parent, List<List<Integer>> adj, Set<Integer> visited) {
        if (visited.contains(node)) return false;
        visited.add(node);
        for (int neighbor : adj.get(node)) {
            if (neighbor == parent) continue;
            if (!dfs(neighbor, node, adj, visited)) return false;
        }
        return true;
    }
}`,

  cpp: `class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if (n == 0) return true;
        vector<vector<int>> adj(n);
        for (const auto& edge : edges) {
            adj[edge[0]].push_back(edge[1]);
            adj[edge[1]].push_back(edge[0]);
        }
        unordered_set<int> visited;
        if (!dfs(0, -1, adj, visited)) return false;
        return visited.size() == n;
    }
private:
    bool dfs(int node, int parent, vector<vector<int>>& adj, unordered_set<int>& visited) {
        if (visited.count(node)) return false;
        visited.insert(node);
        for (int neighbor : adj[node]) {
            if (neighbor == parent) continue;
            if (!dfs(neighbor, node, adj, visited)) return false;
        }
        return true;
    }
};`
};

export const GraphValidTreeVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const n = 5;
    const edges = [[0, 1], [0, 2], [0, 3], [1, 4]];
    
    const graphInstance: Map<number, number[]> = new Map();
    const visitedSet: Set<number> = new Set();
    let finalResult: boolean | null = null;
    
    const makeSnapshot = (
      msg: string, 
      pseudo: string,
      ts: number, 
      py: number, 
      java: number, 
      cpp: number,
      isMatch: boolean = false,
      currentNode: number | null = null, 
      parent: number | null = null, 
      neighbor: number | null = null,
      u: number | null = null, 
      v: number | null = null
    ) => {
      s.push({
        n,
        edges,
        graph: Object.fromEntries(graphInstance),
        visited: Array.from(visitedSet),
        currentNode, parent, neighbor, u, v,
        result: finalResult,
        explanation: msg,
        isMatch,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    // Step 1: Start
    makeSnapshot("Start Graph Valid Tree validation. A valid tree must be connected and acyclic.", "START validTree(n, edges)", 1, 1, 2, 3);
    makeSnapshot("Check base case: if nodes count is 0, return true.", "IF n == 0 → NO ✗", 2, 2, 3, 4);

    // Step 3: Initialize adjacency list
    for (let i = 0; i < n; i++) {
      graphInstance.set(i, []);
    }
    makeSnapshot("Initialize adjacency list to represent nodes 0 to n-1.", "FOR i = 0 to n-1 → adj[i] = []", 4, 3, 5, 5);

    // Step 4: Populate edges
    for (const [u, v] of edges) {
      graphInstance.get(u)!.push(v);
      graphInstance.get(v)!.push(u);
    }
    makeSnapshot(
      `Populate adjacency list with bidirectional edges.`,
      `FOR [u, v] in edges → adj[u].add(v), adj[v].add(u)`,
      5, 4, 6, 6, true
    );

    // Step 5: Visited set
    makeSnapshot("Initialize visited set to keep track of visited nodes.", "SET visit = {}", 9, 7, 10, 10);

    function dfsSim(node: number, parent: number): boolean {
      const alreadyVisited = visitedSet.has(node);
      makeSnapshot(
        `DFS: check if Node ${node} is already visited.`,
        `IF node ${node} in visit → ${alreadyVisited ? "YES ✓" : "NO ✗"}`,
        11, 9, 15, 16, false, node, parent
      );

      if (alreadyVisited) {
        makeSnapshot(
          `DFS: Node ${node} has already been visited. Cycle detected! Return false.`,
          "RETURN false",
          11, 9, 15, 16, true, node, parent
        );
        return false;
      }

      visitedSet.add(node);
      makeSnapshot(
        `DFS: Mark Node ${node} as visited.`,
        `visit.add(${node})`,
        12, 10, 16, 17, true, node, parent
      );

      const neighbors = graphInstance.get(node) || [];
      for (const neighbor of neighbors) {
        makeSnapshot(
          `DFS: Process neighbor ${neighbor} of Node ${node}.`,
          `FOR neighbor of ${node} → neighbor = ${neighbor}`,
          13, 11, 17, 18, false, node, parent, neighbor
        );

        if (neighbor === parent) {
          makeSnapshot(
            `DFS: Neighbor ${neighbor} is the incoming parent node of ${node}. Skip it.`,
            `IF neighbor == parent → ${neighbor} == ${parent} → Skip`,
            14, 12, 18, 19, false, node, parent, neighbor
          );
          continue;
        }

        makeSnapshot(
          `DFS: Recursively call DFS for neighbor Node ${neighbor}.`,
          `CALL dfs(${neighbor}, ${node})`,
          15, 13, 19, 20, false, node, parent, neighbor
        );
        const res = dfsSim(neighbor, node);
        if (!res) return false;
      }

      makeSnapshot(`DFS: Finished visiting Node ${node} and all its subtrees. Return true.`, "RETURN true", 17, 14, 21, 22, true, node, parent);
      return true;
    }

    makeSnapshot("Start DFS traversal from root Node 0, with no parent (-1).", "CALL dfs(0, -1)", 19, 15, 11, 11);
    const dfsResult = dfsSim(0, -1);

    finalResult = dfsResult && visitedSet.size === n;
    makeSnapshot(
      `Check if DFS found no cycles (${dfsResult}) and all nodes were connected (${visitedSet.size} visited nodes == total ${n}). Result: ${finalResult}.`,
      `RETURN dfs(0, -1) AND size == n → ${finalResult}`,
      19, 15, 12, 12, true
    );

    return { steps: s, stepLineNumbers: stepLines };
  }, []);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
              Graph Topology & Visited Memory
            </h3>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/3">
                <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-2 tracking-widest border-b pb-1">Visited</span>
                <div className="flex flex-wrap gap-2 justify-center p-2 rounded-lg bg-muted/30">
                  {Array.from({ length: step.n }).map((_, i) => {
                    const isVisited = step.visited.includes(i);
                    const isCurrent = step.currentNode === i;
                    return (
                      <div 
                        key={i} 
                        className={`w-8 h-8 flex items-center justify-center font-bold font-mono rounded-lg transition-colors duration-300 ${
                          isCurrent ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold scale-105' :
                          isVisited ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/40' : 
                          'bg-background text-muted-foreground border border-border'
                        }`}
                      >
                        {i}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col w-2/3 border-l border-border/30 pl-4">
                <span className="text-[10px] font-bold text-center uppercase text-primary/70 mb-2 tracking-widest border-b pb-1">Adjacency List (Adj)</span>
                <div className="flex flex-col gap-2 p-1 overflow-y-auto max-h-[160px] custom-scrollbar">
                  {Object.entries(step.graph).map(([nodeStr, neighbors]) => {
                    const node = parseInt(nodeStr);
                    const isActiveNode = step.currentNode === node;
                    return (
                      <div key={node} className={`flex items-center gap-2 p-1 rounded-lg transition-colors ${isActiveNode ? 'bg-primary/10' : ''}`}>
                        <div className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded transition-all ${
                          isActiveNode ? 'bg-primary text-primary-foreground scale-105' : 'bg-muted border border-border text-foreground/80'
                        }`}>
                          {node}
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {neighbors.length === 0 && <span className="text-[10px] italic text-muted-foreground">Empty</span>}
                          {neighbors.map((n, idx) => {
                            const isTargetNeighbor = isActiveNode && step.neighbor === n;
                            return (
                              <div key={idx} className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-mono rounded transition-colors ${
                                isTargetNeighbor ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/50 scale-105' : 
                                'bg-background border border-border text-muted-foreground'
                              }`}>
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

          <Card className="p-6 bg-card/50 border-border/50 shadow-sm min-h-[80px] flex items-center">
            <div className="w-full">
              <span className="text-[10px] font-bold uppercase text-primary/70 tracking-widest block text-center mb-3">Edges Matrix</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {step.edges.map(([u, v], idx) => {
                  const isCurrentPair = step.u === u && step.v === v;
                  return (
                    <div 
                      key={idx} 
                      className={`font-mono text-xs px-2.5 py-1 rounded-md transition-colors border ${
                        isCurrentPair ? "bg-primary/20 text-primary border-primary/45" : "bg-muted/30 text-muted-foreground border-border"
                      }`}
                    >
                      [{u},{v}]
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  {step?.isMatch ? <CheckCircle2 className="w-4.5 h-4.5 text-primary" /> : <Info className="w-4.5 h-4.5 text-primary" />}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step?.explanation || ''}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              "Current Node Context": step.currentNode !== null ? `node=${step.currentNode}, parent=${step.parent}` : 'null',
              edges: step.edges.length,
              visited_size: step.visited.length,
              n: step.n,
              result: step.result !== null ? step.result.toString() : 'null'
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
