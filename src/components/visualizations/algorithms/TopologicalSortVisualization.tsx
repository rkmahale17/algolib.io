import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { motion } from "framer-motion";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  currentNode: number | null;
  inDegree: number[];
  queue: number[];
  result: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  activeNode: number | null;
}

const languages: VisualizationLanguageMap = {
  typescript: `function topologicalSort(graph: Map<number, number[]>): number[] {
  const indegrees: number[] = new Array(graph.size).fill(0);
  for (const node of graph.keys()) {
    for (const neighbor of graph.get(node) || []) {
      indegrees[neighbor]++;
    }
  }
  const queue: number[] = [];
  for (let i = 0; i < graph.size; i++) {
    if (indegrees[i] === 0) {
      queue.push(i);
    }
  }
  const result: number[] = [];
  while (queue.length > 0) {
    const node: number = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) || []) {
      indegrees[neighbor]--;
      if (indegrees[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  if (result.length !== graph.size) {
    return [];
  }
  return result;
}`,
  python: `from collections import deque
def topological_sort(graph: dict[int, list[int]]) -> list[int]:
    indegrees = [0] * len(graph)
    for node in graph:
        for neighbor in graph[node]:
            indegrees[neighbor] += 1
    queue = deque([node for node in graph if indegrees[node] == 0])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegrees[neighbor] -= 1
            if indegrees[neighbor] == 0:
                queue.append(neighbor)
    if len(result) != len(graph):
        return []
    return result`,
  java: `import java.util.*;
public static class Solution {
  public int[] topologicalSort(Map<Integer, List<Integer>> graph) {
    int numNodes = graph.size();
    int[] indegrees = new int[numNodes];
    for (int node : graph.keySet()) {
      for (int neighbor : graph.get(node) != null ? graph.get(node) : new ArrayList<>()) {
        indegrees[neighbor]++;
      }
    }
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numNodes; i++) {
      if (indegrees[i] == 0) {
        queue.offer(i);
      }
    }
    int[] result = new int[numNodes];
    int index = 0;
    while (!queue.isEmpty()) {
      int node = queue.poll();
      result[index++] = node;
      if (graph.containsKey(node)) {
        for (int neighbor : graph.get(node)) {
          indegrees[neighbor]--;
          if (indegrees[neighbor] == 0) {
            queue.offer(neighbor);
          }
        }
      }
    }
    if (index != numNodes) {
      return new int[0];
    }
    return result;
  }
}`,
  cpp: `#include <vector>
#include <queue>
using namespace std;
class Solution {
public:
  vector<int> topologicalSort(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> inDegree(numCourses, 0);
    for (auto& p : prerequisites) {
      graph[p[1]].push_back(p[0]);
      inDegree[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
      if (inDegree[i] == 0) q.push(i);
    }
    vector<int> result;
    while (!q.empty()) {
      int node = q.front();
      q.pop();
      result.push_back(node);
      for (int neighbor : graph[node]) {
        if (--inDegree[neighbor] == 0) {
          q.push(neighbor);
        }
      }
    }
    return result.size() == numCourses ? result : vector<int>();
  }
};`,
};

