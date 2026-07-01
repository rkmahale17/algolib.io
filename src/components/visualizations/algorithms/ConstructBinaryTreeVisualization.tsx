import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { TreeDeciduous, Braces } from 'lucide-react';
import { motion } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
}

interface Step {
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
  builtNodes: string[];
  currentNodeId: string | null;
  preorder: number[];
  inorder: number[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (!preorder.length || !inorder.length) return null;
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);
  root.left = buildTree(
    preorder.slice(1, mid + 1),
    inorder.slice(0, mid)
  );
  root.right = buildTree(
    preorder.slice(mid + 1),
    inorder.slice(mid + 1)
  );
  return root;
}`,
  python: `def buildTree(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    if not preorder or not inorder:
        return None
    root = TreeNode(preorder[0])
    mid = inorder.index(preorder[0])
    root.left = buildTree(preorder[1:mid + 1], inorder[:mid])
    root.right = buildTree(preorder[mid + 1:], inorder[mid + 1:])
    return root`,
  java: `public static class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder == null || inorder == null || preorder.length == 0 || inorder.length == 0) {
            return null;
        }
        return buildTreeHelper(preorder, inorder, 0, 0, inorder.length - 1);
    }
    private TreeNode buildTreeHelper(int[] preorder, int[] inorder, int preStart, int inStart, int inEnd) {
        if (preStart > preorder.length - 1 || inStart > inEnd) {
            return null;
        }
        TreeNode root = new TreeNode(preorder[preStart]);
        int inIndex = 0;
        for (int i = inStart; i <= inEnd; i++) {
            if (inorder[i] == root.val) {
                inIndex = i;
                break;
            }
        }
        root.left = buildTreeHelper(preorder, inorder, preStart + 1, inStart, inIndex - 1);
        root.right = buildTreeHelper(preorder, inorder, preStart + inIndex - inStart + 1, inIndex + 1, inEnd);
        return root;
    }
}`,
  cpp: `class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty() || inorder.empty()) {
            return nullptr;
        }
        return buildTreeHelper(preorder, inorder, 0, 0, inorder.size() - 1);
    }
