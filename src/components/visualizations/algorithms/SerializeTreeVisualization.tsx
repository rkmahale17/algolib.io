import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface TreeNode {
  val: number | null;
  left: TreeNode | null;
  right: TreeNode | null;
  id?: string;
  x?: number;
  y?: number;
}

interface Step {
  phase: 'serialize' | 'deserialize';
  currentId: string | null;
  serialized: string[];
  vals: string[];
  i: number;
  message: string;
  pseudoStep: string;
  visitedNodes: Set<string>;
  builtNodes: Set<string>;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function solution(root: TreeNode | null): TreeNode | null {
    function serialize(root: TreeNode | null): string {
        const res: string[] = []
        function dfs(node: TreeNode | null) {
            if (!node) {
                res.push("N")
                return
            }
            res.push(String(node.val))
            dfs(node.left)
            dfs(node.right)
        }
        dfs(root)
        return res.join(",")
    }
    function deserialize(data: string): TreeNode | null {
        const vals = data.split(",")
        let i = 0
        function dfs(): TreeNode | null {
            if (vals[i] === "N") {
                i++
                return null
            }
            const node = new TreeNode(parseInt(vals[i]))
            i++
            node.left = dfs()
            node.right = dfs()
            return node
        }
        return dfs()
    }
    const encoded = serialize(root)
    return deserialize(encoded)
}`,

  python: `def solution(root: TreeNode | None) -> TreeNode | None:
    def serialize(root: TreeNode | None) -> str:
        res = []
        def dfs(node: TreeNode | None):
            if not node:
                res.append("N")
                return
            res.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(res)
    def deserialize(data: str) -> TreeNode | None:
        vals = data.split(",")
        i = 0
        def dfs() -> TreeNode | None:
            nonlocal i
            if vals[i] == "N":
                i += 1
                return None
            node = TreeNode(int(vals[i]))
            i += 1
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()
    encoded = serialize(root)
    return deserialize(encoded)`,

  java: `public static class Solution {
    public TreeNode solution(TreeNode root) {
        String encoded = serialize(root);
        return deserialize(encoded);
    }
    private String serialize(TreeNode root) {
        List<String> res = new ArrayList<>();
        dfsSerialize(root, res);
        return String.join(",", res);
    }
    private void dfsSerialize(TreeNode node, List<String> res) {
        if (node == null) {
            res.add("N");
            return;
        }
        res.add(String.valueOf(node.val));
        dfsSerialize(node.left, res);
        dfsSerialize(node.right, res);
    }
    private TreeNode deserialize(String data) {
        String[] vals = data.split(",");
        int[] i = {0};
        return dfsDeserialize(vals, i);
    }
    private TreeNode dfsDeserialize(String[] vals, int[] i) {
        if (vals[i[0]].equals("N")) {
            i[0]++;
            return null;
        }
        TreeNode node = new TreeNode(Integer.parseInt(vals[i[0]]));
        i[0]++;
        node.left = dfsDeserialize(vals, i);
        node.right = dfsDeserialize(vals, i);
        return node;
    }
}`,

  cpp: `class Solution {
public:
    TreeNode* solution(TreeNode* root) {
        string encoded = serialize(root);
        return deserialize(encoded);
    }
private:
    void dfsSerialize(TreeNode* node, vector<string>& res) {
        if (!node) {
            res.push_back("N");
            return;
        }
        res.push_back(to_string(node->val));
        dfsSerialize(node->left, res);
        dfsSerialize(node->right, res);
    }
    string serialize(TreeNode* root) {
        vector<string> res;
        dfsSerialize(root, res);
        string result = "";
        for (int i = 0; i < res.size(); i++) {
            if (i) result += ",";
            result += res[i];
        }
        return result;
    }
    TreeNode* dfsDeserialize(vector<string>& vals, int& i) {
        if (vals[i] == "N") {
            i++;
            return NULL;
        }
        TreeNode* node = new TreeNode(stoi(vals[i]));
        i++;
        node->left = dfsDeserialize(vals, i);
        node->right = dfsDeserialize(vals, i);
        return node;
    }
    TreeNode* deserialize(string data) {
        vector<string> vals;
        string temp;
        stringstream ss(data);
        while (getline(ss, temp, ',')) {
            vals.push_back(temp);
        }
        int i = 0;
        return dfsDeserialize(vals, i);
    }
};`,
};

export const SerializeTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const createTree = (): TreeNode => {
    return {
      val: 1,
      id: 'n1',
      left: {
        val: 2,
        id: 'n2',
        left: null,
        right: null
      },
      right: {
        val: 3,
        id: 'n3',
        left: { val: 4, id: 'n4', left: null, right: null },
        right: { val: 5, id: 'n5', left: null, right: null }
      }
    };
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) calculatePositions(node.left, x - spacing, y + 60, spacing / 2);
    if (node.right) calculatePositions(node.right, x + spacing, y + 60, spacing / 2);
  };

  const generateSteps = () => {
    const root = createTree();
    calculatePositions(root, 200, 50, 100);

    const steps: Step[] = [];
    const res: string[] = [];
    const visitedNodes = new Set<string>();

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

    const addStep = (
      phase: 'serialize' | 'deserialize',
      currentNodeId: string | null,
      msg: string,
      pseudo: string,
      ts_l: number, py_l: number, java_l: number, cpp_l: number,
      iVal: number,
      valsVal: string[] = [],
      built: Set<string> = new Set()
    ) => {
      steps.push({
        phase,
        currentId: currentNodeId,
        serialized: [...res],
        vals: [...valsVal],
        i: iVal,
        message: msg,
        pseudoStep: pseudo,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set(built),
        variables: phase === 'serialize' ? {
          phase: 'Serialize',
          'res': res.join(','),
          'res.length': res.length
        } : {
          phase: 'Deserialize',
          'i': iVal,
          'vals[i]': valsVal[iVal] || 'null',
          'vals': valsVal.join(',')
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // 1. Start serialize
    addStep('serialize', null, 'Start serialization of binary tree.', 'serialize(root)', 13, 11, 8, 19, 0);

    const serializeDfs = (node: TreeNode | null) => {
      if (!node) {
        res.push("N");
        addStep('serialize', null, 'Node is null. Push "N" marker.', 'res.push("N")', 6, 6, 13, 10, 0);
        return;
      }

      visitedNodes.add(node.id!);
      res.push(node.val!.toString());
      addStep('serialize', node.id!, `Visit node with value ${node.val}. Append it to result.`, `res.push(${node.val})`, 9, 8, 16, 13, 0);

      addStep('serialize', node.id!, `Recursively serialize left subtree of node ${node.val}.`, 'dfs(node.left)', 10, 9, 17, 14, 0);
      serializeDfs(node.left);

      addStep('serialize', node.id!, `Recursively serialize right subtree of node ${node.val}.`, 'dfs(node.right)', 11, 10, 18, 15, 0);
      serializeDfs(node.right);
    };

    serializeDfs(root);
    const finalSerialized = res.join(",");

    addStep('serialize', null, `Serialization finished. Encoded tree string: "${finalSerialized}"`, 'return res.join(",")', 14, 12, 9, 25, 0);

    // 2. Start deserialize
    const vals = finalSerialized.split(",");
    let i = 0;
    const builtNodes = new Set<string>();

    addStep('deserialize', null, 'Start deserialization of encoded string.', 'deserialize(encoded)', 30, 26, 23, 46, i, vals, builtNodes);

    const deserializeDfs = (nodeTemplate: TreeNode | null): TreeNode | null => {
      if (vals[i] === "N") {
        addStep('deserialize', null, `vals[${i}] is "N". Return null node.`, 'if (vals[i] === "N")  →  YES ✓', 20, 18, 26, 28, i, vals, builtNodes);
        i++;
        return null;
      }

      const nodeVal = parseInt(vals[i]);
      const currentId = nodeTemplate?.id || `d${i}`;

      addStep('deserialize', currentId, `Create new tree node with value ${nodeVal}.`, `node = new TreeNode(${nodeVal})`, 24, 21, 30, 32, i, vals, builtNodes);
      builtNodes.add(currentId);
      i++;

      addStep('deserialize', currentId, `Recursively rebuild left child for node ${nodeVal}.`, 'node.left = dfs()', 26, 23, 32, 34, i, vals, builtNodes);
      deserializeDfs(nodeTemplate?.left || null);

      addStep('deserialize', currentId, `Recursively rebuild right child for node ${nodeVal}.`, 'node.right = dfs()', 27, 24, 33, 35, i, vals, builtNodes);
      deserializeDfs(nodeTemplate?.right || null);

      return { val: nodeVal, left: null, right: null };
    };

    deserializeDfs(root);

    addStep('deserialize', null, 'Deserialization complete! Tree reconstructed successfully.', 'return root', 33, 28, 4, 5, i, vals, builtNodes);

    return { steps, stepLineNumbers };
  };

  const [{ steps, stepLineNumbers }] = useState(generateSteps);
  const [tree] = useState(() => {
    const root = createTree();
    calculatePositions(root, 200, 50, 100);
    return root;
  });

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0 || !tree) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isActive = currentStep.currentId === node.id;
    const isVisited = currentStep.visitedNodes.has(node.id!);
    const isBuilt = currentStep.builtNodes.has(node.id!);

    const shouldShow = currentStep.phase === 'serialize' || isBuilt || isActive;

    return (
      <g key={`${node.id}-${node.x}`}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y}
            stroke="currentColor" strokeWidth="2"
            className={`transition-all duration-300 ${shouldShow && (currentStep.phase === 'serialize' || (isBuilt && currentStep.builtNodes.has(node.left.id!)))
              ? 'text-border opacity-100'
              : 'text-border opacity-10'
              }`}
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y}
            stroke="currentColor" strokeWidth="2"
            className={`transition-all duration-300 ${shouldShow && (currentStep.phase === 'serialize' || (isBuilt && currentStep.builtNodes.has(node.right.id!)))
              ? 'text-border opacity-100'
              : 'text-border opacity-10'
              }`}
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`transition-all duration-500 ${isActive
            ? 'fill-primary stroke-primary animate-pulse'
            : (currentStep.phase === 'serialize' && isVisited)
              ? 'fill-primary/20 stroke-primary'
              : isBuilt
                ? 'fill-green-600/20 stroke-green-600'
                : 'fill-card stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-sm font-semibold transition-all duration-300 ${isActive
            ? 'fill-white'
            : (currentStep.phase === 'serialize' && isVisited) || isBuilt
              ? 'fill-foreground'
              : 'fill-muted-foreground'
            }`}
        >
          {node.val}
        </text>
        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual tree + commentary box + variable panel */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 relative">
            <svg viewBox="0 0 400 280" className="w-full h-72">
              {renderTree(tree)}
            </svg>

            <div className="absolute top-4 right-4 flex gap-2">
              <div className={`px-2 py-1 rounded text-[10px] uppercase font-semibold ${currentStep.phase === 'serialize' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                Serialize
              </div>
              <div className={`px-2 py-1 rounded text-[10px] uppercase font-semibold ${currentStep.phase === 'deserialize' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                Deserialize
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-4 shadow-sm ${currentStep.phase === 'serialize' ? 'bg-primary/5 border-primary/20' : 'bg-green-500/5 border-green-500/20'}`}>
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 overflow-hidden">
            <p className="text-xs text-muted-foreground mb-2 flex justify-between">
              <span>{currentStep.phase === 'serialize' ? 'Result Array (res):' : 'Values Array (vals):'}</span>
              {currentStep.phase === 'deserialize' && (
                <span className="font-mono text-[10px]">i = {currentStep.i}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-1">
              {(currentStep.phase === 'serialize' ? currentStep.serialized : currentStep.vals).map((v, idx) => (
                <div
                  key={idx}
                  className={`font-mono text-xs px-2 py-1 rounded border transition-all ${(currentStep.phase === 'serialize' && idx === currentStep.serialized.length - 1) ||
                    (currentStep.phase === 'deserialize' && idx === currentStep.i)
                    ? 'bg-primary text-white border-primary scale-110'
                    : 'bg-background border-border'
                    }`}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right: code / pseudocode panel */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
