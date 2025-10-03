import { useState } from 'react';

interface TreeNode {
  value: number;
  left: number | null;
  right: number | null;
}

interface TreeVisualizationProps {
  algorithmId: string;
}

export const TreeVisualization = ({ algorithmId }: TreeVisualizationProps) => {
  const tree: TreeNode[] = [
    { value: 4, left: 1, right: 2 },      // 0
    { value: 2, left: 3, right: 4 },      // 1
    { value: 6, left: 5, right: 6 },      // 2
    { value: 1, left: null, right: null }, // 3
    { value: 3, left: null, right: null }, // 4
    { value: 5, left: null, right: null }, // 5
    { value: 7, left: null, right: null }  // 6
  ];

  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const preorderTraversal = async (nodeIndex: number | null) => {
    if (nodeIndex === null) return;

    setVisitedNodes(prev => [...prev, nodeIndex]);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (tree[nodeIndex].left !== null) {
      await preorderTraversal(tree[nodeIndex].left);
    }
    if (tree[nodeIndex].right !== null) {
      await preorderTraversal(tree[nodeIndex].right);
    }
  };

  const inorderTraversal = async (nodeIndex: number | null) => {
    if (nodeIndex === null) return;

    if (tree[nodeIndex].left !== null) {
      await inorderTraversal(tree[nodeIndex].left);
    }

    setVisitedNodes(prev => [...prev, nodeIndex]);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (tree[nodeIndex].right !== null) {
      await inorderTraversal(tree[nodeIndex].right);
    }
  };

  const postorderTraversal = async (nodeIndex: number | null) => {
    if (nodeIndex === null) return;

    if (tree[nodeIndex].left !== null) {
      await postorderTraversal(tree[nodeIndex].left);
    }
    if (tree[nodeIndex].right !== null) {
      await postorderTraversal(tree[nodeIndex].right);
    }

    setVisitedNodes(prev => [...prev, nodeIndex]);
    await new Promise(resolve => setTimeout(resolve, 600));
  };

  const bfsTraversal = async () => {
    const queue = [0];
    
    while (queue.length > 0) {
      const nodeIndex = queue.shift()!;
      setVisitedNodes(prev => [...prev, nodeIndex]);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (tree[nodeIndex].left !== null) {
        queue.push(tree[nodeIndex].left!);
      }
      if (tree[nodeIndex].right !== null) {
        queue.push(tree[nodeIndex].right!);
      }
    }
  };

  const startAnimation = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setVisitedNodes([]);

    switch (algorithmId) {
      case 'dfs-preorder':
        await preorderTraversal(0);
        break;
      case 'dfs-inorder':
        await inorderTraversal(0);
        break;
      case 'dfs-postorder':
        await postorderTraversal(0);
        break;
      case 'bfs-level-order':
        await bfsTraversal();
        break;
      default:
        await preorderTraversal(0);
    }

    setIsAnimating(false);
  };

  const reset = () => {
    setVisitedNodes([]);
    setIsAnimating(false);
  };

  const renderNode = (index: number, x: number, y: number, offset: number) => {
    const node = tree[index];
    const isVisited = visitedNodes.includes(index);
    const visitOrder = visitedNodes.indexOf(index);

    return (
      <g key={index}>
        {node.left !== null && (
          <line
            x1={x}
            y1={y}
            x2={x - offset}
            y2={y + 60}
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
        )}
        {node.right !== null && (
          <line
            x1={x}
            y1={y}
            x2={x + offset}
            y2={y + 60}
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r="24"
          className={`transition-all duration-300 ${
            isVisited ? 'fill-primary' : 'fill-card'
          }`}
          stroke="currentColor"
          strokeWidth="2"
          style={{
            strokeDasharray: isVisited ? '0' : '150',
            strokeDashoffset: isVisited ? '0' : '150'
          }}
        />
        <text
          x={x}
          y={y + 6}
          textAnchor="middle"
          className={`text-sm font-bold transition-colors ${
            isVisited ? 'fill-primary-foreground' : 'fill-foreground'
          }`}
        >
          {node.value}
        </text>
        {isVisited && visitOrder >= 0 && (
          <text
            x={x}
            y={y + 45}
            textAnchor="middle"
            className="text-xs fill-primary font-bold"
          >
            {visitOrder + 1}
          </text>
        )}
      </g>
    );
  };

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, offset: 80 },   // 0
      { x: 120, y: 100, offset: 40 },  // 1
      { x: 280, y: 100, offset: 40 },  // 2
      { x: 80, y: 160, offset: 0 },    // 3
      { x: 160, y: 160, offset: 0 },   // 4
      { x: 240, y: 160, offset: 0 },   // 5
      { x: 320, y: 160, offset: 0 }    // 6
    ];

    return (
      <svg width="400" height="220" className="mx-auto">
        {positions.map((pos, index) => 
          renderNode(index, pos.x, pos.y, pos.offset)
        )}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? 'Animating...' : 'Start Animation'}
        </button>
        <button
          onClick={reset}
          disabled={isAnimating}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        {renderTree()}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {visitedNodes.length > 0 && (
          <p>Visit order: {visitedNodes.map(i => tree[i].value).join(' → ')}</p>
        )}
      </div>
    </div>
  );
};
