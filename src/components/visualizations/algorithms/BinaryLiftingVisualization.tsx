import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  up: number[][];
  depth: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  activeNodes: number[];
  phase: 'precompute' | 'kthAncestor' | 'lca' | 'done';
}

const LOG = 4;
const TREE: number[][] = [
  [1, 2],       // 0
  [0, 3, 4],    // 1
  [0, 5],       // 2
  [1],          // 3
  [1],          // 4
  [2, 6, 7],    // 5
  [5],          // 6
  [5]           // 7
];
const ROOT = 0;

const languages: VisualizationLanguageMap = {
  typescript: `const LOG = 4;
function binaryLifting(graph: number[][], root: number) {
  const n = graph.length;
  const up: number[][] = Array(n).fill(null).map(() => Array(LOG).fill(-1));
  const depth: number[] = Array(n).fill(0);
  function dfs(node: number, parent: number) {
    up[node][0] = parent;
    for (let j = 1; j < LOG; j++) {
      if (up[node][j - 1] !== -1) {
        up[node][j] = up[up[node][j - 1]][j - 1];
      }
    }
    for (const child of graph[node]) {
      if (child !== parent) {
        depth[child] = depth[node] + 1;
        dfs(child, node);
      }
    }
  }
  dfs(root, -1);
  function kthAncestor(node: number, k: number): number {
    for (let j = 0; j < LOG; j++) {
      if ((k & (1 << j)) !== 0) {
        node = up[node][j];
        if (node === -1) break;
      }
    }
    return node;
  }
  function lca(u: number, v: number): number {
    if (depth[u] < depth[v]) [u, v] = [v, u];
    let diff = depth[u] - depth[v];
    u = kthAncestor(u, diff);
    if (u === v) return u;
    for (let j = LOG - 1; j >= 0; j--) {
      if (up[u][j] !== up[v][j]) {
        u = up[u][j];
        v = up[v][j];
      }
    }
    return up[u][0];
  }
  return { up, depth, kthAncestor, lca };
}`,

  python: `import math
def solve_lca(graph, node=None, k=None, node1=None, node2=None):
    n = len(graph)
    LOG = 4
    up = [[-1] * LOG for _ in range(n)]
    depth = [0] * n
    def dfs(node, parent):
        up[node][0] = parent
        for j in range(1, LOG):
            if up[node][j - 1] != -1:
                up[node][j] = up[up[node][j - 1]][j - 1]
        for child in graph[node]:
            if child != parent:
                depth[child] = depth[node] + 1
                dfs(child, node)
    dfs(0, -1)
    def kth_ancestor(node, k):
        for j in range(LOG):
            if (k & (1 << j)) != 0:
                node = up[node][j]
                if node == -1: break
        return node
    def lca(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        u = kth_ancestor(u, diff)
        if u == v: return u
        for j in range(LOG - 1, -1, -1):
            if up[u][j] != up[v][j]:
                u = up[u][j]
                v = up[v][j]
        return up[u][0]
    if node is not None and k is not None:
        return kth_ancestor(node, k)
    elif node1 is not None and node2 is not None:
        return lca(node1, node2)
    return None`,

  java: `public static class Solution {
    static class TreeAncestor {
        private int[][] up;
        private int[] depth;
        private int LOG = 4;
        public TreeAncestor(int n, int[] parent) {
            up = new int[n][LOG];
            depth = new int[n];
            List<List<Integer>> graph = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                graph.add(new ArrayList<>());
            }
            for (int i = 0; i < n; i++) {
                if (parent[i] != -1) {
                    graph.get(i).add(parent[i]);
                    graph.get(parent[i]).add(i);
                }
                Arrays.fill(up[i], -1);
            }
            int root = 0;
            for (int i = 0; i < n; ++i) {
                if (parent[i] == -1) {
                    root = i;
                    break;
                }
            }
            dfs(root, -1, graph);
        }
        private void dfs(int node, int parent, List<List<Integer>> graph) {
            up[node][0] = parent;
            for (int j = 1; j < LOG; j++) {
                if (up[node][j - 1] != -1) {
                    up[node][j] = up[up[node][j - 1]][j - 1];
                }
            }
            for (int child = 0; child < graph.get(node).size(); child++) {
                int realChild = graph.get(node).get(child);
                if (realChild != parent) {
                    depth[realChild] = depth[node] + 1;
                    dfs(realChild, node, graph);
                }
            }
        }
        public int kthAncestor(int node, int k) {
            for (int j = 0; j < LOG; j++) {
                if ((k & (1 << j)) != 0) {
                    node = up[node][j];
                    if (node == -1) break;
                }
            }
            return node;
        }
        public int lca(int u, int v) {
            if (depth[u] < depth[v]) {
                int temp = u;
                u = v;
                v = temp;
            }
            int diff = depth[u] - depth[v];
            u = kthAncestor(u, diff);
            if (u == v) return u;
            for (int j = LOG - 1; j >= 0; j--) {
                if (up[u][j] != up[v][j]) {
                    u = up[u][j];
                    v = up[v][j];
                }
            }
            return up[u][0];
        }
    }
}`,

  cpp: `class Solution {
public:
class BinaryLifting {
private:
    int n, LOG = 4;
    vector<vector<int>> up;
    vector<int> depth;
    void dfs(int node, int parent, vector<vector<int>>& graph) {
        up[node][0] = parent;
        for (int j = 1; j < LOG; j++) {
            if (up[node][j - 1] != -1) {
                up[node][j] = up[up[node][j - 1]][j - 1];
            }
        }
        for (int child : graph[node]) {
            if (child != parent) {
                depth[child] = depth[node] + 1;
                dfs(child, node, graph);
            }
        }
    }
public:
    BinaryLifting(vector<vector<int>>& graph, int root = 0) {
        n = graph.size();
        up.assign(n, vector<int>(LOG, -1));
        depth.assign(n, 0);
        dfs(root, -1, graph);
    }
    int kthAncestor(int node, int k) {
        for (int j = 0; j < LOG; j++) {
            if ((k & (1 << j)) != 0) {
                node = up[node][j];
                if (node == -1) break;
            }
        }
        return node;
    }
    int lca(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        u = kthAncestor(u, diff);
        if (u == v) return u;
        for (int j = LOG - 1; j >= 0; j--) {
            if (up[u][j] != up[v][j]) {
                u = up[u][j];
                v = up[v][j];
            }
        }
        return up[u][0];
    }
};
};`,
};

