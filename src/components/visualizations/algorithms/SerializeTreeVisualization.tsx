import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  lineNumber: number;
  visitedNodes: Set<string>;
  builtNodes: Set<string>;
}

export const SerializeTreeVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `// Encodes a tree to a single string.
function serialize(root: TreeNode | null): string {
    const res: string[] = [];

    function dfs(node: TreeNode | null): void {
        // If node is null, store marker "N"
        if (!node) {
            res.push("N");
            return;
        }

        // Store current node value
        res.push(node.val.toString());

        // Traverse left subtree
        dfs(node.left);

        // Traverse right subtree
        dfs(node.right);
    }

    dfs(root);
    return res.join(",");
}

// Decodes your encoded data to tree.
function deserialize(data: string): TreeNode | null {
    const vals = data.split(",");
    let i = 0;

    function dfs(): TreeNode | null {
        // If value is "N", it represents null node
        if (vals[i] === "N") {
            i++;
            return null;
        }

        // Create node with current value
        const node = new TreeNode(parseInt(vals[i]));
        i++;

        // Recursively build left subtree
        node.left = dfs();

        // Recursively build right subtree
        node.right = dfs();

        return node;
    }

    return dfs();
}`;

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
    setTree(root);

    const newSteps: Step[] = [];
    const res: string[] = [];
    const visitedNodes = new Set<string>();

    // SERIALIZE PHASE
    const serializeDfs = (node: TreeNode | null) => {
      if (!node) {
        res.push("N");
        newSteps.push({
          phase: 'serialize',
          currentId: null,
          serialized: [...res],
          vals: [],
          i: 0,
          message: 'Node is null, store marker "N"',
          lineNumber: 7,
          visitedNodes: new Set(visitedNodes),
          builtNodes: new Set()
        });
        return;
      }

      visitedNodes.add(node.id!);
      res.push(node.val!.toString());
      newSteps.push({
        phase: 'serialize',
        currentId: node.id!,
        serialized: [...res],
        vals: [],
        i: 0,
        message: `Visit node with value ${node.val}, store in array`,
        lineNumber: 13,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set()
      });

      newSteps.push({
        phase: 'serialize',
        currentId: node.id!,
        serialized: [...res],
        vals: [],
        i: 0,
        message: `Traverse left child of ${node.val}`,
        lineNumber: 16,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set()
      });
      serializeDfs(node.left);

      newSteps.push({
        phase: 'serialize',
        currentId: node.id!,
        serialized: [...res],
        vals: [],
        i: 0,
        message: `Traverse right child of ${node.val}`,
        lineNumber: 19,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set()
      });
      serializeDfs(node.right);
    };

    newSteps.push({
      phase: 'serialize',
      currentId: null,
      serialized: [],
      vals: [],
      i: 0,
      message: 'Start serialization',
      lineNumber: 1,
      visitedNodes: new Set(),
      builtNodes: new Set()
    });

    serializeDfs(root);
    const finalSerialized = res.join(",");

    newSteps.push({
      phase: 'serialize',
      currentId: null,
      serialized: [...res],
      vals: [],
      i: 0,
      message: `Serialization complete: "${finalSerialized}"`,
      lineNumber: 23,
      visitedNodes: new Set(visitedNodes),
      builtNodes: new Set()
    });

    // DESERIALIZE PHASE
    const vals = finalSerialized.split(",");
    let i = 0;
    const builtNodes = new Set<string>();

    const deserializeDfs = (nodeTemplate: TreeNode | null): TreeNode | null => {
      if (vals[i] === "N") {
        newSteps.push({
          phase: 'deserialize',
          currentId: null,
          serialized: [...res],
          vals: [...vals],
          i: i,
          message: `vals[${i}] is "N", represents null node`,
          lineNumber: 33,
          visitedNodes: new Set(visitedNodes),
          builtNodes: new Set(builtNodes)
        });
        i++;
        return null;
      }

      const nodeVal = parseInt(vals[i]);
      const currentId = nodeTemplate?.id || `d${i}`;

      newSteps.push({
        phase: 'deserialize',
        currentId: currentId,
        serialized: [...res],
        vals: [...vals],
        i: i,
        message: `Create node with current value ${nodeVal}`,
        lineNumber: 39,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set(builtNodes)
      });

      builtNodes.add(currentId);
      i++;

      newSteps.push({
        phase: 'deserialize',
        currentId: currentId,
        serialized: [...res],
        vals: [...vals],
        i: i,
        message: `Recursively build left subtree for node ${nodeVal}`,
        lineNumber: 43,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set(builtNodes)
      });
      deserializeDfs(nodeTemplate?.left || null);

      newSteps.push({
        phase: 'deserialize',
        currentId: currentId,
        serialized: [...res],
        vals: [...vals],
        i: i,
        message: `Recursively build right subtree for node ${nodeVal}`,
        lineNumber: 46,
        visitedNodes: new Set(visitedNodes),
        builtNodes: new Set(builtNodes)
      });
      deserializeDfs(nodeTemplate?.right || null);

      return { val: nodeVal, left: null, right: null };
    };

    newSteps.push({
      phase: 'deserialize',
      currentId: null,
      serialized: [...res],
      vals: [...vals],
      i: 0,
      message: 'Start deserialization',
      lineNumber: 27,
      visitedNodes: new Set(visitedNodes),
      builtNodes: new Set()
    });

    deserializeDfs(root);

    newSteps.push({
      phase: 'deserialize',
      currentId: null,
      serialized: [...res],
      vals: [...vals],
      i: i,
      message: 'Deserialization complete! Tree reconstructed.',
      lineNumber: 52,
      visitedNodes: new Set(visitedNodes),
      builtNodes: new Set(builtNodes)
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

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
      }, 1000 / speed);
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
    generateSteps();
  };

  if (steps.length === 0 || !tree) return null;

  const currentStep = steps[currentStepIndex];

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isActive = currentStep.currentId === node.id;
    const isVisited = currentStep.visitedNodes.has(node.id!);
    const isBuilt = currentStep.builtNodes.has(node.id!);

    // In deserialize phase, only show nodes that are being built or already built
    const shouldShow = currentStep.phase === 'serialize' || isBuilt || isActive;

    return (
      <g key={`${node.id}-${node.x}`}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y}
            stroke="currentColor" strokeWidth="2"
            className={`transition-all duration-300 ${shouldShow && (currentStep.phase === 'serialize' || (isBuilt && currentStep.builtNodes.has(node.left.id!)))
              ? 'text-border opacity-100'
              : 'text-border opacity-20'
              }`}
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y}
            stroke="currentColor" strokeWidth="2"
            className={`transition-all duration-300 ${shouldShow && (currentStep.phase === 'serialize' || (isBuilt && currentStep.builtNodes.has(node.right.id!)))
              ? 'text-border opacity-100'
              : 'text-border opacity-20'
              }`}
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`transition-all duration-500 ${isActive ? 'fill-primary stroke-primary scale-110 shadow-lg' :
            (currentStep.phase === 'serialize' && isVisited) ? 'fill-primary/20 stroke-primary' :
              isBuilt ? 'fill-green-500/20 stroke-green-500' :
                'fill-muted/20 stroke-border opacity-30'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`font- transition-all duration-300 ${isActive ? 'fill-white' :
            (currentStep.phase === 'serialize' && isVisited) || isBuilt ? 'fill-foreground' :
              'fill-foreground/20'
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font- text-foreground">
          {currentStep.phase === 'serialize' ? 'Phase 1: Serialize' : 'Phase 2: Deserialize'}
        </h2>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 relative">
            <svg viewBox="0 0 400 280" className="w-full h-72 overflow-visible">
              {renderTree(tree)}
            </svg>

            <div className="absolute top-2 right-2 flex gap-2">
              <div className={`px-2 py-1 rounded text-[10px] uppercase font- ${currentStep.phase === 'serialize' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                Serialize
              </div>
              <div className={`px-2 py-1 rounded text-[10px] uppercase font- ${currentStep.phase === 'deserialize' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                Deserialize
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`rounded-lg border p-4 shadow-sm ${currentStep.phase === 'serialize' ? 'bg-primary/5 border-primary/20' : 'bg-green-500/5 border-green-500/20'
                }`}
            >
              <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
            </motion.div>
          </AnimatePresence>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 overflow-hidden">
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

          <div className="rounder-lg">
            <VariablePanel
              variables={currentStep.phase === 'serialize' ? {
                'phase': 'Serialize',
                'node.val': currentStep.currentId ? tree.val : 'null',
                'res': currentStep.serialized.join(','),
                'res.length': currentStep.serialized.length
              } : {
                'phase': 'Deserialize',
                'i': currentStep.i,
                'vals[i]': currentStep.vals[currentStep.i] || 'null',
                'vals': currentStep.vals.join(',')
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border border-border shadow-md">
            <AnimatedCodeEditor
              code={code}
              highlightedLines={[currentStep.lineNumber]}
              language="TypeScript"
            />
          </div>

          <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-border text-[11px] text-muted-foreground">
            <p><strong>Pro Tip:</strong> Watch how the marker "N" is used for null nodes in preorder traversal (Root &rarr; Left &rarr; Right). This allows unique reconstruction of the tree without extra info.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
