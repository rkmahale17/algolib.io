import React, { useMemo } from 'react';
import { deserializeTree, calculateTreePositions, parseTreeValue, parseAllTreeValues } from '@/utils/treeUtils';

interface TreeDiagramProps {
    data: any; // Can be array, stringified array, or TreeNode structure
    className?: string;
    width?: number;
    height?: number;
    multiple?: boolean;
}

export const TreeDiagram: React.FC<TreeDiagramProps> = ({
    data,
    className = "",
    width = 400,
    height = 250,
    multiple = false
}) => {
    const trees = useMemo(() => {
        if (!multiple) {
            let root = null;
            const treeData = parseTreeValue(data);

            if (treeData) {
                root = deserializeTree(treeData);
            } else if (typeof data === 'object' && data !== null && 'val' in data) {
                root = data;
            }

            if (!root) return [];
            return [{ ...calculateTreePositions(root, width), label: null }];
        } else {
            const allTreeData = parseAllTreeValues(data);
            return allTreeData.map(tree => {
                const root = deserializeTree(tree.data);
                if (!root) return null;
                return { ...calculateTreePositions(root, width), label: tree.label };
            }).filter(Boolean) as any[];
        }
    }, [data, width, multiple]);

    if (trees.length === 0) {
        return (
            <div className={`p-4 text-center text-muted-foreground text-sm border border-dashed rounded-lg ${className}`}>
                Empty Tree
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {trees.map((tree, idx) => {
                const { nodes, edges, label } = tree;
                // Calculate dynamic height based on nodes' y positions
                const maxHeight = nodes.length > 0 ? Math.max(...nodes.map((n: any) => n.y)) + 40 : height;
                const svgHeight = Math.max(height, maxHeight);

                return (
                    <div key={idx} className="relative bg-background/50 border rounded-lg p-2 overflow-auto no-scrollbar">
                        {label && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
                                {label}
                            </div>
                        )}
                        <svg
                            width={width}
                            height={svgHeight}
                            className="mx-auto overflow-visible"
                            viewBox={`0 0 ${width} ${svgHeight}`}
                        >
                            {/* Render Edges */}
                            {edges.map((edge: any, i: number) => (
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
                            {nodes.map((node: any) => (
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
                                        className="fill-foreground font-mono text-[10px] font-"
                                    >
                                        {node.val}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                );
            })}
        </div>
    );
};