export const BinaryLiftingVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const n = TREE.length;
    const up: number[][] = Array(n).fill(null).map(() => Array(LOG).fill(-1));
    const depth: number[] = Array(n).fill(0);

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

    const snap = (
      currentNode: number,
      activeEdge: [number, number] | null,
      explanation: string,
      pseudoStep: string,
      ts: number, py: number, java: number, cpp: number,
      variables: Record<string, any>,
      phase: Step['phase']
    ) => {
      s.push({
        up: up.map(row => [...row]), depth: [...depth],
        explanation,
        pseudoStep,
        variables,
        activeNodes: currentNode !== -1 ? [currentNode] : [],
        phase,
      });
      addLines(ts, py, java, cpp);
    };

    snap(
      -1, null,
      "Initialize binary lifting table 'up' and 'depth' array.",
      "SET up = Table(n, LOG), depth = Array(n).fill(0)",
      3, 3, 4, 34,
      { n, LOG, root: ROOT }, 'precompute'
    );

    const dfs = (node: number, parent: number) => {
      snap(
        node, null,
        `DFS visiting node ${node}. Set its immediate parent up[${node}][0] = ${parent}.`,
        `dfs(node = ${node}, parent = ${parent}) : SET up[${node}][0] = ${parent}`,
        6, 7, 33, 7,
        { node, parent, depth: depth[node] }, 'precompute'
      );

      up[node][0] = parent;

      for (let j = 1; j < LOG; j++) {
        snap(
          node, null,
          `Compute 2^${j}-th ancestor (up[${node}][${j}]) using dynamic programming.`,
          `FOR j = 1 to LOG-1`,
          8, 9, 34, 8,
          { node, j, '2^j': 1 << j, 'up[node][j-1]': up[node][j - 1] }, 'precompute'
        );

        if (up[node][j - 1] !== -1) {
          const midway = up[node][j - 1];
          const ancestor = up[midway][j - 1];
          up[node][j] = ancestor;
          snap(
            node, null,
            `up[${node}][${j}] = up[up[${node}][${j - 1}]][${j - 1}] = up[${midway}][${j - 1}] = ${ancestor}.`,
            `SET up[${node}][${j}] = up[${midway}][${j - 1}]  →  ${ancestor}`,
            10, 11, 36, 10,
            { node, j, midway, ancestor }, 'precompute'
          );
        }
      }

      for (const child of TREE[node]) {
        if (child !== parent) {
          depth[child] = depth[node] + 1;
          snap(
            node, null,
            `Recurse to child ${child}. Set depth[${child}] = depth[${node}] + 1 = ${depth[child]}.`,
            `IF child (${child}) != parent (${parent}): depth[${child}] = ${depth[child]}; CALL dfs(${child})`,
            13, 12, 39, 13,
            { node, child, 'depth[child]': depth[child] }, 'precompute'
          );
          dfs(child, node);
        }
      }
    };

    dfs(ROOT, -1);

    const kthAncestor = (node: number, k: number, isLcaCall = false): number => {
      let curr = node;
      const startNode = node;

      if (!isLcaCall) {
        snap(
          node, null,
          `kthAncestor(node=${node}, k=${k}): Start finding the ${k}-th ancestor.`,
          `CALL kthAncestor(node = ${node}, k = ${k})`,
          21, 17, 53, 38,
          { node, k }, 'kthAncestor'
        );
      }

      for (let j = 0; j < LOG; j++) {
        const bitSet = (k & (1 << j)) !== 0;
        snap(
          curr, null,
          `Checking if bit ${j} (value ${1 << j}) of k=${k} is set: ${bitSet ? 'YES' : 'NO'}.`,
          `FOR j = 0 to LOG-1: IF (k & 2^j (${1 << j})) != 0  →  ${bitSet ? 'YES' : 'NO'}`,
          22, 18, 54, 39,
          { curr, k, j, '2^j': 1 << j, bitSet }, isLcaCall ? 'lca' : 'kthAncestor'
        );

        if (bitSet) {
          const prev = curr;
          curr = up[curr][j];
          snap(
            curr, null,
            `Bit ${j} is set. Lift node from ${prev} to its 2^${j}-th ancestor: ${curr}.`,
            `SET node = up[node][j]  →  ${curr}`,
            24, 20, 55, 41,
            { curr, k, j, prev }, isLcaCall ? 'lca' : 'kthAncestor'
          );

          if (curr === -1) {
            snap(
              curr, null,
              `Reached beyond the root (null ancestor). Break.`,
              `IF node == -1  →  BREAK`,
              25, 21, 56, 42,
              { curr, k }, isLcaCall ? 'lca' : 'kthAncestor'
            );
            break;
          }
        }
      }

      if (!isLcaCall) {
        snap(
          curr, null,
          `Finished kthAncestor. The ${k}-th ancestor of ${startNode} is ${curr}.`,
          `RETURN node  →  ${curr}`,
          28, 22, 59, 45,
          { startNode, k, result: curr }, 'kthAncestor'
        );
      }
      return curr;
    };

    const lca = (u: number, v: number): number => {
      let currU = u;
      let currV = v;

      snap(
        u, null,
        `lca(u=${u}, v=${v}): Find the lowest common ancestor of ${u} and ${v}.`,
        `CALL lca(u = ${u}, v = ${v})`,
        30, 23, 62, 47,
        { u, v, 'depth[u]': depth[u], 'depth[v]': depth[v] }, 'lca'
      );

      if (depth[currU] < depth[currV]) {
        snap(
          currU, null,
          `depth[u] (${depth[currU]}) < depth[v] (${depth[currV]}). Swap u and v to keep depth[u] >= depth[v].`,
          `IF depth[u] < depth[v]: SWAP u, v`,
          31, 24, 63, 48,
          { u: currV, v: currU }, 'lca'
        );
        [currU, currV] = [currV, currU];
      }

      const diff = depth[currU] - depth[currV];
      if (diff > 0) {
        snap(
          currU, null,
          `Depths are different (diff=${diff}). Lift u up by ${diff} levels to align depths.`,
          `SET diff = depth[u] - depth[v] (${diff}); SET u = kthAncestor(u, diff)`,
          32, 26, 67, 50,
          { u: currU, v: currV, diff }, 'lca'
        );
        currU = kthAncestor(currU, diff, true);
      }

      if (currU === currV) {
        snap(
          currU, null,
          `u and v are now at the same node (${currU}). LCA is found.`,
          `IF u == v: RETURN u  →  ${currU}`,
          34, 28, 69, 51,
          { lca: currU }, 'lca'
        );
        return currU;
      }

      for (let j = LOG - 1; j >= 0; j--) {
        snap(
          currU, null,
          `Checking 2^${j}-th ancestors of u and v. up[u][${j}] = ${up[currU][j]}, up[v][${j}] = ${up[currV][j]}.`,
          `FOR j = LOG-1 down to 0: IF up[u][j] != up[v][j]`,
          35, 29, 70, 52,
          { u: currU, v: currV, j, 'up[u][j]': up[currU][j], 'up[v][j]': up[currV][j] }, 'lca'
        );

        if (up[currU][j] !== up[currV][j]) {
          const prevU = currU;
          const prevV = currV;
          currU = up[currU][j];
          currV = up[currV][j];
          snap(
            currU, null,
            `Ancestors are different. Lift both nodes up by 2^${j} to ${currU} and ${currV}.`,
            `SET u = up[u][j], v = up[v][j]  →  u = ${currU}, v = ${currV}`,
            37, 31, 72, 54,
            { u: currU, v: currV, j, prevU, prevV }, 'lca'
          );
        }
      }

      const result = up[currU][0];
      snap(
        result, null,
        `Ancestors are now equal. LCA is the immediate parent of u and v: up[u][0] = ${result}.`,
        `RETURN up[u][0]  →  ${result}`,
        41, 33, 76, 58,
        { u: currU, v: currV, result }, 'lca'
      );
      return result;
    };

    // Run some examples for the visualization
    kthAncestor(7, 3);
    lca(6, 4);

    snap(
      -1, null,
      `Binary Lifting visualization finished.`,
      `DONE`,
      43, 38, 76, 58,
      {}, 'done'
    );

    return { steps: s, stepLineNumbers };
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  // Tree layout calculation
  const treePositions = useMemo(() => {
    const positions: { x: number, y: number }[] = new Array(TREE.length);
    const calculatePos = (node: number, parent: number, x: number, y: number, width: number) => {
      positions[node] = { x, y };
      const children = TREE[node].filter(n => n !== parent);
      if (children.length === 0) return;
      const stepX = width / children.length;
      let startX = x - width / 2 + stepX / 2;
      children.forEach(child => {
        calculatePos(child, node, startX, y + 60, stepX);
        startX += stepX;
      });
    };
    calculatePos(ROOT, -1, 260, 40, 400);
    return positions;
  }, []);

  const treeEdges = useMemo(() => {
    const edges: { from: number, to: number }[] = [];
    const findEdges = (node: number, parent: number) => {
      TREE[node].forEach(child => {
        if (child !== parent) {
          edges.push({ from: node, to: child });
          findEdges(child, node);
        }
      });
    };
    findEdges(ROOT, -1);
    return edges;
  }, []);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
                Tree Structure &amp; Depths
              </h3>
              <svg viewBox="0 0 520 280" className="w-full h-auto">
                {treeEdges.map((edge, i) => (
                  <line
                    key={i}
                    x1={treePositions[edge.from].x}
                    y1={treePositions[edge.from].y}
                    x2={treePositions[edge.to].x}
                    y2={treePositions[edge.to].y}
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                ))}
                {treePositions.map((pos, i) => {
                  const isActive = currentStep.activeNodes.includes(i);
                  return (
                    <g key={i}>
                      <motion.circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isActive ? 22 : 18}
                        fill={isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.8)'}
                        stroke={isActive ? '#3b82f6' : '#475569'}
                        strokeWidth={isActive ? 3 : 2}
                        animate={{ r: isActive ? 22 : 18 }}
                      />
                      <text
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isActive ? '#3b82f6' : '#94a3b8'}
                        className="text-xs font-bold"
                      >
                        {i}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y + 25}
                        textAnchor="middle"
                        fill="#64748b"
                        className="text-[10px]"
                      >
                        d:{currentStep.depth[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </Card>

            <Card className="p-4 bg-card/50 border-primary/20 overflow-hidden mt-4">
              <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
                Binary Lifting Table (up[node][j])
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-border text-left">node \ j</th>
                      {Array.from({ length: LOG }).map((_, j) => (
                        <th key={j} className="p-2 border border-border text-center">2^{j}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentStep.up.map((row, i) => (
                      <tr key={i} className={currentStep.activeNodes.includes(i) ? 'bg-primary/10' : ''}>
                        <td className="p-2 border border-border font-bold">{i}</td>
                        {row.map((val, j) => (
                          <td key={j} className="p-2 border border-border text-center">
                            {val === -1 ? '-' : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
            </Card>
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