private:
    TreeNode* buildTreeHelper(
        vector<int>& preorder,
        vector<int>& inorder,
        int preStart,
        int inStart,
        int inEnd
    ) {
        if (preStart > preorder.size() - 1 || inStart > inEnd) {
            return nullptr;
        }
        TreeNode* root = new TreeNode(preorder[preStart]);
        int inIndex = 0;
        for (int i = inStart; i <= inEnd; i++) {
            if (inorder[i] == root->val) {
                inIndex = i;
                break;
            }
        }
        root->left = buildTreeHelper(
            preorder,
            inorder,
            preStart + 1,
            inStart,
            inIndex - 1
        );
        root->right = buildTreeHelper(
            preorder,
            inorder,
            preStart + inIndex - inStart + 1,
            inIndex + 1,
            inEnd
        );
        return root;
    }
};`
};

export const ConstructBinaryTreeVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const generatedSteps: Step[] = [];
    const builtNodes: string[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let idCounter = 0;

    function addStep(
      msg: string,
      pseudo: string,
      variables: Record<string, any>,
      currentNodeId: string | null,
      pre: number[],
      ino: number[],
      ts: number, py: number, java: number, cpp: number
    ) {
      generatedSteps.push({
        message: msg,
        pseudoStep: pseudo,
        variables,
        builtNodes: [...builtNodes],
        currentNodeId,
        preorder: [...pre],
        inorder: [...ino]
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    }

    function build(pre: number[], ino: number[], isRootCall: boolean): TreeNode | null {
      const preStr = `[${pre.join(',')}]`;
      const inoStr = `[${ino.join(',')}]`;

      addStep(
        `Calling buildTree with preorder=${preStr} and inorder=${inoStr}`,
        `CALL buildTree(preorder=${preStr}, inorder=${inoStr})`,
        { preorder: preStr, inorder: inoStr },
        null,
        pre,
        ino,
        1, 1, isRootCall ? 2 : 8, isRootCall ? 3 : 10
      );

      if (!pre.length || !ino.length) {
        addStep(
          "Empty input detected. Returning null for this branch.",
          "IF preorder IS EMPTY OR inorder IS EMPTY RETURN NULL",
          { 'pre.length': pre.length, 'ino.length': ino.length },
          null,
          pre,
          ino,
          2, 2, isRootCall ? 3 : 9, isRootCall ? 4 : 17
        );
        return null;
      }

      const rootVal = pre[0];
      const nodeId = `node-${idCounter++}`;

      addStep(
        `Root value is preorder[0] = ${rootVal}.`,
        `SET rootVal = preorder[0] → ${rootVal}`,
        { rootVal },
        nodeId,
        pre,
        ino,
        3, 4, 12, 20
      );

      const root: TreeNode = { val: rootVal, left: null, right: null, id: nodeId };
      builtNodes.push(nodeId);

      addStep(
        `Created TreeNode(${rootVal}).`,
        `SET root = NEW TreeNode(${rootVal})`,
        { rootVal, node: `TreeNode(${rootVal})` },
        nodeId,
        pre,
        ino,
        4, 4, 12, 20
      );

      const mid = ino.indexOf(rootVal);
      addStep(
        `Found ${rootVal} at index ${mid} in inorder array. This partitions left and right subtrees.`,
        `SET mid = inorder.indexOf(${rootVal}) → ${mid}`,
        { rootVal, mid, inorder: inoStr },
        nodeId,
        pre,
        ino,
        5, 5, 14, 22
      );

      addStep(
        `Recursively constructing left subtree...`,
        `SET root.left = CALL buildTree(preorder[1:${mid + 1}], inorder[0:${mid}])`,
        {
          'leftPre': `[${pre.slice(1, mid + 1).join(',')}]`,
          'leftIno': `[${ino.slice(0, mid).join(',')}]`
        },
        nodeId,
        pre,
        ino,
        6, 6, 20, 28
      );

      root.left = build(pre.slice(1, mid + 1), ino.slice(0, mid), false);

      addStep(
        `Left subtree for node ${rootVal} complete. Now constructing right subtree...`,
        `SET root.right = CALL buildTree(preorder[${mid + 1}:], inorder[${mid + 1}:])`,
        {
          'rightPre': `[${pre.slice(mid + 1).join(',')}]`,
          'rightIno': `[${ino.slice(mid + 1).join(',')}]`
        },
        nodeId,
        pre,
        ino,
        10, 7, 21, 35
      );

      root.right = build(pre.slice(mid + 1), ino.slice(mid + 1), false);

      addStep(
        `Successfully constructed tree rooted at ${rootVal}. Returning node.`,
        `RETURN root`,
        { rootVal, 'root.left': root.left?.val ?? 'null', 'root.right': root.right?.val ?? 'null' },
        nodeId,
        pre,
        ino,
        14, 8, 22, 42
      );

      return root;
    }

    build(preorder, inorder, true);
    return { steps: generatedSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderTree = () => {
    const positions: Record<string, { x: number, y: number, val: number }> = {
      'node-0': { x: 200, y: 40, val: 3 },
      'node-1': { x: 100, y: 120, val: 9 },
      'node-2': { x: 300, y: 120, val: 20 },
      'node-3': { x: 250, y: 200, val: 15 },
      'node-4': { x: 350, y: 200, val: 7 }
    };

    const edges = [['node-0', 'node-1'], ['node-0', 'node-2'], ['node-2', 'node-3'], ['node-2', 'node-4']];

    return (
      <div className="w-full aspect-[400/240] relative">
        <svg viewBox="0 0 400 240" className="w-full h-full">
          {edges.map(([u, v], i) => {
             const uBuilt = step.builtNodes.includes(u);
             const vBuilt = step.builtNodes.includes(v);
             return (
               <line 
                 key={i} 
                 x1={positions[u].x} y1={positions[u].y} 
                 x2={positions[v].x} y2={positions[v].y} 
                 stroke="currentColor" 
                 className={`transition-all duration-0 ${uBuilt && vBuilt ? 'text-primary' : 'text-border opacity-20'}`} 
                 strokeWidth="2" 
               />
             );
          })}
          {Object.entries(positions).map(([id, pos]) => {
            const isCurrent = id === step.currentNodeId;
            const isBuilt = step.builtNodes.includes(id);
            
            return (
              <g key={id}>
                <motion.circle
                  cx={pos.x} cy={pos.y} r="18"
                  animate={{
                    fill: isCurrent ? '#3b82f6' : isBuilt ? '#3b82f620' : 'hsl(var(--card))',
                    stroke: isCurrent ? '#3b82f6' : isBuilt ? '#3b82f6' : 'hsl(var(--border))',
                    opacity: isBuilt || isCurrent ? 1 : 0.2,
                    scale: isCurrent ? 1.2 : 1
                  }}
                  transition={{ duration: 0 }}
                  strokeWidth="2"
                />
                <text 
                  x={pos.x} y={pos.y + 4} textAnchor="middle" 
                  className={`text-[10px] font-bold select-none ${isCurrent ? 'fill-white' : (isBuilt ? 'fill-foreground' : 'fill-muted-foreground opacity-20')}`}
                >
                  {pos.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 opacity-90 flex items-center gap-2">
              <TreeDeciduous size={16} className="text-primary" />
              Construction Workspace
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden flex justify-center items-center">
              {renderTree()}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="p-4 bg-primary/5 border-l-4 border-primary shadow-sm h-full flex flex-col justify-center">
               <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mb-2">Commentary</h4>
               <p className="text-[13px] font-medium leading-relaxed text-foreground/90">
                 {step.message}
               </p>
             </Card>
             
             <Card className="p-4 bg-muted/30 border-muted">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Braces size={12} />
                  Input Data
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Preorder</span>
                    <div className="flex gap-1">
                      {step.preorder.map((v, i) => (
                        <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {v}
                        </span>
                      ))}
                      {step.preorder.length === 0 && <span className="text-[10px] italic text-muted-foreground">[]</span>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">Inorder</span>
                    <div className="flex gap-1">
                      {step.inorder.map((v, i) => (
                        <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${v === step.preorder[0] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {v}
                        </span>
                      ))}
                      {step.inorder.length === 0 && <span className="text-[10px] italic text-muted-foreground">[]</span>}
                    </div>
                  </div>
                </div>
             </Card>
          </div>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
    />
  );
};
