import React, { useMemo } from 'react';
import { deserializeTree, calculateTreePositions, parseTreeValue } from '@/utils/treeUtils';

interface TreeDiagramProps {
    data: any; // Can be array, stringified array, or TreeNode structure
    className?: string;
    width?: number;
    height?: number;
}

export const TreeDiagram: React.FC<TreeDiagramProps> = ({
    data,
    className = "",
    width = 400,
    height = 250
}) => {
    const { nodes, edges } = useMemo(() => {
        let root = null;
        const treeData = parseTreeValue(data);

        if (treeData) {
            root = deserializeTree(treeData);
        } else if (typeof data === 'object' && data !== null && 'val' in data) {
            root = data;
        }

        if (!root) return { nodes: [], edges: [] };

        // Dynamically adjust row height based on tree depth? For now keep it static.
        return calculateTreePositions(root, width);
    }, [data, width]);

    if (nodes.length === 0) {
        return (
            <div className={`p-4 text-center text-muted-foreground text-sm border border-dashed rounded-lg ${className}`}>
                Empty Tree
            </div>
        );
    }

    // Calculate dynamic height based on nodes' y positions
    const maxHeight = Math.max(...nodes.map(n => n.y)) + 40;
    const svgHeight = Math.max(height, maxHeight);

    return (
        <div className={`relative bg-background/50 border rounded-lg p-2 overflow-auto no-scrollbar ${className}`}>
            <svg
                width={width}
                height={svgHeight}
                className="mx-auto overflow-visible"
                viewBox={`0 0 ${width} ${svgHeight}`}
            >
                {/* Render Edges */}
                {edges.map((edge, i) => (
                    <line
                        key={`edge-${i}`}
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke="currentColor"
                        className="text-muted-foreground/40"
                        strokeWidth="1.5"
                    />
                ))}

                {/* Render Nodes */}
                {nodes.map((node) => (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="18"
                            className="fill-card stroke-primary/50"
                            strokeWidth="1.5"
                        />
                        <text
                            x={node.x}
                            y={node.y + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground font-mono text-[10px] font-bold"
                        >
                            {node.val}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};