export const TopologicalSortVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({
    typescript: [],
    python: [],
    java: [],
    cpp: [],
  });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const graphValues: Record<number, number[]> = useMemo(
    () => ({
      0: [2, 3],
      1: [3, 4],
      2: [3],
      3: [4],
      4: [],
    }),
    []
  );

  const numNodes = 5;

  useEffect(() => {
    const graph = new Map<number, number[]>();
    for (const key in graphValues) {
      graph.set(Number(key), graphValues[key]);
    }

    const newSteps: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: [],
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const indegrees: number[] = new Array(numNodes).fill(0);
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [],
      result: [],
      explanation: "Initialize in-degrees to 0 for all nodes.",
      pseudoStep: "SET indegrees = [0, 0, 0, 0, 0]",
      variables: {
        currentNode: "null",
        queue: "[]",
        result: "[]",
      },
      activeNode: null,
    });
    addLines(2, 3, 5, 8);

    for (const [node, neighbors] of graph.entries()) {
      for (const neighbor of neighbors) {
        indegrees[neighbor]++;
      }
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [],
      result: [],
      explanation: `Calculate incoming degrees (in-degrees) for all nodes by traversing edges: [${indegrees.join(", ")}].`,
      pseudoStep: "CALC indegrees for all nodes",
      variables: {
        currentNode: "null",
        queue: "[]",
        result: "[]",
      },
      activeNode: null,
    });
    addLines(3, 4, 6, 9);

    const queue: number[] = [];
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [],
      explanation: "Initialize an empty queue to store nodes with an in-degree of 0.",
      pseudoStep: "SET queue = []",
      variables: {
        currentNode: "null",
        queue: "[]",
        result: "[]",
      },
      activeNode: null,
    });
    addLines(8, 7, 11, 13);

    for (let i = 0; i < numNodes; i++) {
      if (indegrees[i] === 0) {
        queue.push(i);
        newSteps.push({
          currentNode: null,
          inDegree: [...indegrees],
          queue: [...queue],
          result: [],
          explanation: `Node ${i} has in-degree 0 (no dependencies), add it to the queue.`,
          pseudoStep: `CALL queue.push(${i}) → indegrees[${i}] == 0`,
          variables: {
            currentNode: "null",
            queue: `[${queue.join(", ")}]`,
            result: "[]",
          },
          activeNode: i,
        });
        addLines(11, 7, 14, 15);
      }
    }

    const result: number[] = [];
    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [...result],
      explanation: "Initialize an empty list to record the topological ordering.",
      pseudoStep: "SET result = []",
      variables: {
        currentNode: "null",
        queue: `[${queue.join(", ")}]`,
        result: "[]",
      },
      activeNode: null,
    });
    addLines(14, 8, 17, 17);

    while (queue.length > 0) {
      const node = queue.shift()!;
      newSteps.push({
        currentNode: node,
        inDegree: [...indegrees],
        queue: [...queue],
        result: [...result],
        explanation: `Remove node ${node} from the front of the queue to process it next.`,
        pseudoStep: `SET node = queue.pop() → ${node}`,
        variables: {
          currentNode: node,
          queue: `[${queue.join(", ")}]`,
          result: `[${result.join(", ")}]`,
        },
        activeNode: node,
      });
      addLines(16, 10, 20, 19);

      result.push(node);
      newSteps.push({
        currentNode: node,
        inDegree: [...indegrees],
        queue: [...queue],
        result: [...result],
        explanation: `Add node ${node} to the topological sort result.`,
        pseudoStep: `CALL result.push(${node})`,
        variables: {
          currentNode: node,
          queue: `[${queue.join(", ")}]`,
          result: `[${result.join(", ")}]`,
        },
        activeNode: node,
      });
      addLines(17, 11, 21, 21);

      for (const neighbor of graph.get(node) || []) {
        indegrees[neighbor]--;
        newSteps.push({
          currentNode: node,
          inDegree: [...indegrees],
          queue: [...queue],
          result: [...result],
          explanation: `Decrement in-degree of neighbor node ${neighbor} to ${indegrees[neighbor]} since node ${node} is processed.`,
          pseudoStep: `SET indegrees[${neighbor}] = ${indegrees[neighbor]}`,
          variables: {
            currentNode: node,
            queue: `[${queue.join(", ")}]`,
            result: `[${result.join(", ")}]`,
          },
          activeNode: neighbor,
        });
        addLines(19, 13, 24, 23);

        if (indegrees[neighbor] === 0) {
          queue.push(neighbor);
          newSteps.push({
            currentNode: node,
            inDegree: [...indegrees],
            queue: [...queue],
            result: [...result],
            explanation: `Neighbor ${neighbor} now has in-degree 0 (all dependencies resolved), add it to the queue.`,
            pseudoStep: `CALL queue.push(${neighbor})`,
            variables: {
              currentNode: node,
              queue: `[${queue.join(", ")}]`,
              result: `[${result.join(", ")}]`,
            },
            activeNode: neighbor,
          });
          addLines(21, 15, 26, 24);
        }
      }
    }

    newSteps.push({
      currentNode: null,
      inDegree: [...indegrees],
      queue: [...queue],
      result: [...result],
      explanation: `Topological ordering computed successfully: [${result.join(" → ")}].`,
      pseudoStep: "RETURN result",
      variables: {
        currentNode: "null",
        queue: "[]",
        result: `[${result.join(", ")}]`,
      },
      activeNode: null,
    });
    addLines(28, 18, 34, 28);

    setSteps(newSteps);
    setStepLineNumbers(stepLines);
  }, [graphValues]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest">
                Node States &amp; In-degrees
              </h3>

              <div className="grid grid-cols-5 gap-4 mb-6">
                {currentStep.inDegree.map((degree, idx) => {
                  const isActive = currentStep.activeNode === idx;
                  const isProcessed = currentStep.result.includes(idx);
                  const isQueued = currentStep.queue.includes(idx);

                  let nodeColorClass = "bg-card border-border text-muted-foreground";
                  if (isActive) {
                    nodeColorClass = "bg-primary/20 border-primary text-primary font-bold";
                  } else if (isProcessed) {
                    nodeColorClass = "bg-green-500/20 border-green-500 text-green-500 font-bold";
                  } else if (isQueued) {
                    nodeColorClass = "bg-blue-500/20 border-blue-500 text-blue-500 font-bold";
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm transition-all ${nodeColorClass}`}
                      >
                        {idx}
                      </motion.div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        In-degree: {degree}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Queue: </span>
                  <span className="text-sm font-mono font-bold">[{currentStep.queue.join(", ")}]</span>
                </div>
                <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
                  <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Result (Order): </span>
                  <span className="text-sm font-mono font-bold">[{currentStep.result.join(" → ")}]</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
            </Card>
            <VariablePanel
              variables={{
                ...currentStep.variables,
                "In-degrees": `[${currentStep.inDegree.join(", ")}]`,
              }}
            />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
    />
  );
};
