import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { TreeDeciduous, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  currentNode: number | null;
  leftVal: number | null;
  rightVal: number | null;
  swapped: boolean;
  tree: { [key: number]: { left: number | null; right: number | null } };
  explanation: string;
  pseudoStep: string;
  stackDepth: number;
}

const languages: VisualizationLanguageMap = {
  python: `def invertTree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    return root`,

  typescript: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,

  java: `public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}`,

  cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) {
            return nullptr;
        }
        TreeNode* temp = root->left;
        root->left = root->right;
        root->right = temp;
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`
};

export const InvertBinaryTreeVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const initialTree = {
    4: { left: 2, right: 7 },
    2: { left: 1, right: 3 },
    7: { left: 6, right: 9 },
    1: { left: null, right: null },
    3: { left: null, right: null },
    6: { left: null, right: null },
    9: { left: null, right: null }
  };

  const steps: Step[] = useMemo(() => [
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, explanation: "Starting invertTree(4).", pseudoStep: "isSameTree(root)", stackDepth: 1 },
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, explanation: "Storing left child (2) in temp.", pseudoStep: "SET temp = root.left", stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 7, swapped: false, tree: initialTree, explanation: "Moving right child (7) to left position.", pseudoStep: "SET root.left = root.right", stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 } }, explanation: "Moving temp (2) to right position. Children of node 4 swapped!", pseudoStep: "SET root.right = temp", stackDepth: 1 },

    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, explanation: "Recursing on left child (7).", pseudoStep: "CALL invertTree(root.left)", stackDepth: 2 },
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, explanation: "Swapping children of node 7.", pseudoStep: "SWAP(root.left, root.right)", stackDepth: 2 },
    { currentNode: 7, leftVal: 9, rightVal: 6, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 } }, explanation: "Node 7's children swapped!", pseudoStep: "SWAP(root.left, root.right) → DONE", stackDepth: 2 },

    { currentNode: 9, leftVal: null, rightVal: null, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 } }, explanation: "Recursing on node 9. It's null, returning.", pseudoStep: "IF root == null → RETURN null", stackDepth: 3 },
    { currentNode: 6, leftVal: null, rightVal: null, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 } }, explanation: "Recursing on node 6. It's null, returning.", pseudoStep: "IF root == null → RETURN null", stackDepth: 3 },
    
    { currentNode: 2, leftVal: 1, rightVal: 3, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 } }, explanation: "Back at root, recursing on right child (2).", pseudoStep: "CALL invertTree(root.right)", stackDepth: 1 },
    { currentNode: 2, leftVal: 1, rightVal: 3, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 } }, explanation: "Swapping children of node 2.", pseudoStep: "SWAP(root.left, root.right)", stackDepth: 2 },
    { currentNode: 2, leftVal: 3, rightVal: 1, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 }, 2: { left: 3, right: 1 } }, explanation: "Node 2's children swapped!", pseudoStep: "SWAP(root.left, root.right) → DONE", stackDepth: 2 },

    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 }, 7: { left: 9, right: 6 }, 2: { left: 3, right: 1 } }, explanation: "All levels processed. Returning the inverted tree root.", pseudoStep: "RETURN root", stackDepth: 1 }
  ], []);

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [1, 3, 4, 5, 6, 3, 5, 2, 2, 7, 3, 5, 8],
    python: [1, 4, 4, 4, 5, 4, 4, 2, 2, 6, 4, 4, 7],
    java: [2, 6, 7, 8, 9, 6, 8, 4, 4, 10, 6, 8, 11],
    cpp: [3, 7, 8, 9, 10, 7, 9, 5, 5, 11, 7, 9, 12]
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const renderTree = () => {
    const tree = step.tree;
    const positions: Record<number, { x: number, y: number }> = {
      4: { x: 200, y: 40 },
      2: { x: 120, y: 100 },
      7: { x: 280, y: 100 },
      1: { x: 80, y: 160 },
      3: { x: 160, y: 160 },
      6: { x: 240, y: 160 },
      9: { x: 320, y: 160 }
    };

    const edges = [
      [4, 4], // root dummy
      [4, tree[4].left], [4, tree[4].right],
      [2, tree[2].left], [2, tree[2].right],
      [7, tree[7].left], [7, tree[7].right]
    ].filter(e => e[1] !== null);

    return (
      <div className="w-full aspect-[400/220] relative">
        <svg viewBox="0 0 400 220" className="w-full h-full">
          {edges.map((edge, i) => {
            const [u, v] = edge;
            if (u === v) return null;
            return (
              <line 
                key={i} 
                x1={positions[u].x} y1={positions[u].y} 
                x2={positions[v].x} y2={positions[v].y} 
                stroke="currentColor" className="text-border" strokeWidth="2" 
              />
            );
          })}
          {Object.entries(positions).map(([val, pos]) => {
            const isCurrent = Number(val) === step.currentNode;
            const isSwapped = step.swapped && Number(val) === step.currentNode;
            
            return (
              <g key={val}>
                <motion.circle
                  cx={pos.x} cy={pos.y} r="18"
                  animate={{
                    fill: isSwapped ? '#10b981' : isCurrent ? '#3b82f6' : 'hsl(var(--card))',
                    stroke: isCurrent || isSwapped ? 'transparent' : 'hsl(var(--border))',
                    scale: isCurrent ? 1.2 : 1
                  }}
                  transition={{ duration: 0 }}
                  strokeWidth="2"
                />
                <text 
                  x={pos.x} y={pos.y + 4} textAnchor="middle" 
                  className={`text-[10px] font-bold select-none ${isCurrent || isSwapped ? 'fill-white' : 'fill-foreground'}`}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="w-full">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6 flex flex-col h-full">
            <div>
              <h2 className="text-sm font-bold text-foreground mb-4 opacity-90 flex items-center gap-2">
                <TreeDeciduous size={16} className="text-primary" />
                Tree Inversion Workspace
              </h2>
              <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden flex justify-center items-center">
                {renderTree()}
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Descriptive Commentary Box (at the bottom) */}
              <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Process Step
                </div>
                {step.explanation}
              </div>
               
               <Card className="p-4 bg-muted/30 border-muted flex flex-col justify-center">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <RefreshCw size={12} />
                    Status
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">Current Node:</span>
                      <span className="font-mono font-bold text-primary">{step.currentNode}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">Stack Depth:</span>
                      <span className="font-mono font-bold text-primary">{step.stackDepth}</span>
                    </div>
                  </div>
               </Card>
            </div>

            <VariablePanel
              variables={{
                currentNode: step.currentNode,
                left: step.leftVal,
                right: step.rightVal,
                swapped: step.swapped ? "Yes" : "No"
              }}
            />
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
    </div>
  );
};
